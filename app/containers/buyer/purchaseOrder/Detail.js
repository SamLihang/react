/**
 * Created by Administrator on 2017/4/10.
 */

//订单详情（待付款）
import React, {Component} from "react";
import {InteractionManager, Platform, StyleSheet, TextInput, View} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {
    ActionCancelPurchaseOrder,
    ActionDetailsInspectionPurchaseOrder,
    ActionPurchaseOrderDetail,
    openOrdersDetail,
    ActionSettleAccount, ActionConfirmPay
} from "../../../actions/PurchaseOrderAction";
import {formaTime, toDecimal2} from "../../../utils/FormatUtil";
import PasswordInput from "../../../components/PasswordInput";
import CheckBox from "../../../components/CheckBox";
import {toastShort, confirm} from "../../../utils/ToastUtil";
import {fetchCheckPayPassword, fetchConfirmPayUrl, fetchConfirmPay} from "../../../services/PurchaseOrderServices";
import {ActionPurchaseOrders7,} from '../../../actions/PurchaseOrderAction';
import {ActionAccountDetail} from "../../../actions/AccountAction";
import {print} from '../../buyer/my/PrintSetup';

//支付遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
        _changeText: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    endText(password) {
        this.props._changeText(password);
    }

    render() {

        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 2,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    height: Platform.OS == 'ios' ? 400 : 180
                }}>
                    <View style={[gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(49),
                        borderBottomWidth: px2dp(0.5),
                        alignItems: 'center'
                    }]}>
                        <BCTouchable onPress={() => this.props.Cancle()}>
                            <BCImage style={{marginLeft: px2dp(12)}}
                                     source={require("../../../imgs/close.png")}></BCImage>
                        </BCTouchable>
                        <BCText
                            style={[gs.fts_17, {color: 'black', marginLeft: px2dp(100)}]}>请输入支付密码</BCText>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(15)}}>
                        <PasswordInput maxLength={6} onEnd={(text) => {
                            this.endText(text);
                        }}/>
                    </View>

                    <BCTouchable onPress={() => {
                        this.props.navigation.navigate('RevisePayPassword')
                    }} style={{marginTop: px2dp(12), marginLeft: px2dp(282)}}>
                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>
                </View> : null
        )
    }
}

//支付方式
class PayType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            defaultName: this.props.defaultName,
            defaultValue: this.props.defaultValue,
            AuditState: this.props.AuditState,
            BCompanyId: this.props.BCompanyId,
            SCompanyId: this.props.SCompanyId,
            success: 0,
            isDelete: true,
            _PayTypes: [{
                Ico: require("../../../imgs/complete.png"),
                Name: '支付宝',
                Value: 3
            }, {
                Ico: require("../../../imgs/Balancepayment.png"),
                Name: '余额',
                Value: 4
            }, {
                Ico: require("../../../imgs/pay2.png"),
                Name: '账期',
                Value: 5
            }]
            // , {
            //     Ico: require("../../../imgs/Offlinepayment.png"),
            //     Name: '货到付款',
            //     Value: 1
            // }]
        }
    }

    _PayTypes = [{
        Ico: require("../../../imgs/complete.png"),
        Name: '支付宝',
        Value: 3
    }, {
        Ico: require("../../../imgs/Balancepayment.png"),
        Name: '余额',
        Value: 4
    }, {
        Ico: require("../../../imgs/pay2.png"),
        Name: '账期',
        Value: 5
    }]
    // , {
    //     Ico: require("../../../imgs/Offlinepayment.png"),
    //     Name: '货到付款',
    //     Value: 1
    // }]

    static propTypes = {
        defaultName: React.PropTypes.string,
        defaultValue: React.PropTypes.number,
    }


    //支付方式选择
    _onPress() {
        const SCompanyId = this.props.SCompanyId;
        const BCompanyId = this.props.BCompanyId;
        const AuditState = this.props.AuditState;
        let PayType = this.state._PayTypes;
        fetchConfirmPay({BCompanyId, SCompanyId}).then((ret) => {
            if (ret.data) {
                if (ret.data.success == 1 && this.state.isDelete) {             //1是未合作或者账期有欠款  不允许使用账期  0是可以
                    PayType.map((item, index) => {
                        if (item.Name === "账期") {
                            PayType.splice(index, 1);
                        }
                    });
                    this.setState({
                        _PayTypes: PayType,
                        isDelete: false,
                    });
                }
            }
            else if (ret.error) {
            }
        }).catch((e) => {
        });
        // if (AuditState !== 1 && this.state.isDelete) {
        //     PayType.map((item, index) => {
        //         if (item.Name === "货到付款") {
        //             PayType.splice(index, 1);
        //         }
        //     });
        //     this.setState({
        //         _PayTypes: PayType,
        //     });
        // }
        this.setState({
            isShow: !this.state.isShow,
        });
    }

    render() {
        return (
            <View>
                <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>支付方式</BCText>
                    <BCTouchable style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginRight: px2dp(12)
                    }}
                                 onPress={() => {
                                     this._onPress()
                                 }}>
                        <BCText
                            style={[gs.fts_14, gs.c_888, {marginRight: px2dp(7)}]}>{this.state.defaultName}</BCText>
                        <BCImage source={require('../../../imgs/up.png')}/>
                    </BCTouchable>
                </View>
                {
                    this.state.isShow ? this.state._PayTypes.map((payType, index) => {
                        return <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]} key={index}>
                            <View style={{flexDirection: 'row', marginLeft: px2dp(26)}}>
                                <BCImage source={payType.Ico}></BCImage>
                                <BCText
                                    style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(7)}]}>{payType.Name}</BCText>
                            </View>
                            <CheckBox
                                IsSelect={this.state.defaultValue == payType.Value ? true : false}
                                OnChange={(isSelect) => {
                                    if (isSelect) {
                                        this.setState({
                                            defaultName: payType.Name,
                                            defaultValue: payType.Value
                                        });
                                    }
                                    this.setState({
                                        isShow: !this.state.isShow
                                    })
                                }}/>
                        </View>
                    }) : null
                }
            </View>
        )
    }
}

const OrderState = {
    //已完成
    ToCompleted: 9,
    //不合格
    ToBadCompleted: 11
}

class Detail extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            Text: "",
        }
    }

    static propTypes = {
        Text: React.PropTypes.string,
        OnCheck:React.PropTypes.func,
    }
    static defaultProps = {
        Text: '',
    }

    _PayType = null

    onBack(){
        if(this.params.pageForm&&this.params.pageForm=="Jpush"){
            this.push("BuyerIndex");
        }
    }

    //设置页面标题
    setTitle() {
        let OrderState = null;
        if (this.params && this.params.PurchaseOrderState) {
            OrderState = this.params.PurchaseOrderState;
        }
        switch (OrderState) {
            case 1:
                return "订单详情(待付款)";
                break;
            case 3:
                return "订单详情(待接单)";
                break;
            case 4:
                return "订单详情(待发货)";
                break;
            case 5:
                return "订单详情(待验货)";
                break;
            case 7:
                return "订单详情(已完成)";
                break;
            default:
                return "订单详情";
                break;
        }

    }

    renderAddress(ContactName, Phone, Address) {
        return (
            <View style={Styles.detailHead}>
                <View style={Styles.information}>
                    <BCImage source={require("../../../imgs/position.png")}></BCImage>
                    <View style={Styles.info}>
                        <View style={Styles.consignee}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_fff]}>收 货 人 ：{ContactName}</BCText>
                            <BCText style={[gs.fts_13, gs.c_fff, {paddingRight: px2dp(20)}]}>{Phone}</BCText>
                        </View>
                        <View style={Styles.address}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_fff]}>收货地址：</BCText>
                            <BCText style={[gs.fts_13, Styles.addressTitle, gs.c_fff]}>
                                {substr('' + Address + '', 40)}
                            </BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderBtnPay() {
        const {dispatch, navigation, currentEmployee} = this.props;
        let OrderState = this.params.PurchaseOrderState;
        let purchaseOrderId = this.params.PurchaseOrderId;
        const reducePurchaseOrderDetail = this.props.ReducePurchaseOrderDetail;
        let datas = reducePurchaseOrderDetail.datas;
        let PayType = datas.PayType;
        let SettleTypeId = datas.SettleTypeId;
        let SettleStatusId = datas.SettleStatusId;
        if (OrderState == 1) {
            return (
                <View style={{flexDirection: "row",}}>
                    <BCTouchable style={[{backgroundColor: "#6c768a"}, Styles.pay2]}
                                 onPress={() => {
                                     this._Loading.Trigger(true);
                                     dispatch(ActionCancelPurchaseOrder(purchaseOrderId));
                                     if (navigator) {
                                         navigation.goBack();
                                     }
                                 }}
                    >
                        <BCText style={[gs.c_fff, gs.fts_15]}>取消订单</BCText>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.ToPay()
                    }} style={[gs.bgc_00c164, Styles.pay2]}>
                        <BCText style={[gs.c_fff, gs.fts_15]}>去结算</BCText>
                    </BCTouchable>
                </View>
            )
        }
        else if (OrderState == 7) {
            return (
                <View style={{flexDirection: "row",}}>

                    {/*PayType === 1 && SettleTypeId === 2 && SettleStatusId < 5 ?
                            <BCTouchable onPress={() => {
                                //关闭按钮的提示窗
                                let self = this;
                                confirm("确定要付款吗？", function () {
                                    const purchaseOrderId = datas.PurchaseOrderId;
                                    dispatch(ActionConfirmPay({purchaseOrderId}));
                                    {/!*  fetchConfirmPayUrl({purchaseOrderId}).then((ret) => {
                                     if (ret.data ) {
                                     const {dispatch} = this.props;
                                     dispatch(ActionPurchaseOrders7({p: 1, t: 7}));
                                     toastShort("付款成功");
                                     }
                                     }).catch((e) => {
                                     toastShort("付款失败");

                                     });*!/
                                    }
                                }, function () {
                                    return false
                                });

                            }} style={[{backgroundColor: "#ff9c12"}, Styles.pay]}>
                                <BCText style={[gs.c_fff, gs.fts_17]}>确认付款</BCText>
                            </BCTouchable> : null*/}

                    <BCTouchable onPress={() => {
                        this.push('ApplyService', {
                            data: {
                                purchaseOrderNo: datas.PurchaseOrderNo,
                                purchaseOrderId: datas.PurchaseOrderId,
                                salesOrderId: datas.SalesOrderId,
                                sCompanyId: datas.SCompanyId,
                                purchaseOrderLines: datas.PurchaseOrderLines,
                                ActualAmount: datas.ActualAmount
                            }
                        })
                    }} style={[Styles.pay, {backgroundColor: '#6c768a'}]}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>申请售后</BCText>
                    </BCTouchable>
                    <BCTouchable style={[{backgroundColor: '#31ca96'}, Styles.pay]}
                                 onPress={() => {
                                     let printDate = [];
                                     printDate.push({
                                             CreateTime: datas.CreateTime,
                                             CompanyName: datas.BCompanyFullName,
                                             Phone: datas.Phone,
                                             bian: datas.ActualAmount,
                                             ActualAmount: datas.ActualAmount,
                                             ContactName: datas.ContactName,
                                             Address: datas.Address,
                                             Remark: datas.Remark,
                                             OrderNo: datas.PurchaseOrderNo,
                                             Items: datas.PurchaseOrderLines,
                                         }
                                     );
                                     // if (printDate.length > 0) {
                                     //     this.push("PrintSetup", printDate);
                                     // } else {
                                     //     toastShort("请选中需要打印的内容")
                                     // }
                                     if(printDate.length > 0 ){
                                     if(BluetoothConnection){
                                         print(printDate);
                                     } else {
                                         this.push("PrintSetup", printDate);
                                     }
                                 } else {
                                     toastShort("请选中需要打印的内容")
                                    }
                                 }}
                    >
                        <BCText style={[gs.c_fff, gs.fts_17]}>打印</BCText>
                    </BCTouchable>
                </View>
            )
        }
        else if (OrderState == 3) {
            return (
                <BCTouchable style={[{backgroundColor: "#00c164"}, Styles.pay]}
                             onPress={() => {
                                 this._Loading.Trigger(true);
                                 dispatch(ActionCancelPurchaseOrder(purchaseOrderId));
                                 if (navigator) {
                                     navigation.goBack();
                                 }
                             }}
                >
                    <BCText style={[gs.c_fff, gs.fts_17]}>取消订单</BCText>
                </BCTouchable>
            )
        }
    }

    //查看明细
    onSelectDetail(CompanyId, isOpen) {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch} = this.props;
            dispatch(openOrdersDetail(CompanyId, isOpen));
        });
    }

    //订单
    renderList(e, i) {
        let OrderState = this.params.PurchaseOrderState;
        if (OrderState==7){
            return (
                <View key={i}>
                    <BCTouchable style={[Styles.listItem]}>
                        {
                            e.Image!=null?
                                <BCHostImage style={Styles.productImg}
                                             source={{uri: e.Image}}/>
                                :
                                <BCImage style={Styles.productImg}
                                         source={require('../../../imgs/LOGO.png')} />
                        }

                        <View style={Styles.listItemRight}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr('' + e.ProductName + '', 10)}</BCText>
                            <BCText style={[gs.fts_13, gs.c_666,]}>¥{toDecimal2(e.Price*e.UnitAmount)}/{e.DisplayUnit}({e.UnitAmount}{e.Unit})</BCText>
                            {/*订*/}
                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(15)}]}>
                                {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    ¥{toDecimal2(e.Price*e.Quantity*e.UnitAmount)}/{toDecimal2(e.Quantity*e.UnitAmount)}{e.Unit}
                                </BCText>
                            </View>
                            {/*实*/}
                            <View style={Styles.listDetail}>
                                <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{toDecimal2(e.Price)}/{e.Unit}</BCText>
                                {/*<BCText style={[gs.fts_13, gs.c_666,]}>{e.Spec}(¥{toDecimal2(e.Price*e.UnitAmount)})</BCText>*/}
                                <View style={[Styles.number,{flexDirection:'row'}]}>
                                    {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                    <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#f1cdda',borderWidth:px2dp(0.5),borderColor:'#f0578c',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                        <BCText style={[gs.fts_12,{color:'#f0578c'}]}>实</BCText>
                                    </View>

                                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                        ¥{toDecimal2(e.Price*e.RealQuantity)}/{e.RealQuantity}{e.Unit}
                                    </BCText>
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            )
        }else{
            return (
                <View key={i}>
                    <BCTouchable style={[Styles.listItem]}>

                        {
                            e.Image!=null?
                                <BCHostImage style={Styles.productImg}
                                             source={{uri: e.Image}}/>
                                :
                                <BCImage style={Styles.productImg}
                                         source={require('../../../imgs/LOGO.png')} />
                        }
                       <View style={Styles.listItemRight}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr('' + e.ProductName + '', 10)}</BCText>
                            {/*<BCText*/}
                                {/*style={[gs.fts_13, gs.c_3a3838]}>{e.Spec}</BCText>*/}
                            <BCText style={[gs.fts_13, gs.c_3a3838]}>¥{toDecimal2(e.UnitAmount*e.Price)}/{e.DisplayUnit}({e.UnitAmount}{e.Unit})</BCText>
                            <View style={Styles.listDetail}>
                                <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{toDecimal2(e.Price)}/{e.Unit}</BCText>
                                {
                                    e.Price == e.OriginalPrice ?
                                        (null) :
                                        <View style={[Styles.actIcon, gs.bgc_fd0319,]}>
                                            {e.Price > e.OriginalPrice ?
                                                <BCText style={[gs.fts_10, gs.c_fff]}>升</BCText>
                                                :
                                                <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>
                                            }
                                        </View>
                                }
                                <View style={[Styles.number,{flexDirection:'row'}]}>
                                    {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                    <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                        <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                    </View>

                                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                        {/*¥{toDecimal2(product.Price*product.Quantity*product.UnitAmount)}/{toDecimal2(product.Quantity*product.UnitAmount)}斤*/}
                                        {toDecimal2(e.Quantity)}{e.DisplayUnit}({toDecimal2(e.Quantity*e.UnitAmount)}{e.Unit})
                                    </BCText>
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            )
        }
    }

    //不合格的订单
    renderBadList(Items) {
        let items = Items;
        return (
            items.map((item, index) => {
                return (
                    <View key={index}>
                        <BCTouchable style={[Styles.listItem]}>

                            {
                                e.Image!=null?
                                    <BCHostImage style={Styles.productImg}
                                                 source={{uri: e.Image}}/>
                                    :
                                    <BCImage style={Styles.productImg}
                                             source={require('../../../imgs/LOGO.png')} />
                            }
                            <View style={Styles.listItemRight}>
                                <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr('' + e.ProductName + '', 10)}</BCText>

                                {/*订*/}
                                <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(15)}]}>
                                    {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                    <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                        <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                    </View>

                                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                        ¥{toDecimal2(e.Price*e.Quantity*e.UnitAmount)}/{toDecimal2(e.Quantity*e.UnitAmount)}({e.Unit})
                                    </BCText>
                                </View>

                                <View style={Styles.listDetail}>
                                    {/*<BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{toDecimal2(e.Price)}/{e.Unit}</BCText>*/}
                                    <BCText style={[gs.fts_13, gs.c_666,]}>{e.Spec}(¥{toDecimal2(e.Price*e.UnitAmount)})</BCText>
                                    <View style={[Styles.number,{flexDirection:'row'}]}>
                                        {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                        <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#f1cdda',borderWidth:px2dp(0.5),borderColor:'#f0578c',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                            <BCText style={[gs.fts_12,{color:'#f0578c'}]}>实</BCText>
                                        </View>

                                        <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                            ¥{toDecimal2(e.Price*e.RealQuantity)}/{e.RealQuantity}({e.Unit})
                                        </BCText>
                                    </View>
                                </View>
                            </View>
                        </BCTouchable>

                        <BCText style={[gs.fts_13, {width: px2dp(285), height: px2dp(30), marginLeft: px2dp(69)}]}>
                            问题说明:{item.Remark}
                        </BCText>
                    </View>
                )
            })
        )
    }

    //判断显示完成订单的情况
    renderOrderList(e, i) {
        let self = this;
        if (this.state.OrderState == OrderState.ToBadCompleted) {
            return self.renderBadList(Items)
        } else {
            return self.renderList(e, i)
        }
    }

    content() {
        let OrderState = this.params.PurchaseOrderState;
        const {currentEmployee} = this.props;
        const reducePurchaseOrderDetail = this.props.ReducePurchaseOrderDetail;
        if (reducePurchaseOrderDetail.datas) {
            let datas = reducePurchaseOrderDetail.datas;
            let Items = datas.PurchaseOrderLines;
            let IsOpen = datas.IsOpen;
            let DeliveryAmount = datas.DeliveryAmount;
            let CompanyId = datas.BCompanyId;
            let AuditState = currentEmployee.AuditState;
            let self = this;

            let payType = null;
            switch (datas.PayType) {
                // case 1:
                //     payType = '货到付款';
                //     break;
                case 3:
                    payType = '支付宝';
                    break;
                case 4:
                    payType = '余额';
                    break;
                case 5:
                    payType = '账期';
                    break;
                default:
                    payType = '余额';
                    break;

            }


            return (
                <View style={[gs.bgc_f2f1ef, {paddingBottom: '20%'}]}>
                    {this.renderAddress(datas.ContactName, datas.Phone, datas.Address)}
                    {/*订单*/}
                    <View style={[Styles.OrderNumber, gs.bgc_fff]}>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(12)}]}>订单编号:{datas.PurchaseOrderNo}</BCText>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: Platform.OS == 'ios' ? 50 : 70,marginRight: Platform.OS == 'ios' ? px2dp(6) : px2dp(8)}]}>{formaTime(datas.CreateTime, "yyyy-MM-dd hh:mm:ss")}</BCText>
                    </View>
                    {/*公司名称*/}
                    <View style={[Styles.companyName, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        {
                            datas.LogoImage?
                                <BCHostImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                             source={{uri: datas.LogoImage }}/>
                                :
                                <BCImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                         source={require('../../../imgs/LOGO.png')} />

                        }
                       <BCText
                            style={[gs.fts_16, gs.c_888, {marginLeft: px2dp(7)}]}>{datas.SCompanyFullName}</BCText>
                    </View>
                    {/*订单*/}
                    {
                        IsOpen ?
                            Items.map((e, i) => {
                                return self.renderOrderList(e, i)
                            }) :
                            Items.map((e, i) => {
                                if (i >= 2) {
                                    return false;
                                }
                                return self.renderList(e, i)
                            })
                    }
                    {/* 查看明细*/}
                    {
                        Items.length > 2 ?
                            <View style={Styles.lookDetail}>
                                <BCTouchable style={{flexDirection: "row", alignItems: 'center'}} onPress={() => {
                                    this.onSelectDetail(CompanyId, !IsOpen)
                                }}>
                                    {IsOpen ?
                                        <BCText style={[gs.fts_14, gs.c_888,]}>收起</BCText> :
                                        <BCText style={[gs.fts_14, gs.c_888,]}>查看明细</BCText>
                                    }
                                    <BCImage
                                        source={IsOpen ? require('../../../imgs/down.png') : require('../../../imgs/up.png')}
                                        style={{marginLeft: px2dp(5)}}/>
                                </BCTouchable>
                            </View> :
                            <View style={Styles.lookDetail}></View>
                    }
                    {/*配送方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>下单金额</BCText>
                        <View style={{flexDirection: 'row'}}>
                            <BCText
                                style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>￥ {datas.Amount}</BCText>
                        </View>
                    </View>
                    {/*配送方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>实际金额</BCText>
                        <View style={{flexDirection: 'row'}}>
                            <BCText
                                style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>￥ {datas.ActualAmount}</BCText>
                        </View>
                    </View>
                    {/*支付方式*/}
                    {
                        OrderState == 1 ?
                            <PayType defaultValue={4} defaultName='余额'
                                     AuditState={currentEmployee.AuditState}
                                     BCompanyId={datas.BCompanyId}
                                     SCompanyId={datas.SCompanyId}
                                     ref={(c) => {
                                         if (c) {
                                             this._PayType = c
                                         }
                                     }}/> :
                            <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                                <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>支付方式</BCText>
                                <View style={{flexDirection: 'row'}}>
                                    <BCText
                                        style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>{payType}</BCText>
                                </View>
                            </View>
                    }
                    {/*配送方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>配送方式</BCText>
                        <View style={{flexDirection: 'row'}}>
                            <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>商家配送</BCText>
                            <BCText
                                style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>{DeliveryAmount > 0 ? '￥'+DeliveryAmount : "￥ 0"}</BCText>
                        </View>
                    </View>
                    {/*买家留言*/}
                    <View style={[gs.bgc_fff, gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(45),
                        alignItems: 'center',
                        borderBottomWidth: 1
                    }]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>买家留言</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(18)}]}>{datas.Remark}</BCText>
                    </View>
                    {/*<View style={[Styles.count, gs.bgc_fff]}>*/}
                        {/*<BCText style={[gs.c_3a3838]}>共{this.TotalCount}件商品 合计:</BCText>*/}
                        {/*<BCText*/}
                            {/*style={[gs.c_fd0319, {marginRight: px2dp(5)}]}>￥{toDecimal2(this.ActualAmount + DeliveryAmount)}</BCText>*/}
                        {/*<BCText*/}
                            {/*style={[gs.c_b7b7b7, gs.fts_12, {*/}
                                {/*marginRight: px2dp(12)*/}
                            {/*}]}>（{this.DeliveryAmount ? '含配送费' + this.DeliveryAmount + '元' : "免配送费"})*/}
                        {/*</BCText>*/}
                    {/*</View>*/}
                </View>
            );
        } else {
            return this.noRecord()
        }

    }

    Bottom() {
        return (
            this.renderFooter(this.Amount, this.DeliveryAmount, this.PurchaseOrderId, this.BCompanyId, this.SalesOrderId, this.ActualAmount)
        )
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    //弹窗
    maksContent() {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                           _changeText={(password) => {
                               const {dispatch, ReducePurchaseOrderDetail} = this.props;
                               //验证支付密码是否正确
                               fetchCheckPayPassword({password}).then((ret) => {
                                   if (ret.data === null) {
                                       //支付密码正确后调用
                                       const purchaseOrderId = this.PurchaseOrderId;
                                       const payType = this._PayType.state.defaultValue;
                                       //this._Loading.Trigger(true);
                                       dispatch(ActionSettleAccount(
                                           {
                                               purchaseOrderId: purchaseOrderId,
                                               payType: payType,
                                           }));
                                       // 支付成功后自动关闭支付弹窗
                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                   }
                                   else if (ret.error) {
                                       toastShort("支付失败,请重新输入支付密码");
                                       this._Loading.Trigger(false);
                                   }

                               }).catch((e) => {
                                   toastShort("支付失败,请重新输入支付密码");
                                   this._Loading.Trigger(false);

                               });

                           }}
                           navigation={this.navigation}

                />
            </View>
        )
    }

    renderFooter1(Amount, DeliveryAmount) {
        if (DeliveryAmount > 0) {
            Amount = Amount + DeliveryAmount;
        }
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.footer}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: px2dp(12)
                    }}>
                        <BCText style={[gs.c_fff, gs.fts_16]}>￥{toDecimal2(Amount)}元</BCText>
                    </View>
                </View>
            </View>
        )
    }

    renderFooter2(Amount, DeliveryAmount, PurchaseOrderId, BCompanyId, SalesOrderId, ActualAmount) {
        // if (DeliveryAmount > 0) {
            // Amount = Amount + DeliveryAmount;
            // ActualAmount = ActualAmount + DeliveryAmount;
        // }
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.singleFooter}>
                    <View style={[Styles.money]}>
                        <View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>
                            <BCText style={[gs.c_fff, gs.fts_14]} onPress={() => this.onCloseMask()}>总额:
                                ￥{toDecimal2(Amount)}元</BCText>
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>
                            <BCText style={[gs.c_fff, gs.fts_14]}>实际总额:￥{toDecimal2(ActualAmount)}元</BCText>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <BCTouchable onPress={() => {
                            this.quickSign(PurchaseOrderId, BCompanyId, SalesOrderId)
                        }} style={[Styles.pay2, {backgroundColor: '#6c768a'}]}><BCText        //6c768a
                            style={[gs.c_fff, gs.fts_15]}>快速签收</BCText></BCTouchable>
                        <BCTouchable onPress={() => {
                            this.push('CheckDetail', {PurchaseOrderId, dataSource: this.state.dataSource, index: this.params.pageForm=="Jpush"?"Jpush":2})
                        }} style={[gs.bgc_00c164, Styles.pay2]}><BCText
                            style={[gs.c_fff, gs.fts_15]}>详细验货</BCText></BCTouchable>
                    </View>
                </View>
            </View>
        )
    }

    //快速签收
    quickSign(PurchaseOrderId, BCompanyId, SalesOrderId) {
        const {dispatch} = this.props;
        let SignData = {
            PurchaseOrderId: PurchaseOrderId,
            ActualAmount: this.Amount,
            SalesOrderId: SalesOrderId,
            BCompanyId: BCompanyId,
            PurchaseOrderLines: {Items: []}
        };

        this.state.dataSource.map((data, index) => {
            SignData.PurchaseOrderLines.Items.push(
                {
                    ActualQuantity: data.RealQuantity,
                    BCompanyId: BCompanyId,
                    PurchaseOrderId: data.PurchaseOrderId,
                    PurchaseOrderLineId: data.PurchaseOrderLineId,
                    Remark: "",
                }
            );
        });

        let purchaseOrderStr = JSON.stringify(SignData);
        this._Loading.Trigger(true);
        dispatch(ActionDetailsInspectionPurchaseOrder(purchaseOrderStr));

    }

    renderFooter3(Amount, DeliveryAmount, ActualAmount) {
        if (DeliveryAmount > 0) {
            Amount = Amount + DeliveryAmount;
            ActualAmount = ActualAmount + DeliveryAmount;
        }
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.singleFooter}>
                    <View style={[Styles.money]}>
                        {/*<View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>*/}
                            {/*<BCText style={[gs.c_fff, gs.fts_14]} onPress={() => this.onCloseMask()}>总额:*/}
                                {/*￥{toDecimal2(Amount)}元</BCText>*/}
                        {/*</View>*/}
                        {/*<View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>*/}
                            {/*<BCText style={[gs.c_fff, gs.fts_14]}>实际总额:￥{toDecimal2(ActualAmount)}元</BCText>*/}
                        {/*</View>*/}
                    </View>
                    {this.renderBtnPay()}
                </View>
            </View>
        )
    }

    //3种不同的地步样式
    renderFooter(Amount, DeliveryAmount, PurchaseOrderId, BCompanyId, SalesOrderId, ActualAmount) {
        let OrderState = this.params.PurchaseOrderState;
        if (OrderState == 4) {
            return this.renderFooter1(Amount, DeliveryAmount)
        } else if (OrderState == 5) {
            return this.renderFooter2(Amount, DeliveryAmount, PurchaseOrderId, BCompanyId, SalesOrderId, ActualAmount)
        } else if (OrderState == 7 || OrderState == 1 || OrderState == 3) {
            return this.renderFooter3(Amount, DeliveryAmount, ActualAmount)

        }
    }

    WillMount() {
        const {dispatch} = this.props;
        const {PurchaseOrderId} = this.params;
        dispatch(ActionPurchaseOrderDetail({purchaseOrderId: PurchaseOrderId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReducePurchaseOrderDetail.datas && nextProps.ReducePurchaseOrderDetail.datas != this.props.ReducePurchaseOrderDetail.datas) {
            const reducePurchaseOrderDetail = nextProps.ReducePurchaseOrderDetail;
            let datas = reducePurchaseOrderDetail.datas;
            //Id
            this.PurchaseOrderId = datas.PurchaseOrderId;
            this.BCompanyId = datas.BCompanyId;
            this.SalesOrderId = datas.SalesOrderId;
            let dataSource = datas.PurchaseOrderLines;
            let Items = datas.PurchaseOrderLines;
            //配送费
            let DeliveryAmount = datas.DeliveryAmount;

            //计算总量
            let TotalCount = 0;
            Items.map((item, index) => {
                TotalCount += item.Quantity;
            })
            this.TotalCount = TotalCount;

            //计算总额
            /*let Amount = 0;
             let lists = Items;
             lists.map((list, i) => {
             Amount += list.Amount;
             })
             this.Amount = Amount;*/
            this.DeliveryAmount = DeliveryAmount;
            this.Amount = datas.Amount

            //实际总额
            // this.ActualAmount=datas.ActualAmount
            this.ActualAmount = datas.ActualAmount


            this.setState({
                IsReceived: true,
                dataSource: dataSource
            });
        }
        if (nextProps.ReduceCancelPurchaseOrder.datas != null && nextProps.ReduceCancelPurchaseOrder.datas != this.props.ReduceCancelPurchaseOrder.datas) {
            if (this.params.dataSource) {
                var lists = this.params.dataSource;
                const key = this.params.key;
                lists.splice(key, 1);
                this.setState({
                    dataSource: lists
                })
            }
            toastShort("取消成功");
            this._Loading.Trigger(false);

            //取消订单成功立即刷新账期详情页面
            if (this.params && this.params.PurchaseOrderSettleId) {
                const {dispatch} = this.props;
                dispatch(ActionAccountDetail({PurchaseOrderSettleId: this.params.PurchaseOrderSettleId}));
            }
        }
        if (nextProps.ReduceDetailsInspectionPurchaseOrder.datas != null && nextProps.ReduceDetailsInspectionPurchaseOrder.datas != this.props.ReduceDetailsInspectionPurchaseOrder.datas) {
            this._Loading.Trigger(false);
            const {PurchaseOrderId, index} = this.params;
            const {navigation} = this.props;
            if(this.params.pageForm&&this.params.pageForm=="Jpush"){
                toastShort("验货成功");
                this.push('PurchaseOrderList', {initialPage: 3,pageFrom:"Jpush"})
                return;
            }
            if (navigator) {
                navigation.goBack();
                //this.push('BuyerIndex');
            }
            //toastShort("验货成功");

            //快速验货成功立即刷新账期详情页面
            if (this.params && this.params.PurchaseOrderSettleId) {
                const {dispatch} = this.props;
                dispatch(ActionAccountDetail({PurchaseOrderSettleId: this.params.PurchaseOrderSettleId}));
            }

        }
        if (nextProps.ReduceSettleAccount.datas != null && nextProps.ReduceSettleAccount.datas != this.props.ReduceSettleAccount.datas) {
            this._Loading.Trigger(false);
            const datas = nextProps.ReducePurchaseOrderDetail.datas;
            //收货地址
            let Address = datas.Address;
            let ContactName = datas.ContactName;
            let Phone = datas.Phone;
            let Items = datas.PurchaseOrderLines;
            //配送费
            let DeliveryAmount = datas.DeliveryAmount;

            //计算总量
            let TotalCount = 0;
            Items.map((item, index) => {
                TotalCount += item.Quantity;
            })
            this.TotalCount = TotalCount;

            //计算总额
            let Amount = 0;
            let lists = Items;
            lists.map((list, i) => {
                Amount += list.Amount;
            })
            this.Amount = Amount + DeliveryAmount;

            this.push('PaySuccess', {
                Address: Address,
                ContactName: ContactName,
                Phone: Phone,
                AllAmount: Amount,
                DeliveryAmounts: DeliveryAmount
            })
        }
        if (nextProps.ReduceSettleAccount.error != null && nextProps.ReduceSettleAccount.error != this.props.ReduceSettleAccount.error) {
            toastShort(nextProps.ReduceSettleAccount.error.message);
            this._Loading.Trigger(false);
        }
        if (nextProps.ReduceConfirmPay.datas != null && nextProps.ReduceConfirmPay.datas != this.props.ReduceConfirmPay.datas) {
            const {navigation} = this.props;
            if(this.params.pageForm&&this.params.pageForm=="Jpush"){
                this.push("BuyerIndex");
            }
            if (navigator) {
                navigation.goBack();
            }
        }
    }
}

const Styles = StyleSheet.create({
    detailHead: {
        width: '100%',
        height: px2dp(85),
        backgroundColor: '#6C768A',
    },
    information: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(19)
    },
    info: {
        width: deviceWidth - px2dp(32),
        height: px2dp(85),
        paddingTop: px2dp(18)
    },
    consignee: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    address: {
        paddingTop: px2dp(11),
        flexDirection: 'row'
    },
    addressTitle: {
        width: px2dp(208),
    },
    textStyle: {
        paddingLeft: px2dp(19),
    },
    OrderNumber: {
        height: px2dp(34),
        // marginTop: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: gs.bdc_e3e3e3
    },
    companyName: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
    },
    listItemRight: {
        justifyContent: "space-around",
        flex: 1
    },
    listBadItemRight: {
        justifyContent: "space-between",
        flex: 1
    },
    listItem: {
        paddingTop: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: "#f7f7f7",
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        paddingBottom:px2dp(8),
        borderBottomWidth:px2dp(0.5),
        borderBottomColor:'#d2d2d2',
    },
    listBadItem: {
        paddingTop: px2dp(12),
        //flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: "#f7f7f7",
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
    },
    listItemRightTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    listDetail: {
        flexDirection: "row",
    },
    handleProduct: {},
    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
        borderRadius: px2dp(2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        position: 'absolute', right: 0,
        marginLeft:px2dp(5),
    },
    badNumber: {
        marginTop: px2dp(40)
    },
    companyDetailBg: {
        height: px2dp(13),
        width: px2dp(12),
    },
    lookDetail: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(12),
        alignItems: "center",
        backgroundColor: '#f7f7f7',
        height: px2dp(40)
    },
    item: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textInputStyle: {
        width: deviceWidth - px2dp(91),
        height: px2dp(45)
    },
    count: {
        height: px2dp(49),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    count2: {
        height: px2dp(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: px2dp(5),
    },
    footerWrap: {
        width: '100%',
        height: px2dp(46),
        zIndex: 1,
        justifyContent: 'flex-end'
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#202020',
        opacity: 0.9
    },
    singleFooter: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'space-between',
        backgroundColor: '#202020',
        opacity: 0.9
    },
    pay: {
        width: Platform.OS == 'ios' ? px2dp(80) : px2dp(94),
        height: px2dp(46),
        justifyContent: 'center',
        alignItems: 'center',
    },
    pay2: {
        width: Platform.OS == 'ios' ? px2dp(75) : px2dp(94),
        height: px2dp(46),
        justifyContent: 'center',
        alignItems: 'center',
    },
    money: {
        height: '100%',
        paddingRight: px2dp(9),
        justifyContent: 'center'
    },
    singleMoney: {
        height: '100%',
        alignItems: 'center',
        marginLeft: px2dp(12),
        justifyContent: 'center'
    },
    cancleViewStyle: {
        height: px2dp(105),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancleButton: {
        width: px2dp(316),
        height: px2dp(39),
        borderWidth: px2dp(0.5),
        borderRadius: px2dp(2.5),
        marginTop: px2dp(13),
        marginBottom: px2dp(60),
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

function mapStateToProps(store) {
    return {
        ReducePurchaseOrderDetail: store.ReducePurchaseOrderDetail,
        ReduceCancelPurchaseOrder: store.ReduceCancelPurchaseOrder,
        ReduceDetailsInspectionPurchaseOrder: store.ReduceDetailsInspectionPurchaseOrder,
        ReduceSettleAccount: store.ReduceSettleAccount,
        ReduceConfirmPay: store.ReduceConfirmPay,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}

const connectPurchaseOrderDetail = connect(mapStateToProps)(Detail);
connectPurchaseOrderDetail.navigationOptions = NavigationOptions;
export default connectPurchaseOrderDetail;
/**
 * Created by Administrator on 2017/4/11.
 */
import React, {Component} from "react";
import {Platform, StyleSheet, TextInput, View} from "react-native";
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
import {ActionPurchaseOrderConfirm, ActionSettleAccounts} from "../../../actions/PurchaseOrderAction";
import {fetchCheckPayPassword, fetchSettleAccounts, fetchConfirmPay} from "../../../services/PurchaseOrderServices";
import CheckBox from "../../../components/CheckBox";
import PasswordInput from "../../../components/PasswordInput";
import {ActionDeleteShoppingCarts, DeleteCar, ActionShoppingCarts,} from "../../../actions/ShoppingCartAction";
import {connect} from "react-redux";
import {toastShort} from "../../../utils/ToastUtil";
import {toDecimal2} from '../../../utils/FormatUtil';


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
                    zIndex: 1000,
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
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(8)}}>
                        <PasswordInput maxLength={6} onEnd={(text) => {
                            this.endText(text);
                        }}/>
                    </View>

                    <BCTouchable onPress={() => {
                        this.props.navigation.navigate('RevisePayPassword', {pageFrom: 'ConfirmOrder'})
                    }} style={{marginTop: px2dp(12), marginLeft: px2dp(260)}}>
                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>

                </View> : (null)
        )
    }
}

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
    };


    //支付方式选择
    _onPress() {
        const SCompanyId = this.props.SCompanyId;
        const BCompanyId = this.props.BCompanyId;
        const AuditState = this.props.AuditState;
        let PayType = this.state._PayTypes;
        fetchConfirmPay({BCompanyId, SCompanyId}).then((ret) => {
            if (ret.data) {
                //console.log(ret);
                if (ret.data.success == 1 && this.state.isDelete) {             //1是未合作或者账期有欠款  不允许使用账期  0是可以
                    PayType.map((item, index) => {
                        if (item.Name === "账期") {
                            PayType.splice(index, 1);//移除 账期
                        }

                    });
                    this.setState({
                        _PayTypes: PayType,
                        // isDelete: false,
                    });
                }
            }
            else if (ret.error) {

            }
        }).catch((e) => {

        });
        this.setState({
            _PayTypes: PayType,
            isShow: !this.state.isShow,
        });
        // if (AuditState !== 1 && this.state.isDelete) {
        //     // PayType.map((item, index) => {
        //     //     if (item.Name === "货到付款") {
        //     //         PayType.splice(index, 1);
        //     //     }
        //     // });
        //     var payType =[];
        //     payType.push(PayType[3])
        //     this.setState({
        //         _PayTypes: payType,
        //         isShow: !this.state.isShow,
        //     });
        // }else{
        //     this.setState({
        //         _PayTypes: PayType,
        //         isShow: !this.state.isShow,
        //     });
        // }
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

class RenderListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsOpen: false,
            Text: "",
        }
    }


    _PayType = null
    static propTypes = {
        Company: React.PropTypes.object,
        _messgeFun: React.PropTypes.func,
        Text: React.PropTypes.string,
        AuditState: React.PropTypes.number,
        BCompanyId: React.PropTypes.number,
    };
    static defaultProps = {
        Company: {},
        Text: '',
    }

    // 产品列表
    renderProductItem(product, i) {
        return (
            <BCTouchable key={i} style={[Styles.listItem]}>
                <BCHostImage style={Styles.productImg} source={{uri: product.Image}}/>
                <View style={Styles.listItemRight}>
                    <BCText style={[gs.fts_16, gs.c_3a3838, gs.bold]}>{substr(''+product.ProductName+'',10)}</BCText>
                    {/*<BCText style={[gs.fts_13, gs.c_3a3838]}>{product.SpecName}</BCText>*/}
                    <BCText style={[gs.fts_13, gs.c_666,]}>¥{toDecimal2(product.Price*product.UnitAmount)}/{product.DisplayUnit}({product.UnitAmount}{product.Unit})</BCText>

                    <View style={Styles.listDetail}>
                        <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                        {
                            product.PriceChangeReason==0 ?
                                (null) :
                                <View style={[Styles.actIcon, gs.bgc_fd0319,{justifyContent:'center',alignItems:'center'}]}>
                                    {/*product.Price > product.OriginalPrice ?*/}
                                        {/*<BCText style={[gs.fts_10, gs.c_fff]}>升</BCText>*/}
                                        {/*:*/}
                                        <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>

                                </View>
                        }

                        <View style={[Styles.number,{flexDirection:'row'}]}>
                            <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                            </View>

                            <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                {toDecimal2(product.Quantity)}{product.DisplayUnit}({toDecimal2(product.Quantity*product.UnitAmount)}{product.Unit})
                            </BCText>
                        </View>
                    </View>
                    <View style={[Styles.hengXian,{left:0,width:px2dp(268)}]}></View>
                    {/*<View style={Styles.listDetail}>*/}
                        {/*<BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{toDecimal2(product.Price)}/{product.Unit}</BCText>*/}
                        {/*{*/}
                            {/*product.PriceChangeReason==1 ?*/}
                                {/*<BCImage style={[Styles.actIcon]} source={require('../../../imgs/drop.png')}/> : null*/}
                        {/*}*/}
                        {/*<View style={Styles.number}>*/}
                            {/*<BCText style={[gs.fts_11, gs.c_3a3838,]}>X{product.Quantity}</BCText>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                </View>
            </BCTouchable>
        )
    }

    //支付方式及其他
    renderMode(AuditState, BCompanyId, SCompanyId, e) {
        return (
            <View>
                <PayType defaultValue={3} defaultName="支付宝 "
                         AuditState={AuditState}
                         BCompanyId={BCompanyId}
                         SCompanyId={SCompanyId}
                         ref={(c) => {
                             if (c) {
                                 this._PayType = c;
                             }
                         }}/>
                {/*配送方式*/}
                <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>配送方式</BCText>
                    <View style={{flexDirection: 'row'}}>
                        <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>商家配送</BCText>
                        <BCText
                            style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>{this.props.DeliveryAmount}</BCText>
                    </View>
                </View>
                {/*买家留言*/}
                <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>买家留言</BCText>
                    <TextInput style={[Styles.textInputStyle, gs.fts_14]}
                               placeholder="特性需求在此输入"
                               placeholderTextColor='#b7b7b7'
                               underlineColorAndroid='transparent'
                               onEndEditing={(text) => {
                                   this.state.Text = text.nativeEvent.text;

                               }}

                    />
                </View>
                <View style={[Styles.count, gs.bgc_fff]}>
                    <BCText style={[gs.c_3a3838]}>共{this.props.TotalCount}件商品 合计:</BCText>
                    <BCText style={[gs.c_fd0319, {marginRight: px2dp(12)}]}>￥{toDecimal2(e.Amount)}</BCText>
                    {/*本界面Amount内已包含运费  其余界面内后台返回的Amount不包含运费，显示合计时需要前端自己+DeliveryAmount  */}
                </View>
            </View>
        )
    }

    messageFun(text) {
        this.props._messgeFun(text);
    }

    //查看明细按钮
    onSelectDetail() {
        this.setState({
            IsOpen: !this.state.IsOpen
        })
    }

    render() {
        const company = this.props.Company;
        const AuditState = this.props.AuditState;
        const BCompanyId = this.props.BCompanyId;
        let items = company.Items;
        let IsOpen = this.state.IsOpen;
        let self = this;
        let SCompanyId = company.CompanyId;
        return (
            <View>
                <View style={[Styles.companyName, gs.bgc_fff, gs.bdc_e3e3e3]}>
                    <BCHostImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                 source={{uri: company.LogoImage}}></BCHostImage>
                    <BCText style={[gs.fts_16, gs.c_888, {marginLeft: px2dp(7)}]}>{company.CompanyName}</BCText>
                </View>
                {
                    IsOpen ?
                        items.map((e, i) => {
                            return self.renderProductItem(e, i)
                        }) :
                        items.map((e, i) => {
                            if (i >= 2) {
                                return null;
                            }
                            return self.renderProductItem(e, i)
                        })
                }
                {
                    items.length > 2 ?
                        <View style={Styles.lookDetail}>
                            <BCTouchable
                                style={{flexDirection: "row", alignItems: 'center'}}
                                onPress={() => {
                                    this.onSelectDetail()
                                }}>
                                <BCText style={[gs.fts_14, gs.c_888,]}>{IsOpen ? "收起" : "查看明细"}</BCText>
                                <BCImage
                                    source={IsOpen ? require('../../../imgs/down.png') : require('../../../imgs/up.png')}
                                    style={{marginLeft: px2dp(5)}}/>
                            </BCTouchable>
                        </View> : null
                }
                {this.renderMode(AuditState, BCompanyId, SCompanyId, company)}
            </View>
        )
    }
}

class ConfirmOrder extends PullViewComponent {
    Amount = 0
    TotalCount = 0
    DeliveryFee = 0

    constructor(props) {
        super(props);
        this.state = {
            Address: {}
        };
    }

    //留言
    PurchaseOrderMessage = []

    _ToPayMaks = null;

    //设置页面标题
    setTitle() {
        return "确认订单"
    }

    // 收货地址
    renderAddress(address) {
        return (
            <View style={Styles.detailHead}>
                <BCTouchable onPress={() => {
                    this.push('AddressList', {
                        pageFrom: 'ConfirmOrder',
                        AddressId: address.AddressId || address.PurchaseOrderAddressId,
                        callBack: this.refeshView.bind(this)
                    })
                }} style={Styles.information}>
                    <BCImage source={require("../../../imgs/position.png")}/>
                    <View style={Styles.info}>
                        <View style={Styles.consignee}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_fff]}>收 货 人：{address.ContactName}</BCText>
                            <BCText style={[gs.fts_13, gs.c_fff, {marginLeft: px2dp(80)}]}>{address.Phone}</BCText>
                        </View>
                        <View style={Styles.address}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_fff]}>收货地址：</BCText>
                            <BCText style={[gs.fts_13, Styles.addressTitle, gs.c_fff]}>
                                {substr(address.Address, 40)}
                            </BCText>
                        </View>
                    </View>
                    <BCImage source={require("../../../imgs/right1.png")}
                             style={{width: px2dp(14), height: px2dp(14), marginLeft: px2dp(5)}}/>
                </BCTouchable>
            </View>
        )
    }

    _RenderListItem = []

    refeshView(msg) {
        this.setState({Address: msg});
    }

    content() {
        const {ReducePurchaseOrderConfirm, currentEmployee} = this.props;
        const {List} = ReducePurchaseOrderConfirm.datas;
        return (
            <View style={[gs.bgc_f2f1ef, {minHeight: deviceHeight + 1,paddingBottom:Platform.OS=='ios'?'50%':null}]}>
                {this.renderAddress(this.state.Address)}
                {
                    List.length > 0 ?
                        List.map((company, index) => {
                            return <RenderListItem
                                ref={(c) => {
                                    if (c) {
                                        this._RenderListItem.push(c);
                                    }
                                }}
                                BCompanyId={currentEmployee.CompanyId}
                                AuditState={currentEmployee.AuditState}
                                Company={company}
                                key={index}
                                DeliveryAmount={company.Type == 2 ? (company.ReplenishDeliveryAmount?'运费' + company.ReplenishDeliveryAmount +'元': "免配送费"):(company.DeliveryAmount?'运费' + company.DeliveryAmount +'元': "免配送费")}
                                // TotalCount={company.Amount}
                                TotalCount={this.TotalCount}
                                _messgeFun={(text) => {
                                }}
                            />
                        }) : null
                }
            </View>
        );
    }

    //底部
    Bottom() {
        return (
            this.renderBottom(this.Amount)
        )
    }

    renderBottom(Amount) {
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.footer}>
                    <View style={[Styles.money]}>
                        <BCText style={[gs.c_fff, gs.fts_16]}>￥{toDecimal2(Amount)}</BCText>
                        <BCText
                            style={[gs.c_b7b7b7, gs.fts_12]}>({this.DeliveryFee ? '含配送费' + this.DeliveryFee + '元' : "免配送费"})</BCText>
                    </View>
                    <BCTouchable onPress={() => {
                        this.ToPay(Amount);
                    }} style={[{backgroundColor:'#31ca96'}, Styles.pay]}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>确认</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    ToPay(Amount) {
        if (Amount === 0) {
            const {dispatch, navigation} = this.props;
            dispatch(ActionShoppingCarts());
            if (navigator) {
                navigation.goBack();
            }
        } else {
            this._Maks.Trigger(true);
            this._ToPayMaks.Trigger(true);
        }
    }

    //弹窗
    maksContent() {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._Maks.Trigger(false);
                               this._ToPayMaks.Trigger(false);
                           }}
                           _changeText={(password) => {
                               const {dispatch, ReducePurchaseOrderConfirm} = this.props;
                               //验证支付密码是否正确
                               fetchCheckPayPassword({password}).then((ret) => {
                                   if (ret.data === null) {
                                       //支付密码正确后调用
                                       let Address = this.state.Address;
                                       const {shoppingCartIds} = this.params;
                                       let payTypes = [];
                                       let purchaseOrderMessage = [];
                                       this._RenderListItem.map((item, index) => {
                                           const company = item.props.Company;
                                           const payType = item._PayType.state.defaultValue;
                                           payTypes.push(company.CompanyId + "-" + payType + "-" + company.Type);//公司id-支付方式-商场／补货
                                           purchaseOrderMessage.push({
                                               CompanyId: company.CompanyId,
                                               Message: item.state.Text,
                                               Type: company.Type,
                                           })
                                       })
                                       dispatch(ActionSettleAccounts(
                                           {
                                               addressId: Address.AddressId || Address.PurchaseOrderAddressId,
                                               shoppingCartIds: shoppingCartIds,
                                               payTypes: payTypes.join(','),
                                               purchaseOrderMessageStrs: JSON.stringify(purchaseOrderMessage),
                                           }));
                                       dispatch(ActionShoppingCarts());
                                       //this._Loading.Trigger(true);
                                       //自动关闭支付弹窗
                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                        // toastShort('支付成功～');
                                       this.push('PurchaseOrderList')
                                   }
                                   else if (ret.error) {
                                       if (ret.error.message == "请先设置支付密码") {
                                           toastShort(ret.error.message);
                                           this.push('RevisePayPassword', {pageFrom: 'ConfirmOrder'});
                                           this._ToPayMaks.Trigger(false);
                                           this._Maks.Trigger(false);
                                           this._Loading.Trigger(false);
                                       } else {
                                           // toastShort("支付失败,请重新输入支付密码");
                                           this._Loading.Trigger(false);
                                       }
                                   }

                               }).catch((e) => {
                                   toastShort("支付失败,请重新输入支付密码");
                                   this._Loading.Trigger(false);
                                   //刷新页面
                                   // const {shoppingCartIds} = this.params;
                                   // dispatch(ActionPurchaseOrderConfirm({shoppingCartIds: shoppingCartIds}));
                               });

                           }}
                           navigation={this.navigation}

                />
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {shoppingCartIds} = this.params;
        dispatch(ActionPurchaseOrderConfirm({shoppingCartIds: shoppingCartIds}));
    }

    WillReceive(nextProps) {
        const {dispatch, ReducePurchaseOrderConfirm} = this.props;

        if (nextProps.ReducePurchaseOrderConfirm.datas && nextProps.ReducePurchaseOrderConfirm.datas != this.props.ReducePurchaseOrderConfirm.datas) {
            const {ReducePurchaseOrderConfirm} = nextProps;
            let List = nextProps.ReducePurchaseOrderConfirm.datas.List;
            if (List.length > 0) {
                //起送价
                let startPrice = List[0].StartPrice;
                //起送量
                let startQuantiy = List[0].StartQuantity
                //配送价
                let DeliveryAmount = List[0].DeliveryAmount


                if (startPrice > 0) {
                    this.startPrice = startPrice;
                } else if (startQuantiy > 0) {
                    this.startQuantiy = startQuantiy;
                    this.startType = 0;
                }


                //计算总额
                let Amount = 0;
                let DeliveryFee = 0;
                List.map((list, i) => {
                    Amount += list.Amount;
                    if(list.Type ==2){
                        DeliveryFee += list.ReplenishDeliveryAmount;
                    }else {
                        DeliveryFee += list.DeliveryAmount;
                    }
                });
                this.Amount = Amount;
                this.DeliveryFee = DeliveryFee;
                //计算总量
                let TotalCount = 0;
                List[0].Items.map((item, i) => {
                    TotalCount += item.Quantity;
                })
                this.TotalCount = TotalCount;

                // //计算配送费
                // if (startPrice) {
                //     //使用 起送价
                //     //判断 总额是否大于起送价
                //     if (Amount < startPrice) {
                //         this.DeliveryFee = DeliveryAmount
                //     }
                // }
                // else {
                //     //使用 起送量
                //     //判断 总量是否大于起送量
                //     if (TotalCount < startQuantiy) {
                //         this.DeliveryFee = DeliveryAmount
                //     }
                // }

            }

            this.setState({
                IsReceived: true,
                Address: ReducePurchaseOrderConfirm.datas.Address
            });
        }

        if (nextProps.ReduceCheckPayPassword.error && nextProps.ReduceCheckPayPassword.error != this.props.ReduceCheckPayPassword.error) {
            //toastShort("支付失败,请重新输入支付密码");
            this._Loading.Trigger(false);
        }
        if (nextProps.ReduceSettleAccounts.datas && nextProps.ReduceSettleAccounts.datas != this.props.ReduceSettleAccounts.datas) {
            if (nextProps.ReduceSettleAccounts.datas.code > 0) {
                if (this._Loading) {
                    this._Loading.Trigger(false);
                }

                const data = nextProps.ReducePurchaseOrderConfirm.datas;
                let address = this.state.Address;
                //配送费
                const lists = data.List;
                //起送价
                let startPrice = lists[0].StartPrice;
                //起送量
                let startQuantiy = lists[0].StartQuantity;
                //配送价
                let DeliveryAmount = lists[0].DeliveryAmount;
                //计算配送费
                // if (startPrice) {
                //     //使用 起送价
                //     //判断 总额是否大于起送价
                //     if (AllAmount < startPrice) {
                //         this.DeliveryFee = DeliveryAmount
                //     }
                // }
                // else {
                //     //使用 起送量
                //     //判断 总量是否大于起送量
                //     if (TotalCount < startQuantiy) {
                //         this.DeliveryFee = DeliveryAmount
                //     }
                // }

                //计算总量
                let TotalCount = 0;
                lists[0].Items.map((item, i) => {
                    TotalCount += item.Quantity;
                })
                this.TotalCount = TotalCount;

                var AllAmount = 0;
                var DeliveryAmounts = 0;
                lists.map((lists, index) => {
                    AllAmount += lists.Amount;
                    DeliveryAmounts += list.DeliveryAmount;
                });

                // let DeliveryAmounts = this.DeliveryFee;
                // if (DeliveryAmounts != null) {
                //     AllAmount = AllAmount + DeliveryAmounts;
                // }

                dispatch(ActionShoppingCarts());

                this.push('PaySuccess', {
                    Address: address.Address,
                    ContactName: address.ContactName,
                    Phone: address.Phone,
                    AllAmount: AllAmount,
                    DeliveryAmounts: DeliveryAmounts
                });

            } else {
                toastShort('可用金额不足,支付失败');
                this.push('PurchaseOrderList', {initialPage: 0});
            }
        }
        if (nextProps.ReduceSettleAccounts.error && nextProps.ReduceSettleAccounts.error != this.props.ReduceSettleAccounts.error) {
            toastShort(nextProps.ReduceSettleAccounts.error.message);
            if (this._Loading) {
                this._Loading.Trigger(false);
            }

            dispatch(ActionShoppingCarts());
        }
    }

}

const Styles = StyleSheet.create({
    detailHead: {
        width: '100%',
        height: px2dp(85),
        backgroundColor: '#6C768A'
    },
    information: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px2dp(19)
    },
    info: {
        width: deviceWidth - px2dp(70),
        height: px2dp(85),
        paddingTop: px2dp(18),
    },
    consignee: {
        flexDirection: 'row',
        width: px2dp(290),
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
        marginTop: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: px2dp(0.5),
        borderBottomColor: gs.bdc_e3e3e3
    },
    companyName: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        marginTop: px2dp(10)
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
    listItem: {
        paddingTop: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: "#f7f7f7",
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        paddingBottom:px2dp(12),
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
    companyDetailBg: {
        height: px2dp(13),
        width: px2dp(12),
    },
    //查看详情
    lookDetail: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(12),
        alignItems: "center",
        backgroundColor: '#f7f7f7',
        height: px2dp(40)
    },
    titleText: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(12),
        alignItems: "center",
        height: px2dp(49),
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
    footerWrap: {
        width: '100%',
        height: px2dp(46),
        justifyContent: 'flex-end',
        zIndex: 1
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
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    money: {
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingRight: px2dp(9),
    },
    singleMoney: {
        height: '100%',
        alignItems: 'center',
        marginLeft: px2dp(12)
    },
    cancleViewStyle: {
        height: px2dp(75),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancleButton: {
        width: px2dp(316),
        height: px2dp(39),
        borderWidth: px2dp(0.5),
        borderRadius: px2dp(2.5),
        marginTop: px2dp(13),
        marginBottom: px2dp(22),
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center'
    },

    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
    },
    hengXian:{
        width:px2dp(200),
        height:px2dp(1),
        paddingRight: px2dp(12),
        backgroundColor:'#dbdbdb',
        position:'absolute',
        right:px2dp(12),
        bottom:0,
    },
});

function mapStateToProps(store) {
    return {
        ReducePurchaseOrderConfirm: store.ReducePurchaseOrderConfirm,
        ReduceSettleAccounts: store.ReduceSettleAccounts,
        ReduceCheckPayPassword: store.ReduceCheckPayPassword,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}

const connectPurchaseOrderConfirm = connect(mapStateToProps)(ConfirmOrder);
connectPurchaseOrderConfirm.navigationOptions = NavigationOptions;
export default connectPurchaseOrderConfirm;
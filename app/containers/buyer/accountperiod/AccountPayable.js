import React, {Component} from "react";
import {Platform, StyleSheet, View} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import PageComponent from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {ActionAccounts, ActionAccountDetail} from "../../../actions/AccountAction";
import {fetchCheckPayPassword} from "../../../services/PurchaseOrderServices";
import {fetchUpDateOrderOfflinePay} from "../../../services/AccountServices";
import CheckBox from "../../../components/CheckBox";
import PasswordInput from "../../../components/PasswordInput";
import {connect} from "react-redux";
import {toastShort} from "../../../utils/ToastUtil";
import {toDecimal2} from "../../../utils/FormatUtil";


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
                        borderBottomWidth: 1,
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

//选择支付方式
class PayType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            defaultName: this.props.defaultName,
            defaultValue: this.props.defaultValue
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
    },{
        Ico: require("../../../imgs/cash.png"),
        Name: '现金',
        Value: 'cash'
    },{
        Ico: require("../../../imgs/cheque.png"),
        Name: '支票',
        Value: 'cheque'
    },
    //     {
    //     Ico: require("../../../imgs/upline.png"),
    //     Name: '线下支付',
    //     Value: 1
    // }
    ]

    static propTypes = {
        defaultName: React.PropTypes.string,
        defaultValue: React.PropTypes.number,
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
                    }}>
                        <BCText
                            style={[gs.fts_14, gs.c_888, {marginRight: px2dp(7)}]}>{this.state.defaultName}</BCText>
                        <BCImage source={require('../../../imgs/right1.png')}/>
                    </BCTouchable>
                </View>
                {
                    this._PayTypes.map((payType, index) => {
                        return <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]} key={index}>
                            <View style={{flexDirection: 'row', marginLeft: px2dp(26),alignItems:'center'}}>
                                <BCImage style={{width:px2dp(22),height:px2dp(22)}} source={payType.Ico}></BCImage>
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
                                }}/>
                        </View>
                    })
                }
            </View>
        )
    }
}

class AccountPayable extends PageComponent {

    //设置页面标题
    setTitle() {
        return "账期结算"
    }

    //返回回调
    onBack() {
        //let callBack = this.navigation.state.params.callback;
        //callBack();
    }

    _ToPayMaks = null;
    _PayType = null;

    content() {
        return (
            <View style={Styles.mainStyle}>
                <PayType defaultValue={3} defaultName="支付宝  " ref={(c) => {
                    if (c) {
                        this._PayType = c;
                    }
                }}/>
            </View>
        )
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    //弹窗
    maksContent() {
        let PurchaseOrderSettleId = this.params.PurchaseOrderSettleId;
        let Price = this.params.price;
        let PurchaseOrderIds = this.params.PurchaseOrderIds
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false);
                               this._Maks.Trigger(false);
                           }}
                           _changeText={(password) => {
                               const {dispatch} = this.props;
                               this._Loading.Trigger(true);
                               //验证支付密码是否正确
                               fetchCheckPayPassword({password}).then((ret) => {
                                   if (ret.data === null) {
                                       //支付密码正确后调用
                                       /*let payTypes = [];
                                        this._PayType.map((item,index)=>{
                                        const payType = item._PayType.state.defaultValue;
                                        payTypes.push(payType);
                                        })*/
                                       let payType = this._PayType.state.defaultValue;
                                       //this._Loading.Trigger(true);
                                        if (payType=='cash'||payType=='cheque'){
                                            fetchUpDateOrderOfflinePay({
                                                purchaseOrderSettleId: PurchaseOrderSettleId,
                                                payType: payType,
                                                purchaseOrderIds: PurchaseOrderIds,
                                                amount: Price
                                            }).then((ret) => {
                                                if (!ret.error) {
                                                    toastShort("支付成功，等待对方确认");
                                                }else if (ret.error) {
                                                    toastShort(ret.error.message)
                                                    //this.onRefresh()
                                                }
                                            })
                                        }else{
                                            dispatch(ActionAccounts(
                                                {
                                                    purchaseOrderSettleId: PurchaseOrderSettleId,
                                                    payType: payType,
                                                    purchaseOrderIds: PurchaseOrderIds,
                                                    amount: Price
                                                }));
                                        }
                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                       this._Loading.Trigger(false);

                                   }
                                   else if (ret.error) {
                                       toastShort("支付失败,请重新输入支付密码");
                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                       this._Loading.Trigger(false);
                                   }

                               }).catch((e) => {
                                   toastShort("支付失败,请重新输入支付密码");
                                   this._ToPayMaks.Trigger(false);
                                   this._Maks.Trigger(false);
                                   this._Loading.Trigger(false);
                               });
                           }}
                           navigation={this.navigation}

                />
            </View>
        )
    }

    Bottom() {
        let Price = this.params.price
        return (
            this.renderBottom(Price)
        )
    }

    renderBottom(Price) {
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.footer}>
                    <BCText style={[gs.c_fff, gs.fts_16, {marginLeft: px2dp(15)}]}>￥{toDecimal2(Price)}元</BCText>
                    <BCTouchable onPress={() => {
                        this.ToPay();
                    }} style={[gs.bgc_fd0319, Styles.pay]}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>去支付</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    WillMount() {
        this.setState({
            IsReceived: true
        });
    }

    WillReceive(nextProps) {
        const {dispatch} = this.props;
        if (nextProps.ReduceCheckPayPassword.datas === null && nextProps.ReduceCheckPayPassword.datas != this.props.ReduceCheckPayPassword.datas) {
            //验证码正确后调用

            /* let Address = this.state.Address;
             const {shoppingCartIds} = this.params;
             let payTypes = [];
             this._RenderListItem.map((item) => {
             const company = item.props.Company;
             const payType = item._PayType.state.defaultValue;
             payTypes.push(company.CompanyId + "-" + payType + "-" + company.Type);//公司id-支付方式-商场／补货
             })*/
            this._Loading.Trigger(true);

            /*  dispatch(ActionSettleAccounts(
             {
             addressId: Address.AddressId || Address.PurchaseOrderAddressId,
             shoppingCartIds: shoppingCartIds,
             payTypes: payTypes.join(',')
             }));*/

            // 支付成功后自动关闭支付弹窗
            this._ToPayMaks.Trigger(false);
            this._Maks.Trigger(false);
        }
        if (nextProps.ReduceCheckPayPassword.error != null && nextProps.ReduceCheckPayPassword.error != this.props.ReduceCheckPayPassword.error) {
            this._Loading.Trigger(false);
        }
        if (nextProps.ReduceAccounts.datas && nextProps.ReduceAccounts.datas != this.props.ReduceAccounts.datas) {
            this._ToPayMaks.Trigger(false);
            this._Maks.Trigger(false);
            this._Loading.Trigger(false);

            if (nextProps.ReduceAccounts.datas.code == 1) {
                // 支付成功后自动关闭支付弹窗
                toastShort('结算成功');
                let callBack = this.navigation.state.params.callback;
                callBack();
                this.pop();
            }
            else {
                toastShort(nextProps.ReduceSettleAccounts.error);
            }
        }
    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        flex: 1,
    },
    item: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    footerWrap: {
        width: '100%',
        height: px2dp(66),
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
        zIndex: 1
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'space-between',
        backgroundColor: '#202020',
        opacity: 0.9,
        alignItems: 'center'
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
})

function mapStateToProps(store) {
    return {
        ReduceSettleAccounts: store.ReduceSettleAccounts,
        ReduceCheckPayPassword: store.ReduceCheckPayPassword,
        ReduceAccounts: store.ReduceAccounts
    }
}

const connectAccountPayable = connect(mapStateToProps)(AccountPayable);
connectAccountPayable.navigationOptions = NavigationOptions;
export default connectAccountPayable;
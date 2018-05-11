/**
 * Created by Administrator on 2017/5/3.
 */
import React, {Component} from "react";
import {StyleSheet, View, Platform} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import {toastShort} from "../../../utils/ToastUtil";
import gs from "../../../styles/MainStyles";
import PasswordInput from "../../../components/PasswordInput";
import {connect} from "react-redux";
import {ActionWithdrawalAdd, ActionMyAmount} from "../../../actions/MyAction";
import {ActionCheckPayPassword} from "../../../actions/PurchaseOrderAction";
import {fetchCheckPayPassword} from "../../../services/PurchaseOrderServices"

//说明遮罩层
class NewsPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showmaks: false
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func
    };

    Trigger(v) {
        this.setState({
            showmaks: v
        })
    }

    render() {
        return (
            this.state.showmaks ?
                <View style={[Styles.showMaksStyle, gs.bgc_fff]}>
                    <View style={{
                        height: px2dp(159),
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                        alignItems: 'center'
                    }}>
                        <BCText
                            style={[gs.fts_17, {
                                color: '#000',
                                paddingTop: px2dp(10),
                                paddingBottom: px2dp(10)
                            }]}>提现说明</BCText>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
                                <View style={{
                                    width: px2dp(4),
                                    height: px2dp(4),
                                    borderRadius: px2dp(50),
                                    backgroundColor: '#888'
                                }}></View>
                                <BCText
                                    style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>提现余额上限:50000元</BCText>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
                                <View style={{
                                    width: px2dp(4),
                                    height: px2dp(4),
                                    borderRadius: px2dp(50),
                                    backgroundColor: '#888'
                                }}></View>
                                <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>到账时间:3天内到账</BCText>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
                                <View style={{
                                    width: px2dp(4),
                                    height: px2dp(4),
                                    borderRadius: px2dp(50),
                                    backgroundColor: '#888'
                                }}></View>
                                <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>每日可提现次数:2次</BCText>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
                                <View style={{
                                    width: px2dp(4),
                                    height: px2dp(4),
                                    borderRadius: px2dp(50),
                                    backgroundColor: '#888'
                                }}></View>
                                <BCText
                                    style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>可提现金额:账户可用余额</BCText>
                            </View>
                        </View>
                    </View>
                    <BCTouchable onPress={() => this.onCloseMask()} style={{
                        width: px2dp(259),
                        height: px2dp(47),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <BCText style={[gs.fts_16, {color: '#3b5df2'}]}>知道了</BCText>
                    </BCTouchable>
                </View> : null
        )
    }
}


//支付的遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        CancleToPayMaks: React.PropTypes.func,
        CancleMaks: React.PropTypes.func,
        _changeText: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    //输入结束后的方法
    endText(password) {
        try{
            this.props._changeText(password);
            this.props.CancleToPayMaks();
        }catch(e){
            toastShort(JSON.stringify(e))
        };
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
                        <BCTouchable onPress={() => {this.props.CancleToPayMaks();this.props.CancleMaks()}}>
                            <BCImage style={{marginLeft: px2dp(12)}}
                                     source={require("../../../imgs/close.png")}></BCImage>
                        </BCTouchable>
                        <BCText
                            style={[gs.fts_17, {color: 'black', marginLeft: px2dp(100)}]}>请输入支付密码</BCText>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(15)}}>
                        {/*支付弹窗组件*/}
                        <PasswordInput maxLength={6} onEnd={(text) => {
                            this.props.IsReceived();
                            this.endText(text);
                        }}/>
                    </View>

                    <BCTouchable style={{marginTop: px2dp(12), marginLeft: px2dp(282)}}>
                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>
                    {/* <View style={{alignItems: 'center', justifyContent: 'center', marginTop: px2dp(25)}}>
                     <BCText style={[gs.fts_14, gs.c_888]}>*未设置支付密码是，默认为登录密码</BCText>
                     </View>*/}
                </View> : null
        )
    }
}

class TakeCash extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            ifClickRight: false,//是否点击了标题右边
            showmaks: false,
        };
        this._ToPayMaks = null;
        this._NewsPayMaks = null;
    }


    //设置页面标题
    setTitle() {
        return "提现"
    }

    /* rightType() {
     return 'presentationnotes'
     }*/

    /*onClickNavigationRight() {
     /!*this.setState({
     showmaks: true,
     ifClickRight: true,//如果点击右边就为true
     });*!/
     //this.ToMaks();

     }*/

    ToMaks() {
        this._NewsPayMaks.Trigger(true);
        this._Maks.Trigger(true);
    }

    /* RightType() {
     return true
     }*/

    renderMode(WithdrawBankName, WithdrawAccount) {
        return (
            <View style={[Styles.BankStyle, gs.bgc_fff]}>
                <BCImage style={{marginLeft: px2dp(20)}} source={require('../../../imgs/Headportrait.png')}/>
                <View style={[{marginLeft: px2dp(14)}]}>
                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{WithdrawBankName}</BCText>
                    <BCText style={[gs.fts_13, gs.c_888]}>{WithdrawAccount}</BCText>
                </View>
            </View>
        )
    }

    onNext() {
        this.ToPay();
    }

    renderBotton() {
        return (
            <BCTouchable onPress={() => {
                this.onNext()
            }} style={[Styles.btnStyle, gs.bgc_00c164]}>
                <BCText style={[gs.fts_16, gs.c_fff]}>确认提现</BCText>
            </BCTouchable>
        )
    }

    content() {
        const ReducePurchasAccountBank = this.props.ReducePurchasAccountBank;
        if (ReducePurchasAccountBank.datas) {
            let datas = ReducePurchasAccountBank.datas
            return (
                <View style={[{flex: 1, height: deviceHeight}, gs.bgc_f2f1ef]}>
                    {this.renderMode(datas.WithdrawBankName, datas.WithdrawAccount)}
                    <View style={[Styles.moneyStyle, gs.bgc_fff]}>
                        <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(20)}]}>提现金额</BCText>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <BCText style={[gs.c_3a3838, {fontSize: px2dp(40), marginLeft: px2dp(20)}]}>¥</BCText>
                            <BCText style={[gs.c_3a3838, gs.bold, {
                                fontSize: px2dp(50),
                                marginLeft: px2dp(10)
                            }]}>{datas.Amount}</BCText>
                        </View>
                    </View>
                    {this.renderBotton()}
                </View>
            )
        } else {
            return this.noRecord()
        }
    }

    ToPay() {
        /*this.setState({
         showmaks: true,
         ifClickRight: true,//如果点击右边就为true
         });*/
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    //弹窗
    maksContent() {
        return (
            <View>
                {/* <NewsPayMaks

                 ref={(ref) => this._NewsPayMaks = ref}
                 Cancle={() => {
                 this._NewsPayMaks.Trigger(false);
                 this._NewsPayMaks.Trigger(false);
                 }}

                 />*/}
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           CancleToPayMaks={() => {
                               this._ToPayMaks.Trigger(false);
                           }}
                           IsReceived={()=>{
                               this.setState({IsReceived:false})
                           }}
                           CancleMaks={() => {
                               this._Maks.Trigger(false);
                           }}
                           _changeText={(password) => {
                               const {dispatch} = this.props;
                               //验证支付密码是否正确
                               fetchCheckPayPassword({password}).then((ret) => {
                                   this._ToPayMaks.Trigger(false);
                                   this._Maks.Trigger(false);
                                   this.setState({IsReceived:true});
                                   if (ret.data === null) {
                                       //支付密码正确后调用
                                       const ReducePurchasAccountBank = this.props.ReducePurchasAccountBank;
                                       let datas = ReducePurchasAccountBank.datas;
                                       let accountType = datas.WithdrawAccountTypeId;
                                       let withdrawAccount = datas.WithdrawAccount;
                                       let withdrawName = datas.WithdrawName;
                                       let withdrawBankName = '';
                                       let openBankName = '';
                                       let amount = datas.Amount;
                                       dispatch(ActionWithdrawalAdd({
                                           accountType,
                                           withdrawAccount,
                                           withdrawName,
                                           withdrawBankName,
                                           openBankName,
                                           amount
                                       }));

                                   }

                               }).catch((e) => {
                                   toastShort("提现失败");
                                   this._Loading.Trigger(false);

                               });
                           }}
                />
            </View>
        )
    }

    /* maksContent() {
     if (this.state.ifClickRight) {
     return (
     this.state.showmaks ? (
     <View style={[Styles.showMaksStyle, gs.bgc_fff]}>
     <View style={{
     height: px2dp(159),
     borderBottomWidth: 1,
     borderBottomColor: '#f0f0f0',
     alignItems: 'center'
     }}>
     <BCText
     style={[gs.fts_17, {color: '#000', paddingTop: px2dp(10), paddingBottom: px2dp(10)}]}>提现说明</BCText>
     <View>
     <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
     <View style={{
     width: px2dp(4),
     height: px2dp(4),
     borderRadius: px2dp(50),
     backgroundColor: '#888'
     }}></View>
     <BCText
     style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>提现余额上线:50000元</BCText>
     </View>
     <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
     <View style={{
     width: px2dp(4),
     height: px2dp(4),
     borderRadius: px2dp(50),
     backgroundColor: '#888'
     }}></View>
     <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>到账时间:3天内到账</BCText>
     </View>
     <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
     <View style={{
     width: px2dp(4),
     height: px2dp(4),
     borderRadius: px2dp(50),
     backgroundColor: '#888'
     }}></View>
     <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>每日可提现次数:2次</BCText>
     </View>
     <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: px2dp(10)}}>
     <View style={{
     width: px2dp(4),
     height: px2dp(4),
     borderRadius: px2dp(50),
     backgroundColor: '#888'
     }}></View>
     <BCText
     style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(9)}]}>可提现金额:账户可用余额</BCText>
     </View>
     </View>
     </View>
     <BCTouchable onPress={() => this.onCloseMask()} style={{
     width: px2dp(259),
     height: px2dp(47),
     alignItems: 'center',
     justifyContent: 'center'
     }}>
     <BCText style={[gs.fts_16, {color: '#3b5df2'}]}>知道了</BCText>
     </BCTouchable>
     </View>

     ) :  null
     )
     }else{
     return (
     <View>
     <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
     Cancle={() => {
     this._ToPayMaks.Trigger(false);
     this._Maks.Trigger(false);
     }}
     _changeText={(password) => {
     const {dispatch} = this.props;
     //验证支付密码是否正确
     dispatch(ActionCheckPayPassword({password}));
     }}
     />
     </View>
     )
     }

     }*/


    //关闭弹窗
    onCloseMask() {
        this.setState({
            showmaks: false,
        });
        this._Maks.Trigger(false);

    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }

    WillReceive(nextProps) {
        const {dispatch} = this.props;
        if (nextProps.ReducePurchasWithdrawalAdd.datas && nextProps.ReducePurchasWithdrawalAdd.datas != this.props.ReducePurchasWithdrawalAdd.datas) {
            let money = nextProps.ReducePurchasWithdrawalAdd.datas;
            if (money) {
                // 提现成功后自动关闭支付弹窗
                this._ToPayMaks.Trigger(false);
                this._Maks.Trigger(false);
                //提现成功后
                dispatch(ActionMyAmount());
                toastShort("提现成功");

                let routeKey = this.props.navigation.state.key.split('-');
                routeKey[2] -= 1;
                this.props.navigation.goBack(routeKey.join('-'))
                
                /*if(this.params.pageFrom && this.params.pageFrom=='Buyer'){
                    this.push('MyAmount');

                }
                if(this.params.pageFrom && this.params.pageFrom=='Seller'){
                    this.push('SellerMyAmount');
                    this.pop();
                }*/
               // this.pop();

            }
        }
        if (nextProps.ReducePurchasWithdrawalAdd.error != null && nextProps.ReducePurchasWithdrawalAdd.error != this.props.ReducePurchasWithdrawalAdd.error) {
            toastShort(nextProps.ReducePurchasWithdrawalAdd.error.message);
            //失败关闭支付弹窗
            this._ToPayMaks.Trigger(false);
            this._Maks.Trigger(false);

        }
        if (nextProps.ReduceCheckPayPassword.error != null && nextProps.ReduceCheckPayPassword.error != this.props.ReduceCheckPayPassword.error) {
            toastShort("提现密码错误,请重新输入");
            this._Loading.Trigger(false);

        }
    }
}

const Styles = StyleSheet.create({
    BankStyle: {
        height: px2dp(70),
        flexDirection: 'row',
        marginTop: px2dp(10),
        alignItems: 'center'
    },
    moneyStyle: {
        height: px2dp(108),
        marginTop: px2dp(10),
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f1ef',
    },
    messageStyle: {
        height: px2dp(41),
        justifyContent: 'center',
    },
    messagesStyle: {
        height: px2dp(41),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputStyle: {
        width: deviceWidth - px2dp(43),
        fontSize: px2dp(50),
        margin: 5,
        padding: 0,
    },
    btnStyle: {
        width: px2dp(315),
        height: px2dp(43),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px2dp(2.5),
        marginTop: px2dp(27),
        marginLeft: px2dp(30)
    },
    showMaksStyle: {
        zIndex: 2,
        position: 'absolute',
        top: (deviceHeight - px2dp(206)) / 2,
        left: (deviceWidth - px2dp(259)) / 2,
        width: px2dp(259),
        height: px2dp(206),
        borderRadius: px2dp(10)
    }
})

function mapStateToProps(store) {
    return {
        ReducePurchasAccountBank: store.ReducePurchasAccountBank,
        ReducePurchasWithdrawalAdd: store.ReducePurchasWithdrawalAdd,
        ReduceCheckPayPassword: store.ReduceCheckPayPassword,
    }
}

const connectTakeCash = connect(mapStateToProps)(TakeCash);
connectTakeCash.navigationOptions = NavigationOptions;
export default connectTakeCash;
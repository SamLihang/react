/**
 * Created by Administrator on 2017/5/3.
 */
import React,{Component} from "react";
import {StyleSheet, TextInput, View,Platform} from "react-native";
import {BCText, BCTouchable,BCImage, deviceHeight, deviceWidth, NavigationOptions, px2dp} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import {toastLong,toastShort} from "../../../utils/ToastUtil";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionAccountBank, ActionAccountInfo} from "../../../actions/MyAction";
import PasswordInput from "../../../components/PasswordInput";
import {fetchCheckPayPassword} from "../../../services/PurchaseOrderServices";


class NotAccount extends PullViewComponent {
    _TextInput = null;
    _Presentationnotes = null;

    constructor(props) {
        super(props);
        this.state = {
           ifClickRight: false,//是否点击了标题右边
            amount: '',
            showMaks:false,
        }
    }

    //设置页面标题
    setTitle() {
        return "提现"
    }

    rightType() {
        return 'presentationnotes'
    }

    onClickNavigationRight() {
        this.setState({
            showMaks: true,
            ifClickRight: true,//如果点击右边就为true
        });
        this._Maks.Trigger(true);
    }

    RightType() {
        return true
    }


    renderMssage(UsabelBalance) {
        return (
            <View style={[Styles.messagesStyle, gs.bgc_fff]}>
                <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(20)}]}>可用余额 {UsabelBalance}</BCText>
                <BCTouchable onPress={() => {
                    this.onTakeCash(UsabelBalance)
                }}>
                    <BCText style={[gs.fts_14, gs.c_00C164, {marginRight: px2dp(11.5)}]}>全部提现</BCText>
                </BCTouchable>
            </View>
        )
    }

    onTakeCash(UsabelBalance) {
        this.setState({
            amount:UsabelBalance
        })
    }

    onNext() {
        const {dispatch} = this.props;
        var amount = this.state.amount.trim();
        if (amount == '') {
            toastLong("提现金额不能为空");
            return false;
        }
        if( this.params.pageFrom=='MyAmount'){
            this.push('TakeCash',{pageFrom:'Buyer'})
        }else{
            this.push('TakeCash',{pageFrom:'Seller'})
        }


        dispatch(ActionAccountBank({amount}));
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
        const ReducePurchasAccountInfo = this.props.ReducePurchasAccountInfo;
        if (ReducePurchasAccountInfo.datas) {
            let datas = ReducePurchasAccountInfo.datas
            return (
                <View style={[{flex: 1, height: deviceHeight}, gs.bgc_f2f1ef]}>
                    <View style={[Styles.moneyStyle, gs.bgc_fff]}>
                        <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(20)}]}>提现金额</BCText>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <BCText style={[gs.c_3a3838, {fontSize: px2dp(40), marginLeft: px2dp(20)}]}>¥</BCText>
                            <TextInput underlineColorAndroid='transparent'
                                       ref={(t) => {
                                           this._TextInput = t
                                       }}
                                       style={[Styles.inputStyle, gs.bold]}
                                       value={this.state.amount}
                                       onChangeText={(text) => this.setState({amount: text})}/>
                        </View>
                    </View>
                    {this.renderMssage(datas.UsabelBalance)}
                    {this.renderBotton()}
                </View>
            )
        } else {
            return this.noRecord()
        }
    }


    //弹窗
    maksContent() {
        if (this.state.ifClickRight) {
            return (
                this.state.showMaks ? (
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
                    </View>
                ) : (null)
            )
        }

    }

    //点击按钮
    onClickBtn() {
        this.setState({
            showMaks: true,
            ifClickRight: false
        });
    }

    //关闭弹窗
    onCloseMask() {
        this.setState({showMaks: false});
        this._Maks.Trigger(false);
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionAccountInfo())
        this.setState({
            IsReceived: true
        })
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
        zIndex: 1,
        position: 'absolute',
        top: (deviceHeight - px2dp(206)) / 2,
        left: (deviceWidth - px2dp(259)) / 2,
        width: px2dp(259),
        height: px2dp(206),
        borderRadius: px2dp(10),
        backgroundColor:"red",
    }
})
function mapStateToProps(store) {
    return {
        ReducePurchasAccountBank: store.ReducePurchasAccountBank,
        ReducePurchasAccountInfo: store.ReducePurchasAccountInfo
    }
}
const connectNotAccount = connect(mapStateToProps)(NotAccount);
connectNotAccount.navigationOptions = NavigationOptions;
export default connectNotAccount;
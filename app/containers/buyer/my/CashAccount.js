/**
 * Created by Administrator on 2017/5/4.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView, Platform, Alert} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, deviceHeight} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import {toastLong, confirm} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles'

//不同的提现账号
const AccountType = {
    //银行卡
    ToBank: 1,
    //支付宝
    ToAlipay: 3,
}

export default class CashAccount extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "提现账号验证"
    }

    constructor(props) {
        super(props);
        this.state = {
            AccountType: AccountType.ToAlipay,
            name: '',
            cardNumber: '',
            alipayAccount: '',
            alipayName: '',
        }
    }

    onConfirm() {
        if(this.state.AccountType == AccountType.ToBank){
            var name = this.state.name.trim();
            var cardNumber = this.state.cardNumber.trim();
            if (name == '') {
                toastLong("持卡人姓名不能为空");
                return false;
            }
            if (cardNumber == '') {
                toastLong("储蓄卡号不能为空");
                return false;
            }
        }else {
            var alipayAccount = this.state.alipayAccount.trim();
            var alipayName = this.state.alipayName.trim();
            if (alipayAccount == '') {
                toastLong("支付宝账户不能为空");
                return false;
            }
            if (alipayName == '') {
                toastLong("认证姓名不能为空");
                return false;
            }
        }
    }

    renderContent() {
        if (this.state.AccountType == AccountType.ToBank) {
            return (
                <View style={[Styles.passwordStyle, gs.bgc_fff]}>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>姓名</BCText>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="持卡人姓名"
                                   placeholderTextColor={gs.c_b7b7b7}
                                   underlineColorAndroid='transparent'
                                   value={this.state.name}
                                   onChangeText={(text) => this.setState({name: text})}/>
                    </View>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>卡号</BCText>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="储蓄卡号"
                                   placeholderTextColor={gs.c_b7b7b7}
                                   underlineColorAndroid='transparent'
                                   value={this.state.cardNumber}
                                   onChangeText={(text) => this.setState({cardNumber: text})}/>
                    </View>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {justifyContent: 'space-between'}]}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>银行</BCText>
                        <BCTouchable style={{flexDirection: 'row', marginRight: px2dp(17)}}>
                            <BCText style={[gs.fts_15, gs.c_888, {marginRight: px2dp(3.5)}]}>请选择银行卡</BCText>
                            <BCImage source={require('../../../imgs/right1.png')}/>
                        </BCTouchable>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[Styles.passwordsStyle, gs.bgc_fff]}>
                    <View style={[Styles.itemsStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                        <BCText style={[gs.fts_15, gs.c_888,{marginLeft:px2dp(45.5)}]}>支付宝账户:</BCText>
                        <TextInput style={Styles.inputStyle}
                                   placeholderTextColor={gs.c_3a3838}
                                   underlineColorAndroid='transparent'
                                   value={this.state.alipayAccount}
                                   onChangeText={(text) => this.setState({alipayAccount: text})}/>
                    </View>
                    <View style={[Styles.itemsStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        <BCText style={[gs.fts_15, gs.c_888]}>支付宝认证姓名:</BCText>
                        <TextInput style={Styles.inputStyle}
                                   placeholderTextColor={gs.c_3a3838}
                                   underlineColorAndroid='transparent'
                                   value={this.state.alipayName}
                                   onChangeText={(text) => this.setState({alipayName: text})}/>
                    </View>
                </View>
            )
        }

    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {this.renderContent()}
                <BCTouchable onPress={() => {
                    this.onConfirm()
                }} style={[Styles.btnStyle, gs.bgc_00c164]}>
                    <BCText style={[gs.fts_16, gs.c_fff]}>确认</BCText>
                </BCTouchable>
            </View>
        )
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

var Styles = StyleSheet.create({
    main: {
        flex: 1
    },
    passwordStyle: {
        height: px2dp(163),
        marginTop: px2dp(15)
    },
    passwordsStyle: {
        height: px2dp(90.5),
        marginTop: px2dp(15)
    },
    itemStyle: {
        height: px2dp(54),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(25)
    },
    itemsStyle: {
        height: px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(25)
    },
    inputStyle: {
        marginLeft: px2dp(25),
        height: px2dp(54),
        width: deviceWidth - px2dp(150)
    },
    codeBtnStyle: {
        width: px2dp(99),
        height: px2dp(28),
        borderWidth: px2dp(0.5),
        borderColor: '#d2d2d2',
        borderRadius: px2dp(14.3),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px2dp(25)
    },
    btnStyle: {
        width: px2dp(315),
        height: px2dp(43),
        borderRadius: px2dp(2.5),
        marginLeft: px2dp(30),
        marginTop: px2dp(26),
        justifyContent: 'center',
        alignItems: 'center'
    },
})
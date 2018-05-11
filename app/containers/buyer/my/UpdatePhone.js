import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr,NavigationOptions,deviceHeight} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import {toastShort} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles'
import TimerButton from "./TimerButton";
import {connect} from "react-redux";
import {fetchSendCode} from "../../../services/MyServices";
import {ActionBContactPhone} from "../../../actions/MyAction"

class UpdatePhone extends PageComponent {
    //设置页面标题
    setTitle() {
        return "修改联系电话"
    }

    constructor(props){
        super(props);
        this.state={
            code:'',
            phone:''
        }
    }

    onConfirm() {
        const {dispatch} = this.props;
        var code = this.state.code.trim();
        var phone = this.state.phone.trim();
        if (code == '') {
            toastShort("验证码不能为空");
            return false;
        }
        if (phone == '') {
            toastShort("电话号码不能为空");
            return false;
        }
        dispatch(ActionBContactPhone({code, phone}));
        //调用callback刷新前一个页面
        if({code, phone}){
            let callBack = this.navigation.state.params.callback;
            callBack();
            this.pop()
        }
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <BCText style={[gs.fts_14, gs.c_3a3838, {marginTop: px2dp(14.5), marginLeft: px2dp(25.5)}]}>请输入手机{this.props.currentEmployee.Phone}收到的短信验证码</BCText>
                <View style={[Styles.passwordStyle, gs.bgc_fff]}>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="验证码"
                                   placeholderTextColor='#b7b7b7'
                                   underlineColorAndroid='transparent'
                                   value={this.state.code}
                                   onChangeText={(text) => this.setState({code: text})}/>
                        {/*倒计时按钮*/}
                        <BCTouchable>
                            <TimerButton
                                style={{width: 110, marginRight: 10}}
                                timerCount={60}
                                onClick={() => {
                                    fetchSendCode({phone: this.props.currentEmployee.Phone+''}).then((ret) => {
                                        //toastShort(JSON.stringify(ret.data))
                                    }).catch((e) => {
                                        // toastShort(JSON.stringify(e))
                                    });
                                }}
                            />
                        </BCTouchable>
                    </View>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3]}>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="请输入新的联系电话"
                                   keyboardType='numeric'
                                   placeholderTextColor='#b7b7b7'
                                   underlineColorAndroid='transparent'
                                   maxLength={11}
                                   value={this.state.phone}
                                   onChangeText={(text) => this.setState({phone: text})}/>
                    </View>
                </View>
                <BCTouchable style={[Styles.btnStyle, gs.bgc_00c164]} onPress={()=>{this.onConfirm()}}>
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
        flex: 1,
        height:deviceHeight
    },
    passwordStyle: {
        height: px2dp(108.5),
        marginTop: px2dp(15)
    },
    itemStyle: {
        height: px2dp(54),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceBContactPhone:store.ReduceBContactPhone,
    }
}
const connectUpdatePhone = connect(mapStateToProps)(UpdatePhone);
connectUpdatePhone.navigationOptions = NavigationOptions;
export default connectUpdatePhone;

/**
 * Created by Administrator on 2017/4/24.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr,deviceHeight,NavigationOptions} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import {toastShort} from '../../../utils/ToastUtil';
import gs from '../../../styles/MainStyles';
import TimerButton from './TimerButton';
import {connect} from 'react-redux';
import CheckPassword from '../../../components/CheckPassword';
import CheckTextInput from '../../../components/CheckTextInput';
import {fetchSendCode,fetchUpdateSginPassword} from "../../../services/MyServices";
import {ActionUpdateSginPassword} from "../../../actions/MyAction"


class ReviseCheckPassword extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "修改验货密码"
    }

    constructor(props){
        super(props);
        this.state={
            code:'',
            signPassword:'',
            password:'',
        }
    }

    onConfirm() {
        const {dispatch} = this.props;
        var code = this.state.code.trim();
        var signPassword = this.state.signPassword.trim();
        var password=this.state.password.trim();
        if (code == '') {
            toastShort("验证码不能为空");
            return false;
        }
        if (signPassword.length<6||isNaN(signPassword)) {
            toastShort("验货密码应为6位数字");
            return false;
        }
        if (signPassword == '') {
            toastShort("验货密码不能为空");
            return false;
        }
        if (password == '') {
            toastShort("确认验货密码不能为空");
            return false;
        }
        if (password != signPassword) {
            toastShort("两次密码不一致");
            return false;
        }
        //dispatch(ActionUpdateSginPassword({code, signPassword}));
        fetchUpdateSginPassword({code, signPassword}).then((ret) => {
            if (ret.data === null) {
                //支付密码正确后调用
                toastShort("修改验货密码成功");
                const {navigation} = this.props;
                if (navigator) {
                    navigation.goBack();
                }
            }
            else if (ret.error) {
                toastShort("修改验货密码成功失败");
            }

        }).catch((e) => {
            toastShort("修改验货密码成功失败");
        });
        //toastShort("修改验货密码成功");
        //this.pop();
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <BCText style={[gs.fts_14, gs.c_3a3838, {marginTop: px2dp(14.5), marginLeft: px2dp(25.5)}]}>请输入手机{this.props.currentEmployee.Phone}收到的短信验证码</BCText>
                <View style={[Styles.passwordStyle, gs.bgc_fff]}>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="验证码"
                                   maxLength={6}
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
                    <View style={[Styles.itemStyle,{paddingLeft:px2dp(4)}]}>
                        {/*<TextInput style={Styles.inputStyle}
                                   placeholder="请输入新的验货密码"
                                   maxLength={6}
                                   placeholderTextColor={gs.c_b7b7b7}
                                   underlineColorAndroid='transparent'
                                   value={this.state.signPassword}
                                   onChangeText={(text) => this.setState({signPassword: text})}/>
                        <CheckPassword OnChange={()=>{}}/>*/}
                        <CheckTextInput
                            ref={(c)=>{
                                if(c!=null){
                                    this.signTextInput=c;
                                }
                            }}
                            maxLength={6}
                            value={this.state.signPassword}
                            title='请输入新的验货密码'
                            _textChange={
                                (text)=>{
                                    this.setState({signPassword: text})
                                }
                            }
                        />
                        <CheckPassword
                            OnChange={(IsSelect)=>{
                                this.signTextInput.OnChange(IsSelect)
                            }}/>
                    </View>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3,{borderTopWidth:1}]}>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="再次输入新的验货密码"
                                   maxLength={6}
                                   placeholderTextColor='#b7b7b7'
                                   underlineColorAndroid='transparent'
                                   secureTextEntry={true}
                                   value={this.state.password}
                                   onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                </View>
                <BCTouchable style={[Styles.btnStyle, gs.bgc_00c164]} onPress={()=>{this.onConfirm()}}>
                    <BCText style={[gs.fts_16, gs.c_fff]}>确认</BCText>
                </BCTouchable>
            </View>
        )
    }


    WillMount() {
        const {dispatch} = this.props;
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height:deviceHeight,
    },
    passwordStyle: {
        height: px2dp(162.5),
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
        ReduceUpdateSginPassword:store.ReduceUpdateSginPassword
    }
}
const connectReviseCheckPassword = connect(mapStateToProps)(ReviseCheckPassword);
connectReviseCheckPassword.navigationOptions = NavigationOptions;
export default connectReviseCheckPassword;
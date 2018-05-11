import React, {Component} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {BCText, BCTouchable, NavigationOptions, px2dp} from "../BaseComponent";
import PageComponent from "./PageComponent";
import {toastShort} from "../utils/ToastUtil";
import gs from "../styles/MainStyles";
import {connect} from "react-redux";
import {fetchForgetPassword} from "../services/EmployeeServices";
//import TimerButton from "../containers/buyer/my/TimerButton";
// 获取验证码
import {fetchSendCode} from "../services/MyServices";
import {ActionForgetPassword} from "../actions/EmployeeAction";

class TimerButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timerCount: this.props.timerCount || 60,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        };
    }

    static propTypes = {
        style: React.PropTypes.object,
        onClick: React.PropTypes.func,
        disableColor: React.PropTypes.string,
        timerTitle: React.PropTypes.string,
        Phone:React.PropTypes.string,
        enable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number])
    };

    _countDownAction() {
        const codeTime = this.state.timerCount;
        this.interval = setInterval(() => {
            const timer = this.state.timerCount - 1;
            if (timer === 0) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: this.props.timerTitle || '获取验证码',
                    counting: false,
                    selfEnable: true
                })
            } else {
                //console.log("---- timer ", timer);
                this.setState({
                    timerCount: timer,
                    timerTitle: `${timer}s后重发`,
                })
            }
        }, 1000)
    }

    _shouldStartCountting() {
        this._countDownAction()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        const {style, enable, disableColor} = this.props;
        const {counting, timerTitle, selfEnable} = this.state;
        return (
            <BCTouchable activeOpacity={counting ? 1 : 0.8}
                         style={{width: px2dp(99), height: px2dp(28), borderWidth: px2dp(0.5), borderColor: '#d2d2d2', borderRadius: px2dp(14.3), justifyContent: 'center', alignItems: 'center', marginRight: px2dp(25)
                         }}
                         onPress={() => {
                             if(!counting && selfEnable){
                                 if(this.props.Phone===""||!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(this.props.Phone)){
                                     toastShort("请正确输入手机号码再获取验证码")
                                 }else{
                                     this.setState({selfEnable:false},()=>{
                                         this.props.onClick()
                                     })
                                     this._shouldStartCountting()
                                 }

                             }
                         }}>
                <BCText style={[gs.c_888]}>
                    {timerTitle}
                </BCText>
            </BCTouchable>
        )
    }
}

class ForgetPassword extends PageComponent {
    //设置页面标题
    setTitle() {
        return "找回密码"
    }

    constructor(props) {
        super(props);
        this.state = {
            loginNo: '',
            testcode: '',
            newPassword: '',
            password: '',
        }
    }

    //把电话号码当成公共的
    GlobalDatas = {};

    onComplete() {
        const {dispatch} = this.props;
        let loginNo = this.GlobalDatas.loginNo;
        var testcode = this.state.testcode.trim();
        var newPassword = this.state.newPassword.trim();
        var password = this.state.password.trim();
        if (loginNo == null || loginNo == "") {
            toastShort("手机号不能为空");
            return false;
        }
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(loginNo)) {
            toastShort("手机号格式错误");
            return false;
        }
        if (testcode == '') {
            toastShort("验证码不能为空");
            return false;
        }
        if (newPassword == '') {
            toastShort("密码不能为空");
            return false;
        }
        if (password == '') {
            toastShort("确认密码不能为空");
            return false;
        } else if (password != newPassword) {
            toastShort("两次密码不一致");
            return false;
        }
        //dispatch(ActionForgetPassword({loginNo, newPassword}));
        //this.pop('Login')
        fetchForgetPassword({
            loginNo,
            newPassword,
        }).then((ret) => {
            toastShort("密码修改成功,请重新登录");
            this.pop();

        }).catch((e) => {

        });
    }

    content() {
        return (
            <View style={Styles.forgetpwd}>
                <View style={Styles.main}>
                    <View style={Styles.item}>
                        <TextInput ref="textInput1" style={Styles.textInput}
                                   placeholder='手机号'
                                   // keyboardType='numeric'
                                   placeholderTextColor='#b7b7b7'
                                   maxLength={11}
                                   onChangeText={(text) => {
                                       this.GlobalDatas.loginNo = text;
                                       this.setState({
                                           loginNo:text
                                       })
                                       //this.state.loginNo=text;
                                   }}
                                   /*onEndEditing={(text)=>{
                                       if(text.length!=11){
                                           toastShort('请输入正确的电话号码');
                                       }
                                   }}*/
                                   defaultValue={this.GlobalDatas.loginNo}
                                   underlineColorAndroid='transparent'/>
                    </View>
                    <View style={[Styles.item, Styles.itemRow]}>
                        <TextInput
                            style={[Styles.textInput, Styles.textInputW]}
                            placeholder='验证码'
                            placeholderTextColor='#b7b7b7'
                            underlineColorAndroid='transparent'
                            value={this.state.testcode}
                            onChangeText={(text) => this.setState({testcode: text})}/>
                        {/*倒计时按钮*/}
                        <TimerButton
                            style={{width: 110, marginRight: 10}}
                            timerCount={60}
                            Phone={this.state.loginNo}
                            onClick={() => {
                                    fetchSendCode({
                                        phone: this.GlobalDatas.loginNo + ''
                                    }).then((ret) => {
                                        //toastShort(JSON.stringify(ret.data))
                                        //let code = JSON.stringify(ret.data);
                                    }).catch((e) => {
                                        //toastShort(JSON.stringify(e))
                                    });

                            }}
                        />
                    </View>
                    <View style={Styles.item}>
                        <TextInput style={Styles.textInput}
                                   placeholder='设置密码'
                                   placeholderTextColor='#b7b7b7'
                                   underlineColorAndroid='transparent'
                                   secureTextEntry={false}
                                   value={this.state.newPassword}
                                   onChangeText={(text) => this.setState({newPassword: text})}/>
                    </View>
                    <View style={Styles.item}>
                        <TextInput style={Styles.textInput} placeholder='再次输入确认密码'
                                   underlineColorAndroid='transparent'
                                   placeholderTextColor='#b7b7b7'
                                   secureTextEntry={false}
                                   onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                    <BCTouchable style={[Styles.button, {backgroundColor: '#00c164'}]} activeOpacity={0.8}
                                 onPress={this.onComplete.bind(this)}>
                        <BCText style={Styles.buttonText}>完成</BCText>
                    </BCTouchable>
                </View>
            </View>
        );
    }

    WillMount() {
        const {dispatch} = this.props;
        this.setState({
            IsReceived: true
        })
    }

    /*WillReceive(nextProps) {
        if (nextProps.ReduceForgetPassword.datas != null && nextProps.ReduceForgetPassword != this.props.ReduceForgetPassword) {
            toastShort("密码修改成功,请重新登录");
            this.pop('Login');
        }
    }*/

}


const Styles = StyleSheet.create({
    forgetpwd: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    main: {
        width: '100%',
        paddingRight: 20,
        paddingLeft: 20
    },
    item: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        height: 50,
        paddingLeft: 10
    },
    textInputW: {
        width: '70%'
    },
    testbutton: {
        width: px2dp(100),
        height: px2dp(29),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: gs.bdc_bdbdbd,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 10,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
    }
});

function mapStateToProps(store) {
    return {
        ReduceForgetPassword: store.ReduceForgetPassword
    }
}
const connectForgetPassword = connect(mapStateToProps)(ForgetPassword);
connectForgetPassword.navigationOptions = NavigationOptions;
export default connectForgetPassword;


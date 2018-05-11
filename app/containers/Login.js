/**
 * Created by sencha on 2017/3/28. 登陆界面
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import {BCImage, BCText, BCTouchable, deviceHeight, deviceWidth, NavigationOptions, px2dp,checkNetworkState} from "../BaseComponent";
import PageComponent from "./PageComponent";
import {confirm, toastShort} from "../utils/ToastUtil";
import {Platform, ScrollView, StyleSheet, TextInput, View, KeyboardAvoidingView,NetInfo} from "react-native";
//import {request} from '../utils/RequestUtil';
import ForgetPassword from "./ForgetPassword";
import gs from "../styles/MainStyles";
import {ActionLogIn, ActionCompanyType} from "../actions/EmployeeAction";
import {ActionLoadMallProducts} from '../actions/ProductAction';
//import TimerButton from "../containers/buyer/my/TimerButton";
import CheckPassword from "../components/CheckPassword";
import CheckTextInput from "../components/CheckTextInput";
import CheckTextInput2 from "../components/CheckTextInput2";
import CheckTextInput2Ios from "../components/CheckTextInput2Ios";

import CheckTextInputDenglu from "../components/CheckTextInputDenglu";
// 获取验证码
import {fetchCheckPhone,fetchSendCode} from "../services/MyServices";
import {fetchLogin,fetchRegist,fetchValidityCode} from "../services/EmployeeServices";
import JPushModule from 'jpush-react-native';
import {NavigationActions} from 'react-navigation'
import {setting} from '../utils/RequestUtil'

const pageState = {
    "login": 1,
    "regist": 2,
    "registNext": 3
}
const registStep = {
    Step1: 1,
    Step2: 2
}

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
        Phone: React.PropTypes.string,
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
                         style={{
                             width: px2dp(99),
                             height: px2dp(28),
                             borderWidth: px2dp(0.5),
                             borderColor: '#d2d2d2',
                             borderRadius: px2dp(14.3),
                             justifyContent: 'center',
                             alignItems: 'center',
                             marginRight: px2dp(25)
                         }}
                         onPress={() => {
                             if (!counting && selfEnable) {
                                 if (this.props.Phone === "" || !/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(this.props.Phone)) {
                                     toastShort("请正确输入手机号码再获取验证码")
                                 } else {
                                     fetchCheckPhone({loginNo:this.props.Phone}).then((ret)=>{
                                        if(ret.data.success==0){
                                            toastShort(ret.data.message)
                                            return false;
                                        }else{
                                            this.setState({selfEnable: false}, () => {
                                                this.props.onClick()
                                            })
                                            this._shouldStartCountting()
                                        }
                                     })

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

class Login extends PageComponent {
    GlobalDatas = {};
    LoginTextInput = null;

    constructor(props) {
        super(props);
        this.state = {
            IsReceived: true,
            phone: '',
            password: '',
            loginNo: '',
            regitPassword: '',
            payPassword:'',
            code: '',
            contactName: '',
            companyFullName: '',
            address: '',
            pageState: pageState.login,
            registStep: registStep.Step1,
            X:0,
            Y:0,
            marginBottom:0,
            isSend:false,
        }
    }

    //关闭按钮
    renderNavigator() {
        return (
            <View style={gs.bgc_fff}>
                <BCTouchable style={[Styles.close, gs.bgc_fff]} onPress={() => this.onClose()}>
                    <BCImage source={require('../imgs/close.png')}/>
                </BCTouchable>
            </View>
        )
    }

    //关闭按钮的提示窗
    onClose() {
        if (this.state.pageState == pageState.login) {
            this.pop();
        } else {
            let self = this;
            confirm("确定要放弃注册？", function () {
                self.pop();
            }, function () {
                return false
            })
        }

    }

    //登录按钮
    onLogin() {

        const {dispatch, currentEmployee} = this.props;
        //const loginInRoute = this.navigation.state.params.loginInRoute;
        const loginInRoute = this.navigation.state.routeName;
        let loginNo = this.state.phone.trim();
        let password = this.state.password.trim();
        if (loginNo == '') {
            if(password=='bcl123'){
                setting.HOST='http://121.199.43.169:8993';
                toastShort("已切换到测试服务器..");
                return;
            }else if(password=='bcl124'){
                setting.HOST='http://192.168.2.110:65320';
                toastShort("已切换到联调服务器..");
                return;
            }else if(password=='bcl125'){
                setting.HOST='https://bcl.baocailang.com:8993';
                toastShort("已切换到正式服务器..");
                return;
            }
            toastShort("手机号不能为空");
            return false;
        }
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(loginNo)) {
            toastShort("手机号格式错误");
            return false;
        }
        if (password == '') {
            toastShort("密码不能为空");
            return false;
        }
        // this.checkNetWork()
        this.setState({
            isSend:true,
        })
        // dispatch(ActionLogIn({loginNo, password}))

        fetchLogin({loginNo, password}).then((ret) => {
            if (ret.data) {
                dispatch({'type': 'LoggedIn', data: ret.data, error: ret.error});
            }
            else if (ret.error) {
                dispatch({'type': 'LoggerError', error: ret.error});
            }
            //dispatch({'type': Types.LoggedIn, data: ret.data, error: ret.error});
        }).catch((e) => {
            //toastShort(e.message);
            dispatch({'type': 'LoggerError', error: e});
        }).then(()=>{
            this.setState({
                isSend:false,
            })
        });

    }

    //登录内容
    renderLogin() {
        return (
            <View style={Styles.content}>
                <View style={Styles.tab}>
                    <View style={[Styles.menu, gs.bdc_00C364]}>
                        <BCText style={[gs.fts_17, gs.c_3a3838]}>登录</BCText>
                    </View>
                    <BCTouchable style={[Styles.menu, gs.bdc_cccccc]}
                                 onPress={() => {
                                     if (this.state.registStep == registStep.Step1) {
                                         this.setState({pageState: pageState.regist})
                                     } else {
                                         this.setState({pageState: pageState.registNext})
                                     }
                                 }}>
                        <BCText style={[gs.fts_17, gs.c_3a3838]}>注册</BCText>
                    </BCTouchable>
                </View>
                <KeyboardAvoidingView behavior="padding" style={[Styles.item, gs.bdc_e3e3e3]}>
                    <TextInput style={Styles.textInput}
                               placeholder='手机号'
                               placeholderTextColor='#b7b7b7'
                               maxLength={11}
                               blurOnSubmit={true}
                               lable="备 注"
                               returnKeyType='done'
                               value={this.state.phone}
                               onChangeText={(text) => this.setState({phone: text})}
                               underlineColorAndroid='transparent'/>
                </KeyboardAvoidingView>
                <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                    <CheckTextInput
                        ref={(c) => {
                            if (c != null) {
                                this.LoginTextInput = c;
                            }
                        }}
                        value={this.state.password}
                        title='登录密码'
                        _textChange={
                            (text) => {
                                this.setState({password: text})
                            }
                        }
                        onFocus={()=>
                        {
                            this.refs.loginScrollView.scrollTo({x:0,y:px2dp(60),animated:true});
                        }}
                    />
                    <CheckPassword
                        OnChange={(IsSelect) => {
                            this.LoginTextInput.OnChange(IsSelect)
                        }}/>
                </View>
                {this.state.isSend?
                    <BCTouchable style={[Styles.loginButton, gs.bgc_00c164,{zIndex:3}]}
                                             >
                        <BCText style={[gs.c_fff, gs.fts_14]}>登录中...</BCText>
                    </BCTouchable>:
                    <BCTouchable style={[Styles.loginButton, gs.bgc_00c164,{zIndex:3}]}
                                         onPress={() => this.onLogin()}>
                        <BCText style={[gs.c_fff, gs.fts_14]}>登录</BCText>
                    </BCTouchable>
                }

                <BCTouchable style={Styles.forgetPassword}
                             onPress={() => {
                                 this.push('ForgetPassword')
                             }}>
                    <BCText style={[gs.c_888, gs.fts_13]}>忘记密码</BCText>
                </BCTouchable>
                {Platform.OS==='ios'?<View/>:<View style={{paddingBottom:'40%'}}></View>}
            </View>
        )
    }


    //注册内容
    renderRegist() {
        return (
            <View style={[Styles.content]}>
                <View style={Styles.tab}>
                    <BCTouchable style={[Styles.menu, gs.bdc_cccccc]}
                                 onPress={() =>{
                                     this.refs.registScrollView.scrollTo({x:0,y:px2dp(0),animated:true});
                                     this.setState({pageState: pageState.login})
                                 }}
                    >
                        <BCText style={[gs.fts_17, gs.c_3a3838]}>登录</BCText>
                    </BCTouchable>
                    <View style={[Styles.menu, gs.bdc_00C364]}>
                        <BCText style={[gs.fts_17, gs.c_3a3838]}>注册</BCText>
                    </View>
                </View>
                <View style={[Styles.item, gs.bdc_e3e3e3]}>
                    <TextInput style={Styles.textInput}
                               placeholder='手机号'
                               placeholderTextColor='#b7b7b7'
                               maxLength={11}
                               onChangeText={(text) => {
                                   this.GlobalDatas.loginNo = text
                                   this.setState({
                                       loginNo: text
                                   })

                               }}
                               underlineColorAndroid='transparent'/>
                </View>
                <KeyboardAvoidingView behavior="padding" style={[Styles.item, gs.bdc_e3e3e3, Styles.itemRow]}>
                    <TextInput
                        style={[Styles.textInput, Styles.textInputW]}
                        placeholder='验证码'
                        placeholderTextColor='#b7b7b7'
                        underlineColorAndroid='transparent'
                        maxLength={4}
                        onChangeText={
                            (text) => {
                                this.GlobalDatas.code = text;
                            }
                        }/>
                    {/*倒计时按钮*/}
                    <TimerButton
                        style={{width: 110, marginRight: 10}}
                        timerCount={60}
                        Phone={this.state.loginNo}
                        onClick={() => {
                            fetchSendCode({
                                phone: this.GlobalDatas.loginNo + ''
                            }).then((ret) => {
                                // toastShort(JSON.stringify(ret.data))
                                //let code = JSON.stringify(ret.data);
                            }).catch((e) => {
                                // toastShort(JSON.stringify(e))
                            });
                        }}
                    />
                </KeyboardAvoidingView>
                {/*设置登陆密码*/}
                <KeyboardAvoidingView behavior="padding"
                                      style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                    <CheckTextInputDenglu
                        ref={(c) => {
                            if (c != null) {
                                this.regitTextInput = c;
                            }
                        }}

                        //value={this.state.password}
                        title='设置登陆密码'
                        _textChange={
                            (text) => {
                                this.GlobalDatas.regitPassword = text
                            }
                        }
                        onFocus={()=>
                        {
                            // this.state.marginBottom=200;
                            // this.setState({
                            //     marginBottom : 200
                            // })
                            this.refs.registScrollView.scrollTo({x:0,y:px2dp(52),animated:true});
                        }}

                    />
                    <CheckPassword
                        IsSelect={true}
                        OnChange={(IsSelect) => {
                            this.regitTextInput.OnChange(IsSelect)
                        }}/>
                </KeyboardAvoidingView>
                {/*//支付/验货密码*/}
                {
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>

                        <CheckTextInput2Ios
                            ref={(c) => {
                                if (c != null) {
                                    this.payTextInput = c;
                                }
                            }}
                            maxLength={6}
                            onFocus={()=>
                                {
                                    // this.state.marginBottom=200;
                                    // this.setState({
                                    //     marginBottom : 200
                                    // })
                                    this.refs.registScrollView.scrollTo({x:0,y:px2dp(120),animated:true});
                                }
                            }
                            onBlur={()=>
                                {
                                    this.refs.registScrollView.scrollTo({x:0,y:px2dp(52),animated:true});
                                }
                            }
                            title='支付/验货密码'
                            _textChange={
                                (text) => {
                                    this.GlobalDatas.payPassword = text
                                }
                            }
                        />
                    </View>
                }

                <BCTouchable style={[Styles.nextButton, gs.bgc_00c164,{zIndex:10}]} onPress={() =>
                        {
                            this.refs.registScrollView.scrollTo({x:0,y:Platform.OS==='ios'?px2dp(0):px2dp(0),animated:true})
                            this.onNext()
                        }
                    }
                             activeOpacity={0.8}>
                    <BCText style={[gs.c_fff, gs.fts_14]}>下一步</BCText>
                </BCTouchable>
                <View style={Styles.agreement}>
                    <BCText style={[gs.c_888, gs.fts_13]}>注册代表同意 </BCText>
                    <BCTouchable onPress={() => {
                        this.push('Agreement')
                    }}>
                        <BCText style={[{color: '#00C164'}, gs.fts_13]}>注册协议</BCText>
                    </BCTouchable>
                </View>
                {/*<View style={{height:px2dp(this.state.marginBottom)}}><BCText style={[{color: '#00C164'}, gs.fts_13]}>  </BCText></View>*/}
            </View>
        )
    }


    //注册第一步的按钮
    onNext() {
        if (!this.GlobalDatas.code) {
            toastShort("验证码不能为空");
            return false;
        }
        let loginNo = this.GlobalDatas.loginNo;
        let code = this.GlobalDatas.code.trim();//验证码
        let password = this.GlobalDatas.regitPassword;
        let payPassword=this.GlobalDatas.payPassword;
        if (loginNo == "" || loginNo == null) {
            toastShort("电话号码不能为空");
            return false;
        } else if (loginNo != "" || loginNo != null) {
            if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/.test(loginNo)) {
                toastShort("手机号格式错误");
                return false;
            }
        }
        if (!password) {
            toastShort("密码不能为空");
            return false;
        }
        if (!payPassword) {
            toastShort("支付/验货密码不能为空");
            return false;
        }else if(payPassword.length!=6||isNaN(payPassword)){
            toastShort("支付/验货密码应为6位数字");
            return false;
        }
        fetchValidityCode({loginNo:loginNo,code:code}).then((ret)=>{
            if(ret.data.success==1){
                toastShort(ret.data.message);
                return false;
            }else{
                this.setState({
                    pageState: pageState.registNext,
                })
            }

        });

    }


    //第二步注册的内容
    renderRegistNext() {
        return (
            <View style={Styles.content}>
                <View style={Styles.tab}>
                    <BCTouchable style={[Styles.menu, gs.bdc_cccccc]}
                                 onPress={() => {
                                     this.refs.registScrollView.scrollTo({x:0,y:px2dp(0),animated:true});
                                     this.setState({pageState: pageState.login})

                                 }}>
                        <BCText style={[gs.fts_17, gs.c_3a3838]}>登录</BCText>
                    </BCTouchable>
                    <View style={[Styles.menu, gs.bdc_00C364]}>
                        <BCText style={[gs.fts_17, gs.c_3a3838]}>注册</BCText>
                    </View>
                </View>
                <KeyboardAvoidingView behavior="padding" style={[Styles.item, gs.bdc_e3e3e3]}>
                    <TextInput style={Styles.textInput}
                               placeholder='联系人姓名'
                               placeholderTextColor='#b7b7b7'
                               maxLength={11}
                               value={this.state.contactName}
                               onChangeText={(text) => this.setState({contactName: text})}
                               underlineColorAndroid='transparent'/>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView behavior="padding" style={[Styles.item, gs.bdc_e3e3e3]}>
                    <TextInput style={Styles.textInput}
                               placeholder='店铺名称'
                               placeholderTextColor='#b7b7b7'
                               underlineColorAndroid='transparent'
                               maxLength={20}
                               value={this.state.companyFullName}
                               onFocus={()=>
                                {
                                    this.refs.registScrollView.scrollTo({x:0,y:Platform.OS==='ios'?px2dp(0):px2dp(62),animated:true});
                                }}
                               onChangeText={(text) => this.setState({companyFullName: text})}/>
                </KeyboardAvoidingView>
                <KeyboardAvoidingView behavior="padding" style={[Styles.item, gs.bdc_e3e3e3,Styles.itemRow]}>
                    <TextInput style={[Styles.textInput, Styles.textInputW,{width:'90%'}]}
                               placeholder='店铺位置'
                               placeholderTextColor='#b7b7b7'
                               underlineColorAndroid='transparent'
                               value={this.state.address}
                               // editable={false}
                               // onFocus={()=>this.push('Amap',{callBack: this.SelectAddresBack.bind(this)})}
                               onBlur={()=>
                                {
                                     this.refs.registScrollView.scrollTo({x:0,y:Platform.OS==='ios'?px2dp(0):px2dp(0),animated:true});
                                }}
                               onFocus={()=>
                               {
                                    this.refs.registScrollView.scrollTo({x:0,y:Platform.OS==='ios'?px2dp(62):px2dp(135),animated:true});
                               }}
                               onChangeText={(text) => this.setState({address: text})}
                    />
                    <BCTouchable onPress={()=>this.push('Amap',{callBack: this.SelectAddresBack.bind(this)})}>
                        <BCText style={{fontSize:12,width:px2dp(30),marginRight:px2dp(10),color:'#31ca96'}}>选择地点</BCText>
                    </BCTouchable>
                </KeyboardAvoidingView>
                <BCTouchable style={[Styles.nextButton, gs.bgc_00c164]} onPress={() => this.onRegist()}
                             activeOpacity={0.8}>
                    <BCText style={[gs.c_fff, gs.fts_14]}>注册</BCText>
                </BCTouchable>
                <View style={{paddingBottom:'40%'}}></View>
            </View>
        )
    }
    SelectAddresBack(lat,lng,address){
        this.setState({
            X:lng,
            Y:lat,
            address: address
        })
    }

    //第二步注册的按钮
    onRegist() {
        const {dispatch, ReduceRegist} = this.props;
        const {companyTypeId} = this.props.ReduceCompanyType
        var contactName = this.state.contactName.trim();
        var companyFullName = this.state.companyFullName.trim();
        var address = this.state.address.trim();
        var X=this.state.X;
        var Y=this.state.Y;
        if (contactName == '') {
            toastShort("联系人姓名不能为空");
            return false;
        }
        if (companyFullName == '') {
            toastShort("店铺名称不能为空");
            return false;
        }
        if (address == '') {
            toastShort("店铺位置不能为空");
            return false;
        }

        fetchRegist({
            loginNo: this.GlobalDatas.loginNo,
            password: this.GlobalDatas.regitPassword,
            payPassword:this.GlobalDatas.payPassword,
            smsCode:this.GlobalDatas.code,
            address: address,
            contactName: contactName,
            companyFullName: companyFullName,
            // X: 120.192958,
            // Y: 30.331805,
            X:X,
            Y:Y,
            companyTypeId: companyTypeId,
        }).then((ret) => {
            if (ret.data.success == 1) {
                toastShort(ret.data.message)
                this.setState({
                    pageState: pageState.regist,
                });
            } else {
                toastShort("注册成功,请登录");
                this.setState({
                    pageState: pageState.login,
                });
            }

        }).catch((e) => {

        });

    }

    content() {
        switch (this.state.pageState) {
            case pageState.login:
                return (
                    <ScrollView ref="loginScrollView"  style={[Styles.main, gs.bgc_fff]}>
                        {this.renderLogin()}
                    </ScrollView>
                );
                break

            case pageState.regist:
                return (
                    <ScrollView ref="registScrollView" style={[Styles.mainZhuCe, gs.bgc_fff]}>
                        {this.renderRegist()}
                    </ScrollView>
                );
                break
            case pageState.registNext:
                return (
                    <ScrollView ref="registScrollView"  style={[Styles.main, gs.bgc_fff]}>
                        {this.renderRegistNext()}
                    </ScrollView>
                );
                break
            default:
                return (
                    <ScrollView ref="loginScrollView"  style={Styles.main}>
                        {this.renderLogin()}
                    </ScrollView>
                );
                break
        }

    }

    WillMount() {
        if (this.params && this.params.loginInRoute.params.pageType == 'regist') {
            this.setState({
                pageState: pageState.regist,
            })
        }
    }

    WillReceive(nextProps) {
        if (nextProps.currentEmployee.token != null && nextProps.currentEmployee.token != this.props.currentEmployee.token) {
            let currentEmployee = nextProps.currentEmployee.currentEmployee;
            const {dispatch, navigation, ReduceCompanyType} = this.props;
            //设置别名
            JPushModule.setAlias(currentEmployee.EmployeeId + '', () => {
                this.isSetAlias = true;
            }, () => {
                this.isSetAlias = false;
            });
            //如果是卖家 刷新首页 展示自营商品
            if (currentEmployee.CompanyTypeId == 3) {
                dispatch(ActionLoadMallProducts());
            }

            //切换买卖家版本(卖家登买家,买家登卖家这种)
            if (currentEmployee.CompanyTypeId == ReduceCompanyType.companyTypeId) {
                //没有登错情况下直接pop
                this.pop();
            }
            else {
                //登错情况下
                if (currentEmployee.CompanyTypeId == 3) {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({routeName: 'BuyerIndex'})
                        ]
                    });
                    navigation.dispatch(resetAction)
                    //this.push("BuyerIndex");
                }
                else {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({routeName: 'SellerIndex'})
                        ]
                    });
                    navigation.dispatch(resetAction)
                    //this.push("SellerIndex");
                }

                dispatch(ActionCompanyType(currentEmployee.CompanyTypeId));
            }

            toastShort("登录成功");

        }
        if (nextProps.ReduceRegist.error != null && nextProps.ReduceRegist.error != this.props.ReduceRegist.error) {
            toastShort("注册失败");
            this._Loading.Trigger(false);
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingTop: '30%',
    },
    mainZhuCe: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ?'30%' : '10%',
    },
    close: {
        marginRight: px2dp(5),
        marginTop: Platform.OS === 'ios' ? px2dp(20) : 0,
        width: px2dp(32),
        height: px2dp(32),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    content: {
        width: '100%',
        paddingRight: px2dp(40),
        paddingLeft: px2dp(40),
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: px2dp(9),
        paddingRight: px2dp(9),
        marginBottom: px2dp(30)
    },
    menu: {
        width: px2dp(137),
        height: px2dp(40),
        borderBottomWidth: 4,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        height: px2dp(54),
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemStyle: {
        height: px2dp(54),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputStyle: {
        marginLeft: px2dp(20),
        height: px2dp(54),
        width: deviceWidth - px2dp(150)
    },
    textInput: {
        height: px2dp(54),
        width: px2dp(275),
        paddingLeft: px2dp(10),
        textAlign: 'left',
        marginLeft: px2dp(10),
        padding: 0,
        paddingLeft: px2dp(16)
    },
    loginButton: {
        marginTop: px2dp(25),
        height: px2dp(40),
        borderRadius: px2dp(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    forgetPassword: {
        height: px2dp(20),
        width: px2dp(80),
        marginTop: px2dp(10),
        alignSelf: 'flex-end'
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        height: px2dp(54),
        width: px2dp(275),
        paddingLeft: px2dp(10),
        textAlign: 'left',
        marginLeft: px2dp(10),
        padding: 0,
        paddingLeft: px2dp(16)
    },
    textInputW: {
        width: '60%',
        paddingLeft: px2dp(25)
    },
    nextButton: {
        marginTop: px2dp(25),
        height: px2dp(40),
        borderRadius: px2dp(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    agreement: {
        height: px2dp(40),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectType: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: deviceWidth,
        height: px2dp(183),
        zIndex: 2
    },
    maks: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: deviceWidth,
        height: deviceHeight,
        opacity: 0.3,
        zIndex: 1
    },
    menuTitle: {
        height: px2dp(54),
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuItem: {
        height: px2dp(62),
        justifyContent: 'center',
        alignItems: 'center'
    }

})

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee,
        ReduceRegist: store.ReduceRegist,
        ReduceCompanyType: store.ReduceCompanyType
    }
}

const connectLogin = connect(mapStateToProps)(Login);
connectLogin.navigationOptions = NavigationOptions;
export default connectLogin;


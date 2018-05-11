/**
 * Created by Administrator on 2017/5/4.
 */
import React, {Component} from "react";
import {StyleSheet, TextInput, View} from "react-native";
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
import {connect} from "react-redux";
import TimerButton from "./TimerButton";
import {fetchSendCode} from "../../../services/MyServices";
import {ActionPayPassword} from "../../../actions/MyAction"

//密文眼睛按钮组件
class CheckPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsSelect: props.IsSelect
        };
    }

    static propTypes = {
        OnChange: React.PropTypes.func,
        _product: React.PropTypes.object,
    };
    static defaultProps = {
        IsSelect: false,
        _product: {}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            IsSelect: nextProps.IsSelect
        })
    }

    OnChange(isSelect, obj, callback) {
        this.setState({IsSelect: isSelect}, () => {
            callback && callback(obj)
        })
    }

    _onPress() {
        this.setState({IsSelect: !this.state.IsSelect}, () => {
            this.props.OnChange(this.state.IsSelect);
        })
    }

    //获取Quantity
    getQuantity(type, ProductObj, product) {
        this._Products[ProductObj.ProductId] = product;
    }

    render() {
        let uri1 = require('../../../imgs/closeeye.png');
        let uri2 = require('../../../imgs/open.png');
        return (
            <BCTouchable style={[Styles.chooseBtn]}
                         onPress={() => this._onPress()}>
                <BCImage style={[Styles.chooseEye]} source={this.state.IsSelect ? uri2 : uri1}/>
            </BCTouchable>
        )
    }
}

//密文组件
class CheckTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsSelect: props.IsSelect
        };
    }

    static propTypes = {
        OnChange: React.PropTypes.func,
        _product: React.PropTypes.object,
        password: React.PropTypes.string,
        value: React.PropTypes.string,
        _textChange: React.PropTypes.func,
        title: React.PropTypes.string,
    };
    static defaultProps = {
        IsSelect: false,
        _product: {}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            IsSelect: nextProps.IsSelect
        })
    }

    OnChange(isSelect) {
        this.setState({IsSelect: isSelect})
    }

    textChange(text) {
        this.props._textChange(text.nativeEvent.text)
    }

    render() {
        return (
            this.state.IsSelect ?
                <TextInput style={Styles.inputStyle}
                           placeholder={this.props.title}
                           placeholderTextColor='#b7b7b7'
                           secureTextEntry={false}
                           underlineColorAndroid='transparent'
                           value={this.props.password}
                           onEndEditing={(text) => {
                               this.textChange(text);
                           }
                           }/> :
                <TextInput style={Styles.inputStyle}
                           placeholder={this.props.title}
                           placeholderTextColor='#b7b7b7'
                           secureTextEntry={true}
                           underlineColorAndroid='transparent'
                           value={this.props.password}
                           onEndEditing={(text) => {
                               this.textChange(text);
                           }
                           }/>

        )
    }
}

class SetCashPassword extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "设置提现密码"
    }

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            payPassword: '',
            password: ''
        }
    }

    onConfirm() {
        const {dispatch} = this.props;
        let code = this.state.code.trim();
        let payPassword = this.state.payPassword.trim();
        let password = this.state.password.trim();
        if (code == '') {
            toastShort("验证码不能为空");
            return false;
        }
        if (payPassword == '') {
            toastShort("提现密码不能为空");
            return false;
        }
        if (password == '') {
            toastShort("确认提现密码不能为空");
            return false;
        }
        if (password != payPassword) {
            toastShort("两次密码不一致");
            return false;
        }
        this.push('NotAccount');
        dispatch(ActionPayPassword({code, payPassword}));
        toastShort("设置提现密码成功");

    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <BCText style={[gs.fts_14, gs.c_3a3838, {
                    marginTop: px2dp(14.5),
                    marginLeft: px2dp(25.5)
                }]}>请输入手机{this.props.currentEmployee.Phone}收到的短信验证码</BCText>
                <View style={[Styles.passwordStyle, gs.bgc_fff]}>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(1)}]}>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="验证码"
                                   placeholderTextColor="#b7b7b7"
                                   underlineColorAndroid='transparent'
                                   value={this.state.code}
                                   onChangeText={(text) => this.setState({code: text})}/>
                        {/*倒计时按钮*/}
                        <BCTouchable>
                            <TimerButton
                                style={{width: 110, marginRight: 10}}
                                timerCount={60}
                                onClick={() => {
                                    fetchSendCode({phone: this.props.currentEmployee.Phone + ''}).then((ret) => {
                                        //toastShort(JSON.stringify(ret.data))
                                    }).catch((e) => {
                                        // toastShort(JSON.stringify(e))
                                    });
                                }}
                            />
                        </BCTouchable>
                    </View>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        {/*  <TextInput style={Styles.inputStyle}
                                   placeholder="请设置六位数字提现密码"
                                   maxLength={6}
                                   placeholderTextColor="#b7b7b7"
                                   underlineColorAndroid='transparent'
                                   value={this.state.payPassword}
                                   onChangeText={(text) => this.setState({payPassword: text})}/>*/}
                        <CheckTextInput
                            ref={(c) => {
                                if (c != null) {
                                    this.LoginTextInput = c;
                                }
                            }}
                            value={this.state.payPassword}
                            title='请设置六位数字提现密码'
                            _textChange={
                                (text) => {
                                    this.setState({payPassword: text})
                                }
                            }
                        />
                        <CheckPassword
                            OnChange={(IsSelect) => {
                                this.LoginTextInput.OnChange(IsSelect)
                            }}/>
                    </View>
                    <View style={[Styles.itemStyle, gs.bdc_e3e3e3]}>
                        <TextInput style={Styles.inputStyle}
                                   placeholder="再次确认提现密码"
                                   maxLength={6}
                                   placeholderTextColor="#b7b7b7"
                                   underlineColorAndroid='transparent'
                                   secureTextEntry={true}
                                   value={this.state.password}
                                   onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                </View>
                <BCTouchable style={[Styles.btnStyle, gs.bgc_00c164]} onPress={() => {
                    this.onConfirm()
                }}>
                    <BCText style={[gs.fts_16, gs.c_fff]}>确认</BCText>
                </BCTouchable>
            </View>
        )
    }

    Bottom() {
        return (
            <View style={{zIndex: 2}}></View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        //dispatch(ActionPayPassword());
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    main: {
        height: deviceHeight
    },
    passwordStyle: {
        height: px2dp(163),
        marginTop: px2dp(15)
    },
    itemStyle: {
        height: px2dp(54),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: px2dp(25),
    },
    inputStyle: {
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

    //密文眼睛组件样式
    chooseBtn: {
        height: px2dp(44),
        width: px2dp(46),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px2dp(52)
    },
    chooseEye: {
        width: px2dp(20),
        height: px2dp(20),
    }
});

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReducePurchaseSendCode: store.ReducePurchaseSendCode
    }
}

const connectSetCashPassword = connect(mapStateToProps)(SetCashPassword);
connectSetCashPassword.navigationOptions = NavigationOptions;
export default connectSetCashPassword;
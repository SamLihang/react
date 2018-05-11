/**
 * Created by Administrator on 2017/4/24.
 */
import React from "react";
import {StyleSheet, View} from "react-native";
import {BCImage, BCText, BCTouchable, deviceHeight, NavigationOptions, px2dp} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import {toastShort} from "../../../utils/ToastUtil";
import gs from "../../../styles/MainStyles";
import {ActionLogOut} from "../../../actions/EmployeeAction";
import {connect} from "react-redux";

class SetUp extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "设置"
    }

    /*renderText(x) {
        return (
            <BCText style={[gs.fts_14, gs.c_888]}>{x}MB</BCText>
        )
    }*/

    constructor(props) {
        super(props);
        this.state={
            Message:{},
            x:5
        }
    }

    refeshView(msg) {
        this.setState({Message: msg});
    }


    content() {
        const {dispatch} = this.props
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <BCTouchable style={[Styles.passwordStyle, gs.bgc_fff]}>
                    <BCTouchable onPress={() => {
                        this.push('ReviseLoginPassword')
                    }} style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18.5)}]}>登录密码</BCText>
                        <View style={Styles.textStyle}>
                            <BCText style={[{marginRight: px2dp(6)}, gs.fts_14, gs.c_888]}>重置登录密码</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require("../../../imgs/right1.png")}></BCImage>
                        </View>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('RevisePayPassword',{callBack:this.refeshView.bind(this),pageFrom:'SetUp'})
                    }} style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18.5)}]}>支付密码</BCText>
                        <View style={Styles.textStyle}>
                           {/* {this.state.Message?'已设置':'未设置'}*/}
                            <BCText style={[{marginRight: px2dp(6)}, gs.fts_14, gs.c_888]}>已设置</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require("../../../imgs/right1.png")}></BCImage>
                        </View>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('ReviseCheckPassword')
                    }} style={[Styles.itemStyle]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18.5)}]}>验货密码</BCText>
                        <View style={Styles.textStyle}>
                            <BCText style={[{marginRight: px2dp(6)}, gs.fts_14, gs.c_888]}>重置验货密码</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require("../../../imgs/right1.png")}></BCImage>
                        </View>
                    </BCTouchable>
                </BCTouchable>
                <View style={[Styles.otherStyle, gs.bgc_fff]}>
                    <BCTouchable onPress={() => {
                        this.push('PrintSetup')
                    }} style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18.5)}]}>打印机设置</BCText>
                        <View style={{marginRight: px2dp(13), alignItems: 'center'}}>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require("../../../imgs/right1.png")}></BCImage>
                        </View>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.OnClear(this.state.x)
                    }} style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: 1}]}>
                        <View style={{marginLeft: px2dp(18.5)}}>
                            <BCText style={[gs.fts_14, gs.c_3a3838]}>清除缓存</BCText>
                        </View>
                        <View style={{marginRight: px2dp(13)}}>
                            <BCText style={[gs.fts_14, gs.c_888]}>{this.state.x}MB</BCText>
                        </View>
                    </BCTouchable>
                </View>
                <BCTouchable
                    onPress={() => {
                       [ dispatch(ActionLogOut()),
                        this.push('BuyerIndex'),
                           this.ExitAccount()
                       ]
                       }
                    }
                    style={[Styles.btnStyle, gs.bgc_00c164]}>
                    <BCText style={[gs.fts_16, gs.c_fff]}>退出当前账号</BCText>
                </BCTouchable>
            </View>
        )
    }

    OnClear(x){
        toastShort("已清除" + x + "MB缓存");
        this.setState({
            x:0
        })
    }


    // 退出账号提示语

    ExitAccount(){
        toastShort("退出账号成功")
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

//selector：这是你自己编写的一个函数。这个函数声明了你的组件需要整个 store 中的哪一部分数据作为自己的 props。
function selector(store) {
    return {
        currentEmployee: store.ReduceEmployee
    }
}
// 包装 component ，注入 dispatch 和 state 到其默认的 connect(selector)(App) 中；
const setUp = connect(selector)(SetUp);
setUp.navigationOptions = NavigationOptions;
export default  setUp;
var Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    passwordStyle: {
        height: px2dp(145),
        marginTop: px2dp(10)
    },
    itemStyle: {
        flexDirection: 'row',
        height: px2dp(48),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textStyle: {
        marginRight: px2dp(13),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    otherStyle: {
        height: px2dp(96.5),
        marginTop: px2dp(10)
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
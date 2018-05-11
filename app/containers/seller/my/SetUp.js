/**
 * Created by Administrator on 2017/4/24.
 */
import React from "react";
import {StyleSheet, View} from "react-native";
import {BCImage, BCText, BCTouchable, deviceHeight, px2dp} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";

export default class SetUp extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "设置"
    }

    constructor(props){
        super(props);
        this.state={
            Message:{}
        }
    }

    refeshView(msg){
        this.setState({Message:msg});
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <View style={[Styles.passwordStyle, gs.bgc_fff]}>
                    <BCTouchable onPress={() => {
                        this.push('ReviseLoginPassword')
                    }} style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(0.5)}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18.5)}]}>登录密码</BCText>
                        <View style={Styles.textStyle}>
                            <BCText style={[{marginRight: px2dp(6)}, gs.fts_14, gs.c_888]}>重置登录密码</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require("../../../imgs/right1.png")}></BCImage>
                        </View>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('RevisePayPassword',{callBack:this.refeshView.bind(this)})
                    }} style={[Styles.itemStyle, gs.bdc_e3e3e3, {borderBottomWidth: px2dp(0.5)}]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18.5)}]}>支付密码</BCText>
                        <View style={Styles.textStyle}>
                            <BCText style={[{marginRight: px2dp(6)}, gs.fts_14, gs.c_888]}>{this.state.Message?'已设置':'未设置'}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                     source={require("../../../imgs/right1.png")}></BCImage>
                        </View>
                    </BCTouchable>
                </View>
            </View>
        )
    }


    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    passwordStyle: {
        height: px2dp(96),
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
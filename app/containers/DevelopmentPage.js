/**
 * Created by Administrator on 2017/6/20.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, deviceHeight} from '../BaseComponent';
import PageComponent from './PageComponent';
import gs from '../styles/MainStyles'

export default class DevelopmentPage extends PageComponent {
    //设置页面标题
    setTitle() {
        return this.params.title || "售后管理"
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <View style={Styles.logoStyle}>
                    <BCText style={[gs.fts_16, Styles.textStyle]}>程序正在开发中，敬请期待……</BCText>
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
    logoStyle: {
        marginTop: px2dp(116),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        marginTop: px2dp(16.5)
    }
});
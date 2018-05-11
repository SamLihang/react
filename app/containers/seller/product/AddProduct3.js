/**
 * Created by sencha on 2017/5/15.//商品发布成功
 */
import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    BCImage
} from "../../../BaseComponent";
import PageComponent, {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";

export default class AddProduct3 extends PageComponent {

    //是否显示返回
    isShowBack() {
        return false
    }

    //设置页面标题
    setTitle() {
        return "发布成功"
    }

    content() {
        const {ProductId} = this.params;
        return (
            <View style={[Styles.mian, gs.bgc_f2f1ef]}>
                <View style={[Styles.content, gs.bgc_fff]}>
                    <BCImage source={require('../../../imgs/Graphical.png')}/>
                    <BCText style={[gs.fts_15, gs.c_3a3838]}>商品发布成功啦！</BCText>
                    <View style={Styles.btnRowStyle}>
                        <BCTouchable style={Styles.btnStyle}
                                     onPress={() => {
                                         this.push('ProductDetails', {ProductId: ProductId})
                                     }}>
                            <BCText style={[gs.fts_15, {color: '#2dcba0'}]}>查看商品</BCText>
                        </BCTouchable>
                        <BCTouchable style={[Styles.btnStyle, {marginLeft: px2dp(35)}]}
                                     onPress={() => {
                                         this.push('Products')
                                     }}>
                            <BCText style={[gs.fts_15, {color: '#2dcba0'}]}>商品管理</BCText>
                        </BCTouchable>
                    </View>
                    <View style={Styles.btnRowStyle}>
                        <BCTouchable style={Styles.btnStyle}
                                     onPress={() => {
                                         this.push('SellerIndex')
                                     }}>
                            <BCText style={[gs.fts_15, {color: '#2dcba0'}]}>返回首页</BCText>
                        </BCTouchable>
                        <BCTouchable style={[Styles.btnStyle, {marginLeft: px2dp(35)}]}
                                     onPress={() => {
                                         //this.push('AddProduct1')
                                         let routeKey = this.props.navigation.state.key.split('-');
                                         routeKey[2] -= 1;
                                         this.props.navigation.goBack(routeKey.join('-'))
                                     }}>
                            <BCText style={[gs.fts_15, {color: '#2dcba0'}]}>继续发布</BCText>
                        </BCTouchable>
                    </View>
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
        height: deviceHeight
    },
    content: {
        width: deviceWidth,
        height: px2dp(344),
        alignItems: 'center'
    },
    btnRowStyle: {
        flexDirection: 'row',
        paddingTop: px2dp(18)
    },
    btnStyle: {
        width: px2dp(126),
        height: px2dp(32),
        borderRadius: px2dp(16),
        borderWidth: 1,
        borderColor: '#2dcba0',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

function navGoBack(navigation, routeName) {
    const {goBack} = navigation;
    const {routes} = navigation.reduxState.nav;

    let nToGoBack = routes.length + 1;
    let routeKeyToGoBackFrom = null;
    for (let i = routes.length - 2; i >= 0; i--) {
        if (routes[i].routeName === routeName) {
            nToGoBack = routes.length - 1 - i;
            routeKeyToGoBackFrom = routes[i + 1].key;
            break
        }
    }
// choose one
// version 1
    for (let i = 0; i < 2; i++) {
        goBack(null)
    }

// version 2
    if (routeKeyToGoBackFrom !== null) {
        goBack(routeKeyToGoBackFrom)
    }
}
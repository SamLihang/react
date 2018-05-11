/**
 * Created by Administrator on 2017/7/27.
 */
import React, {Component} from "react";
import {InteractionManager, Platform, StyleSheet, TextInput, View, Linking} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {toastShort} from '../../../utils/ToastUtil'

export default class ServiceDetail2 extends PullViewComponent {
    //设置页面标题
    //设置页面标题
    setTitle() {
        return "售后详情"
    }

    rightType() {
        return 'Telephone2'
    }

    onClickNavigationRight() {
        Linking.canOpenURL('tel:400-680-5217').then(supported => {
            if (supported) {
                Linking.openURL('tel:400-680-5217');
            } else {
                toastShort('无法打开该URI: ' + 'tel:400-680-5217');
            }
        })
    }

    RightType() {
        return true
    }

    //关闭
    Close() {
        return (
            <View style={Styles.topStyle}>
                <View style={[Styles.stateStyle3]}>
                    <BCText style={[gs.c_fff, gs.fts_15, {marginLeft: px2dp(20)}]}>
                        商家已拒绝 ， 退款已关闭。
                    </BCText>
                    <BCText style={[gs.c_fff, gs.fts_13, {marginLeft: px2dp(20)}]}>
                        拒绝原因：已与买家协商好，数量无问题。
                    </BCText>
                </View>
                <View style={[Styles.causeStyle, gs.bgc_fff]}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(15)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款金额:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            280元
                        </BCText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(10)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款方式:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            退回余额
                        </BCText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(10)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款原因:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            下单与实际数量不一致
                        </BCText>
                    </View>
                </View>
            </View>
        )
    }

    //商品
    renderProduct() {
        return (
            <View style={Styles.product}>
                <View style={Styles.listStyle}>
                    <BCImage style={{width: px2dp(41), height: px2dp(41)}}
                             source={require('../../../imgs/Balancepayment.png')}/>
                    <View style={Styles.titleStyle}>
                        <BCText style={[gs.fts_16, gs.c_3a3838]}>苦菊（不泡水）</BCText>
                        <View style={Styles.priceStyle}>
                            <BCText style={[gs.c_3a3838, gs.fts_13]}>5斤/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>￥7.76/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>X 1</BCText>
                        </View>
                    </View>
                </View>
                <View style={Styles.listStyle}>
                    <BCImage style={{width: px2dp(41), height: px2dp(41)}}
                             source={require('../../../imgs/Balancepayment.png')}/>
                    <View style={Styles.titleStyle}>
                        <BCText style={[gs.fts_16, gs.c_3a3838]}>苦菊（不泡水）</BCText>
                        <View style={Styles.priceStyle}>
                            <BCText style={[gs.c_3a3838, gs.fts_13]}>5斤/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>￥7.76/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>X 1</BCText>
                        </View>
                    </View>
                </View>
                <View style={Styles.listStyle}>
                    <BCImage style={{width: px2dp(41), height: px2dp(41)}}
                             source={require('../../../imgs/Balancepayment.png')}/>
                    <View style={Styles.titleStyle}>
                        <BCText style={[gs.fts_16, gs.c_3a3838]}>苦菊（不泡水）</BCText>
                        <View style={Styles.priceStyle}>
                            <BCText style={[gs.c_3a3838, gs.fts_13]}>5斤/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>￥7.76/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>X 1</BCText>
                        </View>
                    </View>
                </View>
                <View style={Styles.listStyle}>
                    <BCImage style={{width: px2dp(41), height: px2dp(41)}}
                             source={require('../../../imgs/Balancepayment.png')}/>
                    <View style={Styles.titleStyle}>
                        <BCText style={[gs.fts_16, gs.c_3a3838]}>苦菊（不泡水）</BCText>
                        <View style={Styles.priceStyle}>
                            <BCText style={[gs.c_3a3838, gs.fts_13]}>5斤/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>￥7.76/袋</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_13, {paddingLeft: px2dp(50)}]}>X 1</BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    content() {
        return (
            <View style={[Styles.mainStyle, gs.bgc_f2f1ef]}>
                {this.Close()}
                <View style={[Styles.productList, gs.bgc_fff]}>
                    <BCText style={[gs.fts_14, gs.c_b7b7b7, {paddingVertical: px2dp(5), marginLeft: px2dp(20)}]}>
                        退款编号：RE170330-90581
                    </BCText>
                    {this.renderProduct()}
                </View>
            </View>
        )
    }


    WillMount() {
        this.setState({
            IsReceived: true,
        });
    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        flex: 1,
        minHeight: deviceHeight
    },
    topStyle: {
        paddingVertical: px2dp(8),
        paddingHorizontal: px2dp(8)
    },
    stateStyle: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(69),
        backgroundColor: '#2dcba0',
        justifyContent: 'center'
    },
    stateStyle2: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(69),
        backgroundColor: '#fd827c',
        justifyContent: 'center'
    },
    stateStyle3: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(69),
        backgroundColor: '#c8c8c8',
        justifyContent: 'center'
    },
    causeStyle: {
        width: px2dp(347),
        height: px2dp(102),
        borderBottomLeftRadius: px2dp(4),
        borderBottomRightRadius: px2dp(4),
    },
    productList: {
        width: px2dp(347),
        height: px2dp(279),
        borderRadius: px2dp(4),
        paddingVertical: px2dp(8),
        marginLeft: px2dp(8)
    },
    product: {
        paddingBottom: px2dp(15),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    },
    listStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(41),
        paddingLeft: px2dp(20),
        marginTop: px2dp(15)
    },
    listBoxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(41),
        marginTop: px2dp(15)
    },
    titleStyle: {
        marginLeft: px2dp(14)
    },
    priceStyle: {
        flexDirection: 'row',
    },
});
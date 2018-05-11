/**
 * Created by Administrator on 2017/4/11.
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Alert, Button} from 'react-native';
import PageComponent, {PullViewComponent, PullListComponent} from '../PageComponent'
import {px2dp, deviceWidth, deviceHeight, substr, BCText, BCImage, BCTouchable} from '../../BaseComponent';
import gs from '../../styles/MainStyles';
import {formaTime,toDecimal2} from "../../utils/FormatUtil";

export default class PaySuccess extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            showMaksContent: false,
        }
    }

    //是否显示返回
    isShowBack() {
        return false
    }

    //设置页面标题
    setTitle() {
        return "支付成功"
    }

    renderAddress(ContactName, Phone, Address) {
        return (
            <View style={[Styles.detailHead, gs.bgc_fff]}>
                <View style={Styles.information}>
                    <BCImage style={{marginTop:px2dp(45)}}  source={require("../../imgs/position.png")}/>
                    <View style={Styles.info}>
                        <View style={Styles.consignee}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_3a3838]}>收 货 人 ：{ContactName}</BCText>
                        </View>
                        <View style={Styles.consignee}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_3a3838]}>联系电话：{Phone}</BCText>
                        </View>
                        <View style={Styles.address}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_3a3838]}>收货地址：</BCText>
                            <BCText style={[gs.fts_13, Styles.addressTitle, gs.c_3a3838]}>
                                {substr('' + Address + '', 40)}
                            </BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    content() {
        const Address = this.params.Address;
        const ContactName = this.params.ContactName;
        const Phone = this.params.Phone;
        const AllAmount = this.params.AllAmount;
        const DeliveryAmounts = this.params.DeliveryAmounts;
        return (
            <View>
                <View style={Styles.payTop}>
                    <BCImage source={require("../../imgs/finsihPay.png")} style={{marginLeft: px2dp(15)}}></BCImage>
                    <BCText style={[gs.fts_14, gs.c_fff, {marginLeft: px2dp(8)}]}>已支付 待接单</BCText>
                </View>
                {this.renderAddress(ContactName, Phone, Address)}
                <View style={[Styles.price, gs.bgc_fff]}>
                    <BCText style={[gs.fts_16, gs.c_3a3838, {marginLeft: px2dp(21)}]}>总价：</BCText>
                    <BCText style={[ gs.fts_16, gs.c_fd0319]}>￥{toDecimal2(AllAmount+DeliveryAmounts)}</BCText>
                    <BCText
                        style={[ gs.fts_12, gs.c_888]}>({DeliveryAmounts ? '含配送费' + DeliveryAmounts + '元' : '免配送费'})</BCText>
                </View>
                {/* 2个按钮*/}
                <View style={[Styles.btnView, gs.bgc_fff]}>
                    <BCTouchable onPress={() => {
                        this.push('PurchaseOrderList', {initialPage: 1})
                    }} style={Styles.btn}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>查看订单</BCText>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        this.push('BuyerIndex')
                    }} style={Styles.btn}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>返回首页</BCText>
                    </BCTouchable>
                </View>
            </View>
        )

    }

    WillMount() {
        this.setState({
            IsReceived: true
        });
    }
}

const Styles = StyleSheet.create({
    payTop: {
        width: "100%",
        height: px2dp(37),
        flexDirection: 'row',
        backgroundColor: "#2DCBA1",
        alignItems: 'center'
    },

    detailHead: {
        width: '100%',
        height: px2dp(85),
    },
    information: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(19)
    },
    info: {
        width: deviceWidth - px2dp(32),
        height: px2dp(85),
        paddingTop: px2dp(18)
    },
    consignee: {
        flexDirection: 'row',
    },
    address: {
        paddingTop: px2dp(5),
        flexDirection: 'row'
    },
    addressTitle: {
        width: px2dp(208),
    },
    textStyle: {
        paddingLeft: px2dp(19),
    },
    // priceStyle: {
    //     paddingLeft: px2dp(3),
    // },

    price: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        alignItems: "center",
        height: px2dp(50)
    },
    btnView: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: px2dp(10),
        paddingBottom: px2dp(25),
        alignItems: "center",
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16)
    },
    btn: {
        width: px2dp(125),
        height: px2dp(31),
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: "center"

    },

});

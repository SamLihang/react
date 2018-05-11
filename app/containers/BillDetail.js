import React, {Component} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import {deviceWidth, deviceHeight, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';
import PageComponent from "./PageComponent";
import {toastLong} from '../utils/ToastUtil'
import {formaTime, toDecimal2} from "../utils/FormatUtil";

export default class BillDetail extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            Text: "",
        }
    }

    //设置页面标题
    setTitle() {
        return "账单详情";
    }

    renderTop(amount, companyName) {
        return (
            <View style={Styles.top}>
                <BCText style={[gs.fts_15, gs.c_3a3838, {marginBottom: px2dp(20)}]}>{companyName}</BCText>
                <BCText style={[gs.fts_20, gs.c_fd0319, {marginBottom: px2dp(20)}]}>{amount}</BCText>
                <BCText style={[gs.fts_13, gs.c_888]}>交易成功</BCText>
            </View>
        )
    }

    renderDetail(createTime, content, partnerName, billId,payTypeText) {
        let createTimeText = formaTime(createTime, 'yyyy-MM-dd hh:mm');
        return (
            <View style={[{borderBottomWidth: 1, borderBottomColor: '#E3E3E3'}]}>
                <View style={[Styles.item]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginRight: px2dp(15)}]}>交易内容：</BCText>
                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{content}</BCText>
                </View>
                <View style={[Styles.item]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginRight: px2dp(15)}]}>支付方式：</BCText>
                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{payTypeText}</BCText>
                </View>
                <View style={[Styles.item]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginRight: px2dp(15)}]}>对方账户：</BCText>
                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{partnerName}</BCText>
                </View>
                <View style={[Styles.item]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginRight: px2dp(15)}]}>创建时间：</BCText>
                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{createTimeText}</BCText>
                </View>
                <View style={[Styles.item]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginRight: px2dp(15)}]}>账单流水号：</BCText>
                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{billId}</BCText>
                </View>
            </View>
        )
    }

    content() {
        const {amount, companyName, createTime, content, partnerName, billId,payTypeText} = this.params;
        return (
            <View style={[Styles.Main, gs.bgc_fff]}>
                {this.renderTop(amount, companyName)}
                {this.renderDetail(createTime, content, partnerName, billId,payTypeText)}
            </View>
        );
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }

    WillReceive(nextProps) {
    }
}

const Styles = StyleSheet.create({
    Main: {
        flex: 1
    },
    top: {
        height: px2dp(160),
        alignItems: 'center',
        paddingTop: px2dp(25),
    },
    item: {
        flexDirection: 'row',
        height: px2dp(42),
        borderTopWidth: 1,
        borderTopColor: '#E3E3E3',
        marginLeft: px2dp(10),
        alignItems: 'center'
    },

    listLeft: {
        width: px2dp(50),
        height: px2dp(55),
        justifyContent: 'center',
        alignItems: 'center',
    },
    listCenter: {
        height: px2dp(55),
        justifyContent: 'center',
        marginLeft: px2dp(35)
    }
})
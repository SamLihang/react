/**
 * Created by Administrator on 2017/4/24.
 */
import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import PageComponent from "../../../PageComponent";
import {BCImage, BCText, BCTouchable, px2dp} from "../../../../BaseComponent";
import gs from "../../../../styles/MainStyles";

export default class CommonProblem extends PageComponent {
    //设置页面标题
    setTitle() {
        return "常见问题"
    }

    constructor(props) {
        super(props);
        this.state = {
            addBtnY: -9999,
            //主分类数组
            categoryArray: [
                {categoryName: '账号问题', isHot: 1},
                {categoryName: '订购问题', isHot: 0},
                {categoryName: '钱款问题', isHot: 0},
            ],

            //内容部分
            contentArray: [
                {
                    title: "0",
                    content1: "如何注册和登录报菜郎账户",
                    content2: "修改账户信息",
                    content3: "如何修改支付密码",
                    content4: "如何查找想要的商品",
                    content5: "忘记密码怎么办",
                    isHot: 1
                },
                {
                    title: "1",
                    content1: "如何采购",
                    content2: "如何取消订单",
                    content3: "如何查看订单状态或历史订单",
                    content4: "如何查看我的订单是否已经成功取消",
                    isHot: 0
                },
                {
                    title: "2",
                    content1: "如何充值",
                    content2: "如何提现",
                    content3: "提现多久到账",
                    content4: "如何查看账单",
                    content5: "为什么余额提现的处理周期为3天",
                    isHot: 0
                }
            ],
        }
    }

    //主分类的点击事件
    renderCategory() {
        let categoryArray = this.state.categoryArray;
        return (
            <View style={[Styles.Category, gs.bgc_fff]}>
                <ScrollView contentContainerStyle={[{paddingLeft: px2dp(28)}]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                    {
                        categoryArray.map((e, index) => {
                            return (
                                <View  key={index}>
                                <BCTouchable
                                             style={[Styles.CategoryItem, e.isHot ? {borderBottomColor: '#fd5757'} : gs.bdc_fff]}
                                             onPress={() => {
                                                 this.onClickCategory(index)
                                             }}>
                                    <BCText
                                        style={[gs.fts_15, e.isHot ? {color: '#fd5757'} : gs.c_888]}>{e.categoryName}</BCText>
                                </BCTouchable>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }

    // 内容部分样式
    renderList(index) {
        switch (index) {
            case "0":
                return (
                    <View style={[{height: px2dp(217.5)}, gs.bgc_fff]} key={index}>
                        <BCTouchable onPress={() => {
                            this.push('LoginProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content1}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('ReviseAccountProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content2}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('PayProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content3}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('LookUpProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content4}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('PasswordProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content5}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                    </View>
                );
                break;
            case "1":
                return (
                    <View style={[{height: px2dp(217.5)}, gs.bgc_fff]} key={index}>
                        <BCTouchable onPress={() => {
                            this.push('PurchaseProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content1}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('CancelProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content2}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('OrderProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content3}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('CancelOrderProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content4}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                    </View>
                );
                break;
            case "2":
                return (
                    <View style={[{height: px2dp(217.5)}, gs.bgc_fff]} key={index}>
                        <BCTouchable onPress={() => {
                            this.push('RechargeProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content1}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('TakeCashProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content2}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('TimeProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content3}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('LookOrderProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content4}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                        <BCTouchable onPress={() => {
                            this.push('BalanceProblem')
                        }} style={[Styles.listRowStyle, gs.bdc_e3e3e3]}>
                            <BCText
                                style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20.5)}]}>{this.state.contentArray[index].content5}</BCText>
                            <BCImage style={{width: px2dp(12), height: px2dp(12), marginRight: px2dp(12)}}
                                     source={require('../../../../imgs/right1.png')}></BCImage>
                        </BCTouchable >
                    </View>
                );
                break;
        }

    }

    //点击主分类
    onClickCategory(i) {
        let category = this.state.categoryArray;
        let content = this.state.contentArray;
        if (category[i].isHot) {
            this.renderList(i)
        }
        else {
            category.map((e, index) => {
                if (i == index) {
                    category[index].isHot = 1;

                }
                else {
                    category[index].isHot = 0;
                }
            });
            content.map((e, index) => {
                if (i == index) {
                    content[index].isHot = 1;

                }
                else {
                    content[index].isHot = 0;
                }
            });

            this.setState({
                categoryArray: category,
                contentArray: content
            })
        }
    }

    //内容
    renderContent() {
        return (
            <View style={[Styles.content, gs.bgc_fff]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[]}>
                    {/*内容部分*/}
                    {this.state.contentArray.map((obj,index) => {
                        if (obj.isHot == 1) {
                            return ( this.renderList(obj.title,index))
                        }
                    })}
                </ScrollView>
            </View>
        )
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {this.renderCategory()}
                {this.renderContent()}
            </View>
        )
    }

    WillMount() {
        this.setState({
            IsReceived: true
        })
    }
}

var Styles = StyleSheet.create({
    main: {
        flex: 1
    },
    Category: {
        flexWrap: 'nowrap',
    },
    CategoryItem: {
        height: px2dp(43),
        borderBottomWidth: 2,
        alignItems: 'center',
        marginRight: px2dp(24),
        justifyContent: 'center'
    },
    content: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        flexDirection: "row",
        flexWrap: 'nowrap',
    },
    listRowStyle: {
        height: px2dp(43.5),
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
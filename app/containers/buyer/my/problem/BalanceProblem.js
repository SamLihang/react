/**
 * Created by Administrator on 2017/4/24.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr,deviceHeight} from '../../../../BaseComponent';
import {PullViewComponent} from '../../../PageComponent';
import gs from '../../../../styles/MainStyles'

export default class BalanceProblem extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "问题详情"
    }

    content(){
        return(
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                <View style={[gs.bgc_fff,Styles.main]}>
                    <View style={Styles.titleStyle}>
                        <BCImage style={{marginLeft:px2dp(12)}} source={require('../../../../imgs/questions.png')}></BCImage>
                        <BCText style={[gs.fts_14,gs.c_3a3838,{marginLeft:px2dp(7)}]}>为什么余额提现的处理周期为3天</BCText>
                    </View>
                    <View style={Styles.answerStyle}>
                        <BCImage style={{marginLeft:px2dp(12)}} source={require('../../../../imgs/Answer.png')}></BCImage>
                        <View>
                            <BCText style={[gs.fts_14,gs.c_888,{marginLeft:px2dp(7)}]}>1.为了保证用户资金安全，余额提现周期受银行、支付机构等相关因素影响，处理周期0-3个工作日。</BCText>
                            <BCText style={[gs.fts_14,gs.c_888,{marginLeft:px2dp(7)}]}>2.退款过程中如遇到问题，请及时联系客服处理，客服电话 400-680-5217。</BCText>
                        </View>
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

var Styles = StyleSheet.create({
    main: {
        flex: 1,
        height:deviceHeight
    },
    titleStyle:{
        height:px2dp(52),
        flexDirection:'row',
        alignItems:'center'
    },
    answerStyle:{
        width:px2dp(309),
        flexDirection:'row',
    }
})
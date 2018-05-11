import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr,deviceHeight} from '../../../../BaseComponent';
import {PullViewComponent} from '../../../PageComponent';
import gs from '../../../../styles/MainStyles'

export default class CapitalSafetyInstructions extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "资金安全说明"
    }

    content(){
        return(
            <View style={[Styles.main, gs.bgc_fff]}>
                <View style={[Styles.content]}>
                    <BCText style={[Styles.text,gs.fts_14,gs.c_666]}>
                        1.报菜郎商城的所有交易货款，从用户支付到系统入账，再到商家提现，由浙江泰隆商业银行全程进行资金监管，安全可靠无风险。
                    </BCText>
                    <BCText style={[Styles.text,gs.fts_14,gs.c_666]}>
                    2.在运营过程中，报菜郎商城无权动用商家的货款，只有商家可以申请提现自己的货款，提现时必须输入预先设定验证身份，提现成功后，货款只能转入该商家的预先指定账户。
                    </BCText>
                    <BCText style={[Styles.text,gs.fts_14,gs.c_666]}>
                    3.报菜郎商城的交易货款，一旦入账，只会流入报菜郎商城在浙江泰隆商业银行的对公账户，不会流向任何其他账户。
                    </BCText>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',position:'absolute',bottom:px2dp(12)}}>
                    <BCImage style={{width:px2dp(16),height:px2dp(16)}} source={require('../../../../imgs/Capital.png')}/>
                    <BCText style={[gs.c_888,gs.fts_13]}>报菜郎保护您的资金安全</BCText>
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
        height:deviceHeight-px2dp(70),
        alignItems: 'center'
    },
    content:{
        marginHorizontal:px2dp(9.5),
        marginTop:px2dp(15)
    },
    text:{
        marginBottom:px2dp(30),
    }
})
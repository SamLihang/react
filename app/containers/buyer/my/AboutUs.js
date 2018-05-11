/**
 * Created by Administrator on 2017/4/24.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr,deviceHeight,version} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import gs from '../../../styles/MainStyles'

export default class AboutUs extends PageComponent{
    //设置页面标题
    setTitle() {
        return "关于我们"
    }

    content(){
        return(
            <View style={[Styles.main,gs.bgc_f2f1ef]}>
                <View style={Styles.logoStyle}>
                    <BCImage source={require("../../../imgs/LOGO.png")}></BCImage>
                    <BCText style={[gs.fts_16,Styles.textStyle]}>版本Version {version}</BCText>
                </View>
                <View style={Styles.companyStyle}>
                    <BCText style={[gs.fts_14,gs.c_888]}>浙江牛郎网络科技有限公司</BCText>
                    <BCText style={[gs.fts_13,gs.c_b7b7b7]}>Cowboy Hangzhou Network Technology Co. , Ltd</BCText>
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
    main:{
      flex:1,
    },
    logoStyle:{
        marginTop:px2dp(116),
        alignItems:'center',
        justifyContent:'center',
    },
    textStyle:{
        marginTop:px2dp(16.5)
    },
    companyStyle:{
        justifyContent:'center',
        alignItems:'center',
       paddingTop:deviceHeight-px2dp(360)
    }
})
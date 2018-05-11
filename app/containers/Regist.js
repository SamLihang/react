/**
 * Created by sencha on 2017/3/28.
 */
import React, {Component} from 'react';
import {BCImage, BCTouchable, BCText, px2dp} from '../BaseComponent';
import PageComponent, {PullViewComponent} from './PageComponent';
import {toastLong} from '../utils/ToastUtil'
import {StyleSheet, View, TextInput, Button, TouchableOpacity, Platform} from 'react-native';
import {request} from '../utils/RequestUtil';
import ForgetPassword from './ForgetPassword';
import gs from '../styles/MainStyles';
export default class Regist extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            testcode: ''
        }
    }

    renderNavigator() {
        return (
            <BCTouchable style={Styles.close} onPress={() => this.onClose()}>
                <BCImage source={require('../imgs/close.png')}/>
            </BCTouchable>
        )
    }



    onNext() {
        var registNo = this.state.phone.trim();
        var testcode = this.state.testcode.trim();
        if (registNo == '') {
            toastLong("手机号不能为空");
            return false;
        }
        if (!/^1[0-9]{10}$/.test(registNo)) {
            toastLong("手机号格式错误");
            return false;
        }
        if (testcode == '') {
            toastLong("验证码不能为空");
            return false;
        }

    }

    content() {
        return (
            <View style={Styles.login}>
                <View style={Styles.main}>
                    <View style={Styles.tab}>
                        <BCTouchable style={[Styles.menu, gs.bdc_cccccc]} onPress={() => {
                            this.jumpBack()
                        }}>
                            <BCText style={[gs.fts_17, gs.c_3a3838]}>登陆</BCText>
                        </BCTouchable>
                        <View style={[Styles.menu, gs.bdc_00C364]}>
                            <BCText style={[gs.fts_17, gs.c_3a3838]}>注册</BCText>
                        </View>
                    </View>
                    <View style={Styles.item}>
                        <TextInput style={Styles.textInput} placeholder='手机号' keyboardType='numeric' autoFocus={true}
                                   onChangeText={(text) => this.setState({phone: text})}
                                   underlineColorAndroid='transparent'/>
                    </View>
                    <View style={[Styles.item,Styles.itemRow]}>
                        <TextInput style={[Styles.textInput,Styles.textInputW]} placeholder='验证码'
                                   onChangeText={(text)=>this.setState({testcode:text})}/>
                        <BCTouchable style={Styles.testbutton} activeOpacity={0.8}>
                            <BCText style={[gs.c_888]}>获取验证码</BCText>
                        </BCTouchable>
                    </View>
                    <BCTouchable style={Styles.button} activeOpacity={0.8} onPress={this.onNext.bind(this)}>
                        <BCText style={Styles.buttonText}>下一步</BCText>
                    </BCTouchable>
                    <View style={Styles.agreement}>
                        <BCText style={[gs.c_888,gs.fts_13]}>注册代表同意 </BCText>
                        <BCTouchable>
                            <BCText style={[{color:'#00C164'},gs.fts_13]}>注册协议</BCText>
                        </BCTouchable>
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    login: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: '30%'
    },
    close: {
        marginRight: px2dp(5),
        marginTop: Platform.OS === 'ios' ? px2dp(20) : 0,
        width: px2dp(32),
        height: px2dp(32),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    main: {
        width: '100%',
        paddingRight: px2dp(40),
        paddingLeft: px2dp(40)
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: px2dp(9),
        paddingRight: px2dp(9)
    },
    menu: {
        width: px2dp(137),
        height: px2dp(40),
        borderBottomWidth: 4,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    },
    itemRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    textInput: {
        height: 50,
        paddingLeft: 10
    },
    textInputW:{
        width:'65%'
    },
    testbutton:{
        width:px2dp(100),
        height:px2dp(29),
        borderRadius:20,
        borderWidth:1,
        borderColor:gs.bdc_bdbdbd,
        alignItems:'center',
        justifyContent:'center',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#ccc',
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    agreement:{
        height:40,
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }

})
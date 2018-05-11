/**
 * Created by sencha on 2017/3/28.
 */
import React, {Component} from 'react';
import {BCImage, BCTouchable, BCText, px2dp,deviceWidth,deviceHeight} from '../BaseComponent';
import PageComponent, {PullViewComponent} from './PageComponent';
import {toastLong} from '../utils/ToastUtil'
import {StyleSheet, View, TextInput, Button, TouchableOpacity, Platform} from 'react-native';
import {request} from '../utils/RequestUtil';
import gs from '../styles/MainStyles';
import Login from './Login'
export default class RegistNext extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            contact: '',
            shopname: '',
            shopaddress:'',
        }
    }

    renderNavigator() {
        return (
            <BCTouchable style={Styles.close} onPress={() => this.pop(4)}>
                <BCImage source={require('../imgs/close.png')}/>
            </BCTouchable>
        )
    }


    onRegist() {
        var contact = this.state.contact.trim();
        var shopname = this.state.shopname.trim();
        var shopaddress = this.state.shopaddress.trim();
        if (contact == '') {
            toastLong("联系人姓名不能为空");
            return false;
        }
        if (shopname == '') {
            toastLong("店铺名称不能为空");
            return false;
        }
        if (shopaddress == '') {
            toastLong("店铺位置不能为空");
            return false;
        }
    }


    //可以与登录切换
    toLogin() {
        let login=this.getRoute("Login");
        if (login) {
            this.jumpTo(login);
        }else{
            this.push({name: 'Login', component: Login})
        }
    }


    content() {
        return (
                <View style={Styles.regist}>
                    <View style={Styles.main}>
                        <View style={Styles.tab}>
                            <BCTouchable style={[Styles.menu, gs.bdc_cccccc]} onPress={() => this.toLogin()}>
                                <BCText style={[gs.fts_17, gs.c_3a3838]}>登陆</BCText>
                            </BCTouchable>
                            <View style={[Styles.menu, gs.bdc_00C364]}>
                                <BCText style={[gs.fts_17, gs.c_3a3838]}>注册</BCText>
                            </View>
                        </View>
                        <View style={[Styles.item, gs.bdc_e3e3e3]}>
                            <TextInput style={Styles.textInput}
                                       placeholder='联系人姓名'
                                       placeholderTextColor='#b7b7b7'
                                       maxLength={11}
                                       onChangeText={(text) => this.setState({contact: text})}
                                       underlineColorAndroid='transparent'/>
                        </View>
                        <View style={[Styles.item, gs.bdc_e3e3e3]}>
                            <TextInput style={Styles.textInput} placeholder='店铺名称' placeholderTextColor='#b7b7b7'
                                       onChangeText={(text) => this.setState({shopname: text})}/>
                        </View>
                        <View style={[Styles.item, gs.bdc_e3e3e3]}>
                            <TextInput style={Styles.textInput} placeholder='店铺位置' placeholderTextColor='#b7b7b7'
                                       onChangeText={(text) => this.setState({shopaddress: text})}/>
                        </View>
                        <BCTouchable style={[Styles.nextButton]} onPress={()=>this.onRegist()} activeOpacity={0.8}>
                            <BCText style={[gs.c_fff, gs.fts_14]}>注册</BCText>
                        </BCTouchable>
                    </View>
                </View>
        )
    }
}

const Styles = StyleSheet.create({
    regist: {
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
        paddingRight: px2dp(9),
        marginBottom: px2dp(30)
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
        height: px2dp(54),
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        height: px2dp(54),
        width: px2dp(275),
        paddingLeft: px2dp(10),
        textAlign: 'left',
        marginLeft: px2dp(10),
        padding: 0
    },
    textInputW: {
        width: '60%'
    },
    testButton: {
        width: px2dp(100),
        height: px2dp(29),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: gs.bdc_bdbdbd,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        marginTop: px2dp(25),
        height: px2dp(40),
        borderRadius: px2dp(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc'
    },
    agreement: {
        height: px2dp(40),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectType: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width:deviceWidth,
        height: px2dp(183),
        zIndex:2
    },
    maks:{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width:deviceWidth,
        height:deviceHeight,
        opacity:0.3,
        zIndex:1
    },
    menuTitle: {
        height: px2dp(54),
        justifyContent: 'center',
        alignItems:'center'
    },
    menuItem: {
        height: px2dp(62),
        justifyContent: 'center',
        alignItems:'center'
    }
})
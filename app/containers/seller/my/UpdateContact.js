import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr,NavigationOptions,deviceHeight} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import BCNavigator from  '../../../components/BCNavigator'
import gs from '../../../styles/MainStyles'
import {toastShort, confirm} from '../../../utils/ToastUtil';
import {connect} from 'react-redux';
import {fetchContactName} from '../../../services/MyServices';

class UpdateContact extends PageComponent{
    constructor(props) {
        super(props);
        this.state = {
            ContactName: ''
        }
    }
    //设置页面标题
    setTitle() {
        return "修改联系人"
    }
    rightTitle() {
        return "保存"
    }
    RightType(){
        return true
    }
    onClickNavigationRight() {
        const {dispatch} = this.props;
        let contactName = this.state.ContactName.trim();
        if(contactName==''){
            toastShort(JSON.stringify('店铺联系人不能为空'));
            return false
        }
        fetchContactName({contactName}).then((ret) => {
            toastShort(JSON.stringify('修改店铺联系人成功'));
            //调用callback刷新前一个页面
            if(contactName){
                let callBack = this.navigation.state.params.callback;
                callBack();
                this.pop()
            }
        }).catch((e) => {

        })
    }
    content(){
        return(
            <View style={Styles.main}>
                <TextInput style={[gs.bgc_fff,{width:deviceWidth,height:px2dp(43),paddingLeft:px2dp(20)}]}
                           underlineColorAndroid='transparent'
                           placeholder='联系人姓名'
                           placeholderTextColor='#b7b7b7'
                           maxLength={20}
                           onChangeText={(text) => {
                               //console.log(text)
                               this.setState({ContactName: text})
                           }}
                />
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
    main:{
        flex:1,
        height:deviceHeight
    },
    logoStyle:{
        marginTop:px2dp(116),
        alignItems:'center',
        justifyContent:'center'
    },
    textStyle:{
        marginTop:px2dp(16.5)
    }
})

function mapStateToProps(store) {
    return {
        ReduceContactName: store.ReduceContactName,
    }
}
const connectUpdateContact = connect(mapStateToProps)(UpdateContact);
connectUpdateContact.navigationOptions = NavigationOptions;
export default connectUpdateContact;

import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, NavigationOptions,deviceHeight} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import gs from '../../../styles/MainStyles';
import {toastShort, confirm} from '../../../utils/ToastUtil';
import {connect} from 'react-redux';
import {fetchCompanyDescription} from '../../../services/MyServices';
import {ActionSellInfo} from "../../../actions/MyAction";
import {ActionEmployee} from '../../../actions/EmployeeAction'

class StoreIntroduction extends PageComponent {

    constructor(props) {
        super(props);
        this.state = {
            StoreIntroduction: ''
        }
    }

    //设置页面标题
    setTitle() {
        return "店铺简介"
    }

    rightTitle() {
        return "保存"
    }

    RightType() {
        return true
    }

    onClickNavigationRight() {

        const {dispatch,currentEmployee} = this.props;
        let companyDescription = this.state.StoreIntroduction.trim();
        if(companyDescription==''){
            toastShort(JSON.stringify('店铺简介不能为空'));
            return false
        }
        fetchCompanyDescription({companyDescription}).then((ret) => {
            toastShort(JSON.stringify('修改店铺简介成功'));
            //调用callback刷新前一个页面
            currentEmployee.CompanyDescription=companyDescription

            dispatch(ActionSellInfo());
            dispatch(ActionEmployee(currentEmployee));

            if(companyDescription){
                let callBack = this.navigation.state.params.callback;
                callBack();
                this.pop()
            }
        }).catch((e) => {

        })
    }

    content() {
        return (
            <View style={Styles.main}>
                <TextInput style={[gs.bgc_fff, {width: deviceWidth, height: px2dp(132), paddingLeft: px2dp(20)}]}
                           multiline={true}
                           underlineColorAndroid='transparent'
                           placeholder='请输入店铺简介'
                           placeholderTextColor='#b7b7b7'
                           naxLength={200}
                           onChangeText={(text) => {
                               this.setState({StoreIntroduction: text})
                           }}
                />
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
    main: {
        flex: 1,
        height:deviceHeight
    },
    logoStyle: {
        marginTop: px2dp(116),
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        marginTop: px2dp(16.5)
    }
})

function mapStateToProps(store) {
    return {
        ReduceCompanyDescription: store.ReduceCompanyDescription,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}
const connectStoreIntroduction = connect(mapStateToProps)(StoreIntroduction);
connectStoreIntroduction.navigationOptions = NavigationOptions;
export default connectStoreIntroduction;
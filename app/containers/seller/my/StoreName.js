import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceWidth, substr, NavigationOptions,deviceHeight} from '../../../BaseComponent';
import PageComponent from '../../PageComponent';
import gs from '../../../styles/MainStyles'
import {toastShort, confirm} from '../../../utils/ToastUtil';
import {connect} from 'react-redux';
import {fetchCompanyName} from '../../../services/MyServices';
import {ActionSellInfo} from "../../../actions/MyAction";
import {ActionEmployee} from '../../../actions/EmployeeAction'

class StoreName extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            CompanyName: ''
        }
    }

    //设置页面标题
    setTitle() {
        return "修改店铺名称"
    }

    rightTitle() {
        return "保存"
    }

    RightType() {
        return true
    }

    onClickNavigationRight() {
        const {dispatch,currentEmployee} = this.props;
        let companyFullName = this.state.CompanyName.trim();
        if(companyFullName==''){
            toastShort(JSON.stringify('店铺名称不能为空'));
            return false
        }
        fetchCompanyName({companyFullName}).then((ret) => {
            toastShort(JSON.stringify('修改店铺名称成功'));
            //调用callback刷新前一个页面
            currentEmployee.CompanyName=companyFullName
            dispatch(ActionSellInfo());
            dispatch(ActionEmployee(currentEmployee));

            if(companyFullName){
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
                <TextInput style={[gs.bgc_fff, {width: deviceWidth, height: px2dp(43), paddingLeft: px2dp(20)}]}
                           underlineColorAndroid='transparent'
                           placeholder='请输入店铺名称'
                           placeholderTextColor='#b7b7b7'
                           maxLength={20}
                           onChangeText={(text) => {
                               //console.log(text)
                               this.setState({CompanyName: text})
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
});

function mapStateToProps(store) {
    return {
        ReduceCompanyName: store.ReduceCompanyName,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}
const connectStoreName = connect(mapStateToProps)(StoreName);
connectStoreName.navigationOptions = NavigationOptions;
export default connectStoreName;

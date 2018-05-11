/**
 * Created by Administrator on 2017/5/26.
 */
import React from "react";
import {StyleSheet, View} from "react-native";
import {
    BCImage, BCText, deviceHeight, px2dp, substr, NavigationOptions, BCHostImage,
    BCTouchable
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from 'react-redux';
import {ActionGetCustomer} from "../../../actions/MyAction";


class MyCustomer extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "我的客户"
    }

    renderAddress(datas){
        let data=datas;
        const {dispatch, currentEmployee} = this.props;
        let sCompanyId=currentEmployee.CompanyId;
        return(
            data.map((item,index)=>{
                return(
                    <BCTouchable key={index} onPress={() => { this.push('CompanyDetial', {bCompanyId:0,sCompanyId:item.GlobalCompanyId ,from:0})}}>
                    <View key={index}  style={Styles.listStyle}>
                        {
                            item.LogoImage?
                                <BCHostImage style={Styles.img}
                                             source={{uri: item.LogoImage}}/> :
                                <BCImage style={Styles.img}
                                         source={require('../../../imgs/Headportrait.png')}/>
                        }
                        <View style={{marginLeft: px2dp(10)}}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{item.CompanyFullName}</BCText>
                            <View style={Styles.addressStyle}>
                                <BCImage source={require('../../../imgs/add.png')}/>
                                <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(8)}]}>{item.Address}</BCText>
                            </View>
                        </View>
                    </View>
                    </BCTouchable>
                )
            })
        )
    }

    content() {
        const ReduceGetCustomer=this.props.ReduceGetCustomer;
        if(ReduceGetCustomer.datas){
            let datas=ReduceGetCustomer.datas;
            return (
                <View style={[Styles.main, gs.bgc_fff]}>
                    {this.renderAddress(datas)}
                </View>
            )
        }
    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionGetCustomer());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceGetCustomer.datas != null && nextProps.ReduceGetCustomer.datas != this.props.ReduceGetCustomer.datas) {
            this.setState({
                IsReceived: true
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    listStyle: {
        height: px2dp(77),
        borderBottomWidth: 0.5,
        borderBottomColor: '#f2f1ef',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft:px2dp(17)
    },
    img: {
        width: px2dp(53),
        height: px2dp(53)
    },
    addressStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px2dp(10)
    },
})

function mapStateToProps(store) {
    return {
        ReduceGetCustomer: store.ReduceGetCustomer,
        currentEmployee: store.ReduceEmployee.currentEmployee,
    }
}
const connectMyCustomer = connect(mapStateToProps)(MyCustomer);
connectMyCustomer.navigationOptions = NavigationOptions;
export default connectMyCustomer;
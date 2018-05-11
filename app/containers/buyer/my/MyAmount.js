/**
 * Created by Administrator on 2017/5/2.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView, Platform, Alert} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceWidth,
    substr,
    NavigationOptions,
    deviceHeight
} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles';
import {ActionMyAmount} from '../../../actions/MyAction';
import {connect} from 'react-redux';
import {BCMyAmountNavigator} from "../../../components/BCNavigator";


class MyAmount extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "我的余额"
    }

    constructor(props) {
        super(props)
    }

    onClickNavigationRight() {
        this.push('MyBill')
    }

    renderNavigator() {
        return (
            <BCMyAmountNavigator navigation={this.props.navigation}
                                 title={this.setTitle()}
                                 OnBack={() => {
                                     const {navigation} = this.props;
                                     if (navigator) {
                                         navigation.goBack();
                                     }
                                 }}
                                 OnClick={() => {
                                     this.onClickNavigationRight()
                                 }}
            />
        )
    }

    renderTop(UsabelBalance) {
        return (
            <View style={Styles.headerStyle}>
                <View>
                    <BCText style={[gs.fts_15, gs.c_fff, {
                        marginTop: px2dp(20),
                        marginLeft: px2dp(20)
                    }]}>账户余额(元)</BCText>
                    <BCText
                        style={[gs.c_fff, {
                            marginTop: px2dp(20),
                            marginLeft: px2dp(20),
                            fontSize: 45
                        }]}>{UsabelBalance}</BCText>
                </View>
                <View style={Styles.ExplainStyle}>
                    <BCTouchable onPress={() => {
                        this.push('CapitalSafetyInstructions') }} style={{flexDirection: 'row',justifyContent: 'flex-end',}}>
                        <BCImage style={{marginRight: px2dp(5.5)}}
                                 source={require('../../../imgs/Explain.png')}/>
                        <BCText style={[gs.fts_12, gs.c_fff, {marginRight: px2dp(12.5)}]}>资金安全说明</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }


    content() {
        const ReducePurchaseMyAmount = this.props.ReducePurchaseMyAmount;
        if (ReducePurchaseMyAmount.datas) {
            let datas = ReducePurchaseMyAmount.datas
            return (
                <View style={[Styles.mian, gs.bgc_f2f1ef]}>
                    {this.renderTop(datas.UsabelBalance) }
                    <View style={Styles.ListStyle}>
                        <BCTouchable onPress={() => {
                            this.push('ReCharge')
                        }} style={[Styles.ItemStyle, gs.bgc_fff]}>
                            <View style={{flexDirection: 'row', marginLeft: px2dp(20), alignItems: 'center'}}>
                                <BCImage source={require('../../../imgs/Recharge.png')}/>
                                <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(14.5)}]}>充值</BCText>
                            </View>
                            <View style={{marginRight: px2dp(12.5), width: px2dp(14), height: px2dp(14)}}>
                                <BCImage source={require('../../../imgs/right1.png')}/>
                            </View>
                        </BCTouchable>
                        <BCTouchable onPress={() => {
                            this.TakeCash()
                        }} style={[Styles.ItemStyle, gs.bgc_fff, {marginTop: px2dp(0.5)}]}>
                            <View style={{flexDirection: 'row', marginLeft: px2dp(20), alignItems: 'center'}}>
                                <BCImage source={require('../../../imgs/Withdrawals.png')}/>
                                <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(14.5)}]}>提现</BCText>
                            </View>
                            <View style={{marginRight: px2dp(12.5), width: px2dp(14), height: px2dp(14)}}>
                                <BCImage source={require('../../../imgs/right1.png')}/>
                            </View>
                        </BCTouchable>
                    </View>
                </View>
            )
        } else {
            return this.noRecord()
        }
    }

    TakeCash(){
        const {dispatch} = this.props;
        const currentEmployee=this.props.currentEmployee;
        let ResetPayPasswordNeeded=currentEmployee.ResetPayPasswordNeeded;
        if(ResetPayPasswordNeeded){
            this.push('SetCashPassword');
        }else{
            this.push('NotAccount',{pageFrom: 'MyAmount'});
        }
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionMyAmount());
    }

    WillReceive(nextProps) {
        if (nextProps.ReducePurchaseMyAmount.datas && nextProps.ReducePurchaseMyAmount.datas !== this.props.ReducePurchaseMyAmount.datas) {
            this.setState({
                IsReceived: true,
                UsabelBalance: nextProps.ReducePurchaseMyAmount.datas.UsabelBalance
            });
        }
    }
}

const Styles = StyleSheet.create({
    mian: {
        flex: 1,
        height: deviceHeight
    },
    headerStyle: {
        width: deviceWidth,
        height: px2dp(186.5),
        backgroundColor: '#FF9256',
    },
    top: {
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? px2dp(64) : px2dp(44),
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        paddingBottom: px2dp(8),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        backgroundColor: '#FF9256',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    location: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ExplainStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: px2dp(30)
    },
    ListStyle: {
        height: px2dp(96.5),
        marginTop: px2dp(10),
    },
    ItemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: px2dp(48),
        alignItems: 'center'
    },

})

function mapStateToProps(store) {
    return {
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReducePurchaseMyAmount: store.ReducePurchaseMyAmount
    }
}
const connectPurchaseMyAmount = connect(mapStateToProps)(MyAmount);
connectPurchaseMyAmount.navigationOptions = NavigationOptions;
export default connectPurchaseMyAmount;
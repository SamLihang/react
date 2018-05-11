/**
 * Created by Administrator on 2017/4/25.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView, Platform} from 'react-native';
import {
    BCImage,
    BCTouchable,
    BCText,
    px2dp,
    deviceHeight,
    substr,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles';
import {toDecimal2} from "../../../utils/FormatUtil";
import {ActionAccount} from '../../../actions/AccountAction';
import {connect} from 'react-redux';

class AccountPay extends PullViewComponent {
    constructor(props) {
        super(props);

    }

    //设置页面标题
    setTitle() {
        return "账期结算"
    }

    renderName(name) {
        return (
            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(name, 16)}</BCText>
        )
    }

    renderItem() {
        let {ReduceAccount} = this.props;
        if (ReduceAccount.datas.length <= 0) {
            return this.noRecord('暂无数据');
        }
        else {
            let datas = ReduceAccount.datas;
            return (
                datas.map((item, index) => {
                        let img = item.Image;
                        let name = item.CompanyName;
                        let cycle = item.CycleStr;
                        let state = item.StateStr;
                        let amount = item.Amount;
                        let unPaid = item.UnPaidAmount;
                        let sCompanyId = item.SCompanyId;
                        return (
                            <View key={index} style={[Styles.accountStyle, gs.bgc_fff]}>
                                <View style={[Styles.rowStyle]}>
                                    <View style={Styles.companyStyle}>
                                        <BCHostImage style={{
                                            width: px2dp(39),
                                            height: px2dp(39),
                                            borderRadius: Platform.OS == 'ios' ? px2dp(19) : px2dp(50)
                                        }}
                                                     source={{uri: img}}/>
                                        <View style={Styles.contentStyle}>
                                            {this.renderName(name)}
                                            <BCText
                                                style={[gs.fts_12, gs.c_888, {marginTop: px2dp(5)}]}>记账周期 {cycle}</BCText>
                                        </View>
                                    </View>
                                    <View
                                        style={[Styles.btn1Style, (state == '已完成') ? gs.bgc_ccc : ((state == '已到期') ? {backgroundColor: '#fd0319'} : {backgroundColor: '#ff9130'})]}>
                                        <BCText style={[gs.c_fff, gs.fts_11]}>{state}</BCText>
                                    </View>
                                </View>
                                <View style={[Styles.moneyStyle, gs.bdc_e8e8e8]}>
                                    <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: px2dp(88)}}>
                                        <BCText style={[gs.fts_13, gs.c_888]}>总金额</BCText>
                                        <BCText style={[gs.fts_15, gs.c_3a3838]}>{toDecimal2(amount)}</BCText>
                                    </View>
                                    <View style={{width: px2dp(0.5), height: px2dp(30), backgroundColor: '#e8e8e8'}}></View>
                                    <View style={{alignItems: 'center', justifyContent: 'center', marginRight: px2dp(88)}}>
                                        <BCText style={[gs.fts_13, gs.c_888]}>未支付</BCText>
                                        <BCText style={[gs.fts_15, gs.c_3a3838]}>{toDecimal2(unPaid)}</BCText>
                                    </View>
                                </View>
                                <BCTouchable onPress={() => {
                                    this.push('SettlementList', {name, sCompanyId})
                                }} style={Styles.moreStyle}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <BCText style={[gs.fts_15, gs.c_00C164]}>查看更多</BCText>
                                    </View>
                                </BCTouchable>
                            </View>
                        )
                    }
                )
            )
        }
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_f2f1ef]}>
                {this.renderItem()}
            </View>
        )
    }

    onRefresh() {
        const {dispatch} = this.props;
        dispatch(ActionAccount());
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionAccount());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceAccount.datas != null && nextProps.ReduceAccount.datas != this.props.ReduceAccount.datas) {
            this.setState({
                IsReceived: true,
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        // height: deviceHeight,
    },
    accountStyle: {
        marginTop: px2dp(10)
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: px2dp(13),
        alignItems: 'center'
    },
    companyStyle: {
        flexDirection: 'row',
        marginLeft: px2dp(12)
    },
    contentStyle: {
        marginLeft: px2dp(10.5)
    },
    btn1Style: {
        paddingLeft: px2dp(7),
        paddingRight: px2dp(7),
        height: px2dp(20),
        borderRadius: px2dp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(12),
    },
    btn2Style: {
        width: px2dp(67),
        height: px2dp(20),
        borderRadius: px2dp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(12),
        backgroundColor: '#ff9130'
    },
    btn3Style: {
        width: px2dp(45),
        height: px2dp(20),
        borderRadius: px2dp(5),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(12),
        backgroundColor: '#ccc'
    },
    moneyStyle: {
        flexDirection: 'row',
        marginTop: px2dp(21.5),
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: px2dp(23.5),
        borderBottomWidth: 1
    },
    moreStyle: {
        height: px2dp(43),
        justifyContent: 'center'
    }
});

function mapStateToProps(store) {
    return {
        ReduceAccount: store.ReduceAccount
    }
}
const connectAccount = connect(mapStateToProps)(AccountPay);
connectAccount.navigationOptions = NavigationOptions;
export default connectAccount;
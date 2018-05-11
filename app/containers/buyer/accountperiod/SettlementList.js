/**
 * Created by Administrator on 2017/4/25.
 */
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, ListView,ScrollView} from 'react-native';
import {BCImage, BCTouchable, BCText, px2dp, deviceHeight, substr, NavigationOptions} from '../../../BaseComponent';
import {PullViewComponent} from '../../PageComponent';
import gs from '../../../styles/MainStyles'
import {ActionSettlementList} from '../../../actions/AccountAction';
import {connect} from 'react-redux';
import {toDecimal2} from "../../../utils/FormatUtil";

class SettlementList extends PullViewComponent {
    constructor(props) {
        super(props);
    }

    //设置页面标题
    setTitle() {
        let name = this.params.name;
        return name
    }

    renderBill() {
        let {ReduceSettlementList} = this.props;
        if (ReduceSettlementList.datas.length<=0) {
            return this.noRecord('暂无数据');
        }
        else{
            let datas = ReduceSettlementList.datas;
            return (
                datas.map((item, index) => {
                    let TearTitle = item.TearTitle;
                    let SCompany = item.SCompany;
                    let CycleStr = item.CycleStr;
                    let StateStr = item.StateStr;
                    let Amount = item.Amount;
                    let UnPaidAmount = item.UnPaidAmount;
                    let PurchaseOrderSettleId = item.PurchaseOrderSettleId;
                    return (
                        <View key={index} style={[Styles.billStyle]}>
                            <View style={[Styles.billTitle, gs.bgc_fff]}>
                                <View style={Styles.time}>
                                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{TearTitle}</BCText>
                                    <BCText style={[gs.fts_13, gs.c_888, {marginLeft: px2dp(10)}]}>({CycleStr})</BCText>
                                </View>
                                <BCText
                                    style={[gs.fts_13, (StateStr == '已完成') ? gs.c_888 : ((StateStr == '已到期') ? gs.c_fd0319 : gs.c_fa9032), {marginRight: px2dp(24)}]}>{StateStr}</BCText>
                            </View>
                            <View style={Styles.billContent}>
                                <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: px2dp(10.5)}}>
                                    <BCText style={[gs.fts_13, gs.c_888]}>总金额</BCText>
                                    <BCText style={[gs.fts_15, gs.c_3a3838]}>{toDecimal2(Amount)}</BCText>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <BCText style={[gs.fts_13, gs.c_888]}>未支付</BCText>
                                    <BCText style={[gs.fts_15, gs.c_3a3838]}>{toDecimal2(UnPaidAmount)}</BCText>
                                </View>
                                <BCTouchable onPress={() => {
                                    this.push('AccountDetail', {
                                        PurchaseOrderSettleId,
                                        UnPaidAmount
                                    })
                                }} style={Styles.btn}>
                                    <BCText style={[gs.fts_14, {color: '#2dcba0'}]}>查看详情</BCText>
                                </BCTouchable>
                            </View>
                        </View>
                    )
                })
            )
        }

    }

    content() {
        return (
            <View style={[gs.bgc_f2f1ef, Styles.main]}>
                {this.renderBill()}
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const SCompanyId = this.params.sCompanyId;
        dispatch(ActionSettlementList({SCompanyId: SCompanyId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSettlementList.datas != null && nextProps.ReduceSettlementList.datas != this.props.ReduceSettlementList.datas) {
            const {ReduceSettlementList} = nextProps;
            const SettlementList = ReduceSettlementList.datas;
            this.setState({
                IsReceived: true
            });
        }
    }

}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        marginBottom: '5%',
        minHeight:deviceHeight+1,
    },
    billStyle: {
        width: px2dp(351),
        height: px2dp(100),
        borderRadius: px2dp(10),
        borderColor: '#d7d7d7',
        borderWidth: px2dp(1),
        backgroundColor: '#f7f7f7',
        marginTop: px2dp(10)
    },
    billTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(35.5),
        width: px2dp(348),
        borderTopLeftRadius: px2dp(10),
        borderTopRightRadius: px2dp(10)
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(10.5)
    },
    billContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: px2dp(64)
    },
    btn: {
        width: px2dp(83),
        height: px2dp(30),
        borderWidth: px2dp(1),
        borderRadius: px2dp(15),
        borderColor: '#2dcba0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px2dp(10.5)
    }
});

function mapStateToProps(store) {
    return {
        ReduceSettlementList: store.ReduceSettlementList
    }
}
const connectSettlementList = connect(mapStateToProps)(SettlementList);
connectSettlementList.navigationOptions = NavigationOptions;
export default connectSettlementList;
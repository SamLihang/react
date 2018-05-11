/**
 * Created by Administrator on 2017/5/23. 账单结算列表
 */
import React from "react";
import {StyleSheet, View} from "react-native";
import {BCText, BCTouchable, NavigationOptions, px2dp,deviceHeight} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionOrderSettleList} from "../../../actions/ShopDetailAction";
import {toDecimal2} from "../../../utils/FormatUtil";
import {BCAccountNavigator} from "../../../components/BCNavigator";

class AccountList extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }
    //设置页面标题
    setTitle() {
        let name = this.params.name;
        return name
    }

    renderNavigator() {
        let data = this.state.dataSource;
        let CompanyName = this.params.name;
        return(
            <BCAccountNavigator navigation={this.props.navigation}
                                title={this.setTitle()}
                                backCallBack={this.onBack}
                                OnClick={(type) => {
                                    if(data.length>0){
                                        let BCompanyId = data[0].BCompanyId;
                                        this.push('ShopDetails', {BCompanyId, CompanyName})
                                    }
                                }}/>
        )
    }

    renderBill() {
        let {ReduceOrderSettleList} = this.props;
        if (ReduceOrderSettleList.datas.length<=0) {
            return this.noRecord("暂无数据");
        }else {
            let datas = ReduceOrderSettleList.datas;
            return (
                datas.map((item, index) => {
                    let TearTitle = item.TearTitle;
                    let BCompanyId = item.BCompanyId;
                    let CycleStr = item.CycleStr;
                    let StateStr = item.StateStr;
                    let Amount = item.Amount;
                    let UnPaidAmount = item.UnPaidAmount;
                    let SalesOrderSettleId = item.SalesOrderSettleId;
                    return (
                        <View key={index} style={[Styles.billStyle]}>
                            <View style={[Styles.billTitle, gs.bgc_fff]}>
                                <View style={Styles.time}>
                                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{TearTitle}</BCText>
                                    <BCText style={[gs.fts_13, gs.c_888, {marginLeft: px2dp(10)}]}>({CycleStr})</BCText>
                                </View>
                                <BCText
                                    style={[gs.fts_13, (StateStr == '已完成') ? gs.c_888 : {color: '#fa9032'}, {marginRight: px2dp(24)}]}>{StateStr}</BCText>
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
                                    this.push('SellerAccountDetail', {
                                        SalesOrderSettleId,
                                        TearTitle,
                                        BCompanyId,
                                        StateStr,
                                        CycleStr
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
        const bCompanyId = this.params.BCompanyId;
        dispatch(ActionOrderSettleList({bCompanyId: bCompanyId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceOrderSettleList.datas != null && nextProps.ReduceOrderSettleList.datas != this.props.ReduceOrderSettleList.datas) {
            const {ReduceOrderSettleList} = nextProps;
            let dataSource = ReduceOrderSettleList.datas;
            this.setState({
                IsReceived: true,
                dataSource:dataSource
            });
        }
    }

}

const Styles = StyleSheet.create({
    main: {
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
        ReduceOrderSettleList: store.ReduceOrderSettleList
    }
}
const connectAccountList = connect(mapStateToProps)(AccountList);
connectAccountList.navigationOptions = NavigationOptions;
export default connectAccountList;
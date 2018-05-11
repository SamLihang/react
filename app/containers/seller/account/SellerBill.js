/**
 * Created by Administrator on 2017/5/2.
 */
import React from "react";
import {StyleSheet, View, Platform} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent, PullListComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {formaTime, toDecimal2} from "../../../utils/FormatUtil";
import {getDateStr, Today} from "../../../utils/CommonFuns";
import {ActionSSBills} from "../../../actions/MyAction";
import {ActionBBills} from "../../../actions/AccountAction";

class SellerBill extends PullListComponent {
    constructor(props) {
        super(props);
        this.BillTime = '本月';
        let Today = new Date();

        this.Month = Today.getMonth() + 1 < 10 ? '0' + (Today.getMonth() + 1) : Today.getMonth() + 1;
        this.Year = Today.getFullYear();

        this.state = {
            dataSource: []
        };
    }

    //设置页面标题
    setTitle() {
        return "账单"
    }

    Top() {
        return (
            <View style={Styles.header}>
                <BCText style={[gs.fts_14, gs.c_3a3838]}>{this.BillTime}</BCText>
                <BCTouchable onPress={() => {
                    this.push('MonthPicker', {pageFrom: 'seller', callBack: this.setTime.bind(this)})
                }}>
                    <BCImage style={[{width: px2dp(15), height: px2dp(14)}]}
                             source={require('../../../imgs/date.png')}/>
                </BCTouchable>
            </View>
        )
    }

    setTime(year, month) {
        this.Year = year;
        this.Month = month;
        this.BillTime = year + '年' + month + '月';
    }

    renderRow(data) {
        const {dispatch} = this.props;
        let item = data.item;
        let key = data.index;
        let companyName = item.CompanyName;
        let amount = item.Amount;
        let createTime = item.CreateTime;
        let remark = item.Remark;
        let createTimeText = formaTime(item.CreateTime, 'yyyy-MM-dd');
        let billType = item.BillType;
        let direction = item.direction;
        let billId = item.BillId;
        let symbol = null;
        let PayType=item.PayType;
        if (direction > 0) {
            symbol = '+'
        }
        else {
            symbol = '-'
        }
        let content = item.content;
        let billTime = formaTime(createTime, 'MM-dd');
        if (createTimeText == Today()) {
            billTime = '今天';
        }
        else if (createTimeText == getDateStr(-1)) {
            billTime = '昨天';
        }

        let billTypeText = null;
        switch (billType) {
            case 1:
                billTypeText = '充值';
                break;
            case 3:
                billTypeText = '提现';
                break;
            case 5:
                billTypeText = '支付 — ' + companyName;
                break;
        }

        let payTypeText='';
        switch (PayType){
            case 1:
                payTypeText='货到付款';
                break;
            case 3:
                payTypeText='支付宝';
                break;
            case 4:
                payTypeText='余额';
                break;
            case 5:
                payTypeText='账期';
                break;
            default:
                payTypeText='余额';
                break;
        }
        return (
            <BCTouchable key={key}
                         style={[Styles.list, gs.bgc_fff]}
                         onPress={() => {
                             this.push('BillDetail', {
                                 amount: symbol + amount,
                                 partnerName: item.PartnerName,
                                 refBillId: item.refBillId,
                                 companyName,
                                 createTime,
                                 content,
                                 billId,
                                 payTypeText
                             })
                         }}>
                <View style={[Styles.listLeft]}>
                    <BCText style={[gs.fts_15, {color: '#C7C7C7'}]}>{billTime}</BCText>
                    <BCText style={[gs.fts_13, gs.c_b7b7b7]}>{formaTime(createTime, 'hh:mm')}</BCText>
                </View>
                <BCImage style={{marginLeft: px2dp(20)}}
                         source={require('../../../imgs/Bank-card-withdrawals.png')}/>
                <View style={[Styles.listCenter]}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: deviceWidth - px2dp(151)
                    }}>
                        <BCText
                            style={[gs.fts_16, gs.c_3a3838]}>{symbol}{toDecimal2(amount)}</BCText>
                        {/*<BCText style={[gs.fts_12, {marginRight: px2dp(26.5), color: '#FA7A2C'}]}>处理中</BCText>*/}
                    </View>
                    <BCText style={[gs.fts_13, gs.c_888]}>{content}</BCText>
                </View>
            </BCTouchable>
        )
    }

    keyExtractor(item, index) {
        return index
    }

    WillMount() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionBBills({p: this._page, date: this.Year + '-' + this.Month}));
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionSSBills({p: this._page, date: this.Year + '-' + this.Month}));
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionBBills({p: this._page, date: this.Year + '-' + this.Month}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceBBills.datas && nextProps.ReduceBBills.datas !== this.props.ReduceBBills.datas) {
            const {ReduceBBills} = nextProps;
            let datas = ReduceBBills.datas.data;
            let dataSource = this.state.dataSource;

            if (this._page > 1) {
                datas.map((list) => {
                    dataSource.push(list);
                });
            } else {
                dataSource = datas;
            }


            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45)) - px2dp(50)
            });
        }
    }
}

const Styles = StyleSheet.create({
    Main: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: px2dp(33),
        alignItems: 'center',
        paddingHorizontal: px2dp(20)
    },
    list: {
        flexDirection: 'row',
        height: px2dp(55),
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f1ef',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(16),
    },
    listLeft: {
        width: px2dp(50),
        height: px2dp(55),
        justifyContent: 'center',
        alignItems: 'center',
    },
    listCenter: {
        height: px2dp(55),
        justifyContent: 'center',
        marginLeft: px2dp(35)
    }
})

function mapStateToProps(store) {
    return {
        //ReduceSSBills: store.ReduceSSBills,
        ReduceBBills: store.ReduceBBills
    }
}

const connectPurchaseOrders1 = connect(mapStateToProps)(SellerBill);
connectPurchaseOrders1.navigationOptions = NavigationOptions;
export default connectPurchaseOrders1;
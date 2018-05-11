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
    px2dp,
    getFitPX
} from "../../../BaseComponent";
import {PullViewComponent, PullListComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {formaTime, toDecimal2} from "../../../utils/FormatUtil";
import {getDateStr, Today} from "../../../utils/CommonFuns";
import {ActionBBills} from "../../../actions/AccountAction";

class MyBill extends PullListComponent {

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
                    this.push('MonthPicker', {pageFrom: 'buyer', callBack: this.setTime.bind(this)})
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
        let amount = toDecimal2(item.Amount);
        let createTime = item.CreateTime;
        let remark = item.Remark;
        let createTimeText = formaTime(item.CreateTime, 'yyyy-MM-dd');
        let billType = item.BillType;
        let direction = item.direction;
        let billId = item.BillId;
        let PayType=item.PayType;
        let symbol = null;
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

        let payTypeText=null;
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
                <View>
                    <BCImage style={{width: px2dp(32), marginLeft: px2dp(10), height: px2dp(32)}}
                             source={require('../../../imgs/Bank-card-withdrawals.png')}/>
                </View>
                <View style={[Styles.listCenter]}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: deviceWidth - px2dp(151)
                    }}>
                        <BCText style={[gs.fts_16, gs.c_3a3838]}>{symbol}{amount}</BCText>
                        {/*<BCText style={[gs.fts_12, {marginRight: px2dp(26.5), color: '#FA7A2C'}]}>处理中</BCText>*/}
                    </View>
                    <BCText style={[gs.fts_13, gs.c_888]}>{content}</BCText>
                </View>
            </BCTouchable>
        )
    }

    /* renderList() {
         return (
             this.state.dataSource.map((item, index) => {
                 let bCompanyName = item.BCompanyName;
                 let amount = item.Amount;
                 let createTime = item.CreateTime;
                 let remark = item.Remark;
                 let createTimeText = formaTime(item.CreateTime, 'yyyy-MM-dd');
                 let billType = item.BillType;
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
                         billTypeText = '支付 — ' + item.SCompanyName;
                         break;
                 }

                 return (
                     <BCTouchable key={index}
                                  style={[Styles.list, gs.bgc_fff]}
                                  onPress={() => {
                                      if (billType == 5) {

                                      }
                                  }}>
                         <View style={[Styles.listLeft]}>
                             <BCText style={[gs.fts_15, {color: '#C7C7C7'}]}>{billTime}</BCText>
                             <BCText style={[gs.fts_13, gs.c_b7b7b7]}>{formaTime(createTime, 'hh:mm')}</BCText>
                         </View>
                         <BCImage style={{width: px2dp(32), marginLeft: px2dp(20), height: px2dp(32)}}
                                  source={require('../../../imgs/Bank-card-withdrawals.png')}/>
                         <View style={[Styles.listCenter]}>
                             <View style={{
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 justifyContent: 'space-between',
                                 width: deviceWidth - px2dp(151)
                             }}>
                                 <BCText style={[gs.fts_16, gs.c_3a3838]}>{billType == 1 ? '+' : '-'}{amount}</BCText>
                                 {/!*<BCText style={[gs.fts_12, {marginRight: px2dp(26.5), color: '#FA7A2C'}]}>处理中</BCText>*!/}
                             </View>
                             <BCText style={[gs.fts_13, gs.c_888]}>{remark ? remark : billTypeText}</BCText>
                         </View>
                     </BCTouchable>
                 )
             })
         )
     }*/

    /* content() {
         return (
             <View style={[Styles.Main, gs.bgc_f2f1ef]}>
                 <View style={Styles.header}>
                     <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(20)}]}>本月</BCText>
                     {/!*<BCTouchable onPress={() => {
                      this.push('WithdrawalsDetails')
                      }} style={{flexDirection: 'row', alignItems: 'center', marginRight: px2dp(16.6)}}>
                      <BCText style={[gs.fts_12, {marginRight: px2dp(5)}]}>查看月账单</BCText>
                      <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                      source={require('../../../imgs/right1.png')}></BCImage>
                      </BCTouchable>*!/}
                 </View>
                 {this.renderList()}
             </View>
         )
     }*/

    keyExtractor(item, index) {
        return index
    }

    WillMount() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionBBills({p: this._page}));
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionBBills({p: this._page, date: this.Year + '-' + this.Month}));
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionBBills({p: this._page, date: this.Year + '-' + this.Month}));
    }

    WillReceive(nextProps) {
        this.setState({
            IsReceived: true
        });
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
        ReduceBBills: store.ReduceBBills
    }
}

const connectPurchaseOrders1 = connect(mapStateToProps)(MyBill);
connectPurchaseOrders1.navigationOptions = NavigationOptions;
export default connectPurchaseOrders1;
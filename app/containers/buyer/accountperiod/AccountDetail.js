/**
 * Created by Administrator on 2017/4/25.
 */
import React from "react";
import {StyleSheet, View, Platform} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";

import {ActionAccountDetail} from "../../../actions/AccountAction";

import {connect} from "react-redux";
import CheckBox from "../../../components/CheckBox";
import {toDecimal2} from "../../../utils/FormatUtil";
import TextChange from "../../../components/TextChange";

class AccountDetail extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas: []
        };
    }

    //设置页面标题
    setTitle() {
        return "账期详情"
    }

    _CheckBoxAll = null;
    _CheckBoxList = [];
    _TextChange = null;
    PurchaseOrderIds = [];
    SalesOrderId=[];

    //绿色背景
    renderDay() {
        return (
            <View>
                <View style={{
                    width: px2dp(365),
                    height: px2dp(6),
                    backgroundColor: '#2dcba0',
                    borderRadius: px2dp(3),
                    marginLeft: px2dp(5)
                }}></View>
                <View style={[Styles.contentStyle, gs.bgc_fff]}>
                    {this.renderDetail()}
                </View>
            </View>
        )
    }

    //账期数据
    renderDetail() {
        let {ReduceAccountDetail} = this.props;
        if (ReduceAccountDetail.datas) {
            let datas = ReduceAccountDetail.datas;
            return (
                datas.map((item, index) => {
                    let PurchaseOrders = item.PurchaseOrders;
                    return (
                        PurchaseOrders.map((items, detailIndex) => {
                            let PurchaseOrderNo = items.PurchaseOrderNo;
                            let CreateTime = items.CreateTime;
                            let Amount = items.Amount;
                            let SettleStatusName = items.SettleStatusName;
                            let IsCompleted = items.IsCompleted;
                            let SalesOrderId=items.SalesOrderId;
                            let PurchaseOrderId = items.PurchaseOrderId;
                            let PurchaseOrderState = items.PurchaseOrderState;
                            const PurchaseOrderSettleId = this.params.PurchaseOrderSettleId;
                            return (
                                <View key={detailIndex} style={[Styles.orderStyle]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{height: px2dp(44), width: px2dp(46)}}>
                                            {
                                                // 最开始叫待付款现在叫账期进行中
                                                IsCompleted == false ?
                                                    <CheckBox
                                                        ref={(c) => {
                                                            if (c != null) {
                                                                this._CheckBoxList.push(c);
                                                            }
                                                        }}
                                                        Amount={Amount}
                                                        IsSelect={this.state.IsSelect}
                                                        checked={require('../../../imgs/onSelect.png')}
                                                        PurchaseOrderId={PurchaseOrderId}
                                                        OnChange={(isSelect) => {
                                                            let boxProducts = this._CheckBoxList;
                                                            if (boxProducts) {
                                                                let i = 0;
                                                                boxProducts.map((boxProduct) => {
                                                                    if (boxProduct.state.IsSelect) {
                                                                        i++;
                                                                    }
                                                                });
                                                                if (isSelect) {
                                                                    if (i + 1 > boxProducts.length) {
                                                                        this._CheckBoxAll.OnChange(isSelect, this, this.getTotal);
                                                                    }
                                                                    if (!this.PurchaseOrderIds.includes(PurchaseOrderId)) {
                                                                        this.PurchaseOrderIds.push(PurchaseOrderId);
                                                                        this.SalesOrderId.push(SalesOrderId);
                                                                    }
                                                                } else {
                                                                    if (i + 1 <= boxProducts.length) {
                                                                        this._CheckBoxAll.OnChange(isSelect, this, this.getTotal);
                                                                    }
                                                                    let index = this.PurchaseOrderIds.findIndex(PurchaseOrderId => PurchaseOrderId = PurchaseOrderId)
                                                                    this.PurchaseOrderIds.splice(index, 1)
                                                                    this.SalesOrderId.splice(index,1)
                                                                }
                                                                this.getTotal(this);
                                                            }

                                                        }}/> : null
                                            }
                                        </View>
                                        <View>
                                            <BCText style={[gs.fts_12, gs.c_3a3838]}>{CreateTime}</BCText>
                                            <BCText style={[gs.fts_12, gs.c_888]}>订单号 {PurchaseOrderNo}</BCText>
                                        </View>
                                        <BCText style={[gs.fts_13, gs.c_3a3838, {
                                            marginTop: px2dp(15),
                                            marginLeft: px2dp(29),
                                            width: px2dp(70)
                                        }]}>￥{toDecimal2(Amount)}</BCText>
                                    </View>
                                    <BCTouchable onPress={() => {
                                        this.push('PurchaseOrderDetail', {
                                            PurchaseOrderId,
                                            PurchaseOrderState,
                                            PurchaseOrderSettleId
                                        })
                                    }}
                                                 style={{
                                                     flexDirection: 'row',
                                                     marginRight: px2dp(10),
                                                     alignItems: 'center',
                                                 }}>
                                        <BCText
                                            style={[gs.fts_13, (IsCompleted == false) ? {color: '#fa9032'} : gs.c_888]}>{IsCompleted ? '已完成' : '进行中'}</BCText>
                                        <BCImage style={{width: px2dp(12), height: px2dp(12)}}
                                                 source={require('../../../imgs/right1.png')}/>
                                    </BCTouchable>
                                </View>
                            )
                        })
                    )
                })
            )

        }
    }

    getTotal(self) {
        let price = 0;
        this
        let boxList = self._CheckBoxList;
        boxList.map((list, index) => {
            if (list.state.IsSelect) {
                price += list.props.Amount
            }
        });
        self._TextChange.OnChange(price);
    }

    //不同的账期标题
    renderTitle() {
        let {ReduceAccountDetail} = this.props;
        if (ReduceAccountDetail.datas) {
            let datas = ReduceAccountDetail.datas;
            return (
                datas.map((TitleItem, TitleIndex) => {
                    let StateStr = TitleItem.StateStr;
                    return (<BCText key={TitleIndex} style={[gs.fts_14, {color: '#fa9032'}]}>{StateStr}</BCText>)
                })
            )
        }
    }

    content() {
        let {ReduceAccountDetail} = this.props;
        if (ReduceAccountDetail.datas.length <= 0) {
            return this.noRecord("暂无数据");
        }
        else {
            let datas = this.state.datas;
            return (
                datas.map((item, index) => {
                    let LogoImage = item.LogoImage;
                    let SCompany = item.SCompany;
                    let CycleStr = item.CycleStr;
                    return (
                        <View key={index} style={[Styles.main, gs.bgc_f2f1ef]}>
                            <View style={Styles.companyStyle}>
                                <View style={Styles.rowStyle}>
                                    <BCHostImage style={{
                                        width: px2dp(39),
                                        height: px2dp(39),
                                        borderRadius: Platform.OS == 'ios' ? px2dp(19) : px2dp(50)
                                    }}
                                                 source={{uri: LogoImage}}/>
                                    <View style={Styles.companyTitle}>
                                        <BCText style={[gs.fts_16, gs.c_3a3838]}>{SCompany}</BCText>
                                        <BCText style={[gs.fts_12, gs.c_888]}>{CycleStr}</BCText>
                                    </View>
                                </View>
                                <View style={{marginRight: px2dp(23)}}>{this.renderTitle()}</View>
                            </View>
                            {this.renderDay()}
                        </View>
                    );
                })
            )
        }

    }

    onRefresh() {
        const {dispatch} = this.props;
        const PurchaseOrderSettleId = this.params.PurchaseOrderSettleId;
        dispatch(ActionAccountDetail({PurchaseOrderSettleId: PurchaseOrderSettleId}));
    }

    refeshView() {
        this._CheckBoxList = [];
        this.PurchaseOrderIds = [];
        this.SalesOrderId=[];
        this.onRefresh()
    }

    Bottom() {
        if (this.params.UnPaidAmount>0) {
            return (
                this.renderBottom()
            )
        }
        else {
            return false
        }
    }

    renderBottom() {
        const {dispatch, ReduceAccountDetail} = this.props;
        const PurchaseOrderSettleId = this.params.PurchaseOrderSettleId;
        let datas = ReduceAccountDetail.datas;
        return (
            <View style={Styles.footerWrap}>
                <View style={Styles.footer}>
                    <View style={[Styles.money]}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: px2dp(19.5)
                        }}>
                            <CheckBox
                                checked={require('../../../imgs/onSelect.png')}
                                ref={(c) => {
                                    this._CheckBoxAll = c
                                }}
                                OnChange={(isSelect) => {
                                    let boxBoxList = this._CheckBoxList;
                                    boxBoxList.map((data, index) => {
                                        data.OnChange(isSelect, this, this.getTotal);
                                    });
                                    this._CheckBoxList.map((item, index) => {
                                        let PurchaseOrderId = item.props.PurchaseOrderId
                                        let SalesOrderId=item.props.SalesOrderId
                                        if (!this.PurchaseOrderIds.includes(PurchaseOrderId)) {
                                            this.PurchaseOrderIds.push(PurchaseOrderId);
                                            this.SalesOrderId.push(SalesOrderId);
                                        }
                                    })

                                }}/>
                            <BCText style={[gs.fts_14, {color: '#f2f1ef', marginLeft: px2dp(10)}]}>全选</BCText>
                        </View>

                        <TextChange ref={(c) => {
                            this._TextChange = c
                        }} style={[gs.fts_16, {color: '#f2f1ef', marginLeft: px2dp(13)}]} Text="0.00"/>
                    </View>
                    <BCTouchable onPress={() => {
                        let price = parseFloat(this._TextChange.state.Text);

                        this.push('AccountPayable', {
                            price,
                            PurchaseOrderSettleId,
                            PurchaseOrderIds: this.PurchaseOrderIds,
                            SalesOrderId:this.SalesOrderId,
                            callback: this.refeshView.bind(this)
                        })

                    }} style={[{backgroundColor:'#31ca96'}, Styles.pay]}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>去结算</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const PurchaseOrderSettleId = this.params.PurchaseOrderSettleId;
        dispatch(ActionAccountDetail({PurchaseOrderSettleId: PurchaseOrderSettleId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceAccountDetail.datas != null && nextProps.ReduceAccountDetail.datas != this.props.ReduceAccountDetail.datas) {
            const {ReduceAccountDetail} = nextProps;
            const SettlementList = ReduceAccountDetail.datas;
            this._CheckBoxList = [];
            this.setState({
                datas: SettlementList,
                IsReceived: true,
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        minHeight: deviceHeight
    },
    companyStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: px2dp(13),
        paddingBottom: px2dp(10)
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(17)
    },
    companyTitle: {
        marginLeft: px2dp(10),
        justifyContent: 'center'
    },
    contentStyle: {
        width: px2dp(355),
        borderWidth: px2dp(0.5),
        borderColor: '#d7d7d7',
        marginLeft: px2dp(10)
    },
    orderStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: px2dp(10),
        paddingBottom: px2dp(10),
        justifyContent: 'space-around'
    },
    footerWrap: {
        width: '100%',
        height: px2dp(46),
        justifyContent: 'flex-end'
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'space-between',
        backgroundColor: '#202020',
        opacity: 0.9
    },
    money: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

function mapStateToProps(store) {
    return {
        ReduceAccountDetail: store.ReduceAccountDetail
    }
}

const connectAccountDetail = connect(mapStateToProps)(AccountDetail);
connectAccountDetail.navigationOptions = NavigationOptions;
export default connectAccountDetail;
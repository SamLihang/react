/**
 * Created by Administrator on 2017/7/27.
 */
import React, {Component} from "react";
import {InteractionManager, Platform, StyleSheet, TextInput, View, Linking} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {toastShort, confirm} from '../../../utils/ToastUtil';
import {ActionAgreeToRefund, ActionRefusedToRefund} from '../../../actions/SellerSalesOrderAction';
import {connect} from "react-redux";
import {toDecimal2, formaTime} from "../../../utils/FormatUtil";
import {showCountDown} from '../../../utils/CommonFuns';
import {ActionGetServiceorderdetail} from '../../../actions/PurchaseOrderAction'
import {fetchAgreeToRefund, fetchRefusedToRefund} from '../../../services/SellerOrderServices'

class CountDownBOtton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leftTime: null
        }
        this.timer = null;
    }

    stopTimer() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let endCheckTime = this.props.EndTime;
        let self = this;
        this.timer && clearTimeout(this.timer);
        self.timer = setInterval(function () {
            self.setState({
                leftTime: showCountDown(endCheckTime)
            })
        }, 1000)

        return (
            <BCText style={[gs.c_fff, gs.fts_13, {marginLeft: px2dp(20)}]}>
                还剩：{this.state.leftTime}
            </BCText>
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
}

class SellerServiceDetail extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "售后详情"
    }

    rightType() {
        return 'Telephone2'
    }

    onClickNavigationRight() {
        Linking.canOpenURL('tel:400-680-5217').then(supported => {
            if (supported) {
                Linking.openURL('tel:400-680-5217');
            } else {
                toastShort('无法打开该URI: ' + 'tel:400-680-5217');
            }
        })
    }

    RightType() {
        return true
    }

    //返回回调
    onBack() {
        if (this.params && this.params.callBack) {
            this.params.callBack()
        }
    }

    onRefresh() {
        const {dispatch} = this.props;
        const {serviceOrderId} = this.params;
        dispatch(ActionGetServiceorderdetail({ServiceOrderId: serviceOrderId}));
    }

    //处理中
    InProcess(serviceorder) {
        let amount = serviceorder.Amount;
        let leftWord = serviceorder.LeftWord;
        let endCheckTime = serviceorder.EndCheckTime;

        return (
            <View style={Styles.topStyle}>
                <View style={[Styles.stateStyle]}>
                    <BCText style={[gs.c_fff, gs.fts_15, {marginLeft: px2dp(20)}]}>
                        售后申请中…
                    </BCText>
                    <CountDownBOtton
                        ref={(c) => {
                            this._CountDownBOtton = c;
                        }}
                        EndTime={endCheckTime}/>
                </View>
                <View style={[Styles.causeStyle, gs.bgc_fff]}>
                    <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(20), paddingTop: px2dp(15)}]}>
                        售后申请已提交，请耐心等待商家处理。
                    </BCText>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(10)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款金额:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            {amount}元
                        </BCText>
                    </View>
                    <View style={Styles.refundsViewStyle}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款原因:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, Styles.refundsCauseStyle]}>
                            {leftWord}
                        </BCText>
                    </View>
                </View>
            </View>
        )
    }

    //退款成功
    SuccessfulRefund(serviceorder) {
        let checkTime = serviceorder.CheckTime;
        let amount = serviceorder.Amount;
        let leftWord = serviceorder.LeftWord;
        return (
            <View style={Styles.topStyle}>
                <View style={[Styles.stateStyle2]}>
                    <BCText style={[gs.c_fff, gs.fts_15, {marginLeft: px2dp(20)}]}>
                        商家已同意，退款已成功。
                    </BCText>
                    <BCText style={[gs.c_fff, gs.fts_13, {marginLeft: px2dp(20)}]}>
                        {formaTime(checkTime, 'yyyy年MM月dd日 hh:mm')}
                    </BCText>
                </View>
                <View style={[Styles.causeStyle, gs.bgc_fff]}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(15)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款金额:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            {amount}元
                        </BCText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(10)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款方式:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            退回余额
                        </BCText>
                    </View>
                    <View style={Styles.refundsViewStyle}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款原因:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, Styles.refundsCauseStyle]}>
                            {leftWord}
                        </BCText>
                    </View>
                </View>
            </View>
        )
    }

    //关闭
    Close(serviceorder) {
        let amount = serviceorder.Amount;
        let leftWord = serviceorder.LeftWord;
        return (
            <View style={Styles.topStyle}>
                <View style={[Styles.stateStyle3]}>
                    <BCText style={[gs.c_fff, gs.fts_15, {marginLeft: px2dp(20)}]}>
                        商家已拒绝 ，退款已关闭。
                    </BCText>
                    <BCText style={[gs.c_fff, gs.fts_13, {marginLeft: px2dp(20)}]}>
                        {/*拒绝原因：已与买家协商好，数量无问题。*/}
                    </BCText>
                </View>
                <View style={[Styles.causeStyle, gs.bgc_fff]}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(15)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款金额:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            {amount}元
                        </BCText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: px2dp(20),
                        paddingTop: px2dp(10)
                    }}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款方式:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                            退回余额
                        </BCText>
                    </View>
                    <View style={Styles.refundsViewStyle}>
                        <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                            退款原因:
                        </BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_14, Styles.refundsCauseStyle]}>
                            {leftWord}
                        </BCText>
                    </View>
                </View>
            </View>
        )
    }

    //商品
    renderProduct(serviceorderlines) {
        return (
            <View style={Styles.product}>
                {
                    serviceorderlines.map((line, index) => {
                        let productName = line.ProductName;
                        let amount = line.Amount;
                        let price = line.Price;
                        let unit = line.Unit;
                        let spec = line.Spec;
                        let displayUnit = line.DisplayUnit;
                        let quantity = line.ActualQuantity;
                        let img = line.img;

                        return (
                            <View style={[Styles.listStyle]} key={index}>
                                <BCHostImage style={{width: px2dp(41), height: px2dp(41)}}
                                             source={{uri: img}}/>
                                <View style={Styles.titleStyle}>
                                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(productName, 10)}</BCText>
                                    <View style={Styles.priceStyle}>
                                        <BCText style={[gs.c_3a3838, gs.fts_13, {width: px2dp(100)}]}>{spec}</BCText>
                                        <BCText
                                            style={[gs.c_3a3838, gs.fts_13, {width: px2dp(100)}]}>￥{toDecimal2(price)}/袋</BCText>
                                        <BCText style={[gs.c_3a3838, gs.fts_13]}>X 1</BCText>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    content() {
        const {ReduceGetServiceorderdetail} = this.props;
        let data = ReduceGetServiceorderdetail.datas;
        let serviceorder = data.Serviceorder;
        let serviceOrderNo = serviceorder.ServiceOrderNo;
        //审核状态  0=进行中 1=通过 2=驳回
        let checkState = serviceorder.CheckState;
        let renderHeader = null;
        switch (checkState) {
            case 0:
                renderHeader = this.InProcess;
                break;
            case 1:
                renderHeader = this.SuccessfulRefund;
                break;
            case 2:
                renderHeader = this.Close;
        }

        return (
            <View style={[Styles.mainStyle, gs.bgc_f2f1ef]}>
                {renderHeader(serviceorder)}
                <View style={[Styles.productList, gs.bgc_fff]}>
                    <BCText style={[gs.fts_14, gs.c_b7b7b7, {paddingVertical: px2dp(5), marginLeft: px2dp(20)}]}>
                        退款编号：{serviceOrderNo}
                    </BCText>
                    {this.renderProduct(data.Serviceorderlines)}
                </View>
            </View>
        )
    }

    Bottom() {
        const {ReduceGetServiceorderdetail} = this.props;
        let data = ReduceGetServiceorderdetail.datas;
        let serviceorder = data.Serviceorder;
        //审核状态  0=进行中 1=通过 2=驳回
        let checkState = serviceorder.CheckState;

        return (
            checkState ? null :
                <View style={Styles.footerWrap}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <BCTouchable style={Styles.agreeBtn} onPress={() => {
                            confirm('同意售后?', this.onAgreeConfirm.bind(this), this.onCancle)
                        }}>
                            <BCText style={[gs.fts_16, gs.c_fff]}>同意</BCText>
                        </BCTouchable>
                        <BCTouchable style={Styles.refuseBtn} onPress={() => {
                            confirm('拒绝售后?', this.onRefusedConfirm.bind(this), this.onCancle)
                        }}>
                            <BCText style={[gs.fts_16, gs.c_fff]}>拒绝</BCText>
                        </BCTouchable>
                    </View>
                </View>
        )
    }

    onAgreeConfirm() {
        const {serviceOrderId} = this.params;
        const {ReduceGetServiceorderdetail} = this.props;
        let data = ReduceGetServiceorderdetail.datas;
        let serviceorder = data.Serviceorder;
        let amount = serviceorder.Amount;
        //serviceOrderIds, allAmounts
        this.push('ServicePayable', {
            title: '售后结算',
            serviceOrderIds: [serviceOrderId],
            allAmounts: amount,
            callBack: this.onRefresh.bind(this)
        });
    }

    onRefusedConfirm() {
        const {serviceOrderId} = this.params;
        fetchRefusedToRefund([serviceOrderId]).then((ret) => {
            if (ret.data.success == 0) {
                toastShort("拒绝退款成功")
            }
            else {
                toastShort("拒绝失败,请刷新重试")
            }
            this.onRefresh();
        }).catch((e) => {

        });
    }

    onCancle() {

    }

    WillMount() {
        const {dispatch} = this.props;
        const {serviceOrderId} = this.params;
        dispatch(ActionGetServiceorderdetail({ServiceOrderId: serviceOrderId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceGetServiceorderdetail.datas != null && nextProps.ReduceGetServiceorderdetail.datas != this.props.ReduceGetServiceorderdetail.datas) {
            this.setState({
                IsReceived: true,
                //dataSource: dataSource,
            });
        }
    }

    WillUnMount() {
        //this._CountDownBOtton.stopTimer();
    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        flex: 1,
        minHeight: deviceHeight
    },
    topStyle: {
        paddingVertical: px2dp(8),
        paddingHorizontal: px2dp(8)
    },
    stateStyle: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(69),
        backgroundColor: '#2dcba0',
        justifyContent: 'center'
    },
    stateStyle2: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(69),
        backgroundColor: '#fd827c',
        justifyContent: 'center'
    },
    stateStyle3: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(69),
        backgroundColor: '#c8c8c8',
        justifyContent: 'center'
    },
    /*退款原因*/
    causeStyle: {
        width: px2dp(347),
        flex : 1,
        borderBottomLeftRadius: px2dp(4),
        borderBottomRightRadius: px2dp(4),
    },
    refundsViewStyle : {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(20),
        paddingTop: px2dp(5),
        width: '73%',
        flex :1
    },
    refundsCauseStyle :{
        marginLeft: px2dp(5),
        fontSize:px2dp(12),
        paddingBottom:px2dp(5)
    },

    productList: {
        width: px2dp(347),
        minHeight: px2dp(100),
        borderRadius: px2dp(4),
        paddingVertical: px2dp(8),
        marginLeft: px2dp(8)
    },
    product: {
        paddingBottom: px2dp(15),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        //backgroundColor: 'red'
    },
    listStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(41),
        paddingLeft: px2dp(20),
        marginTop: px2dp(15)
    },
    listBoxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(41),
        marginTop: px2dp(15)
    },
    titleStyle: {
        marginLeft: px2dp(14)
    },
    priceStyle: {
        flexDirection: 'row',
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(45),
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    agreeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2dcba0',
        width: px2dp(95),
        height: px2dp(45)
    },
    refuseBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fd0319',
        width: px2dp(95),
        height: px2dp(45)
    }
});

function mapStateToProps(store) {
    return {
        ReduceGetServiceorderdetail: store.ReduceGetServiceorderdetail
    }
}

const connectAuthenticate = connect(mapStateToProps)(SellerServiceDetail);
connectAuthenticate.navigationOptions = NavigationOptions;
export default connectAuthenticate;
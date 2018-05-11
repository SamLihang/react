/**
 * Created by Administrator on 2017/7/26.
 */
import React, {Component} from "react";
import {InteractionManager, Platform, StyleSheet, TextInput, View} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    px2dpH,
    getFitPX,
    substr
} from "../../../BaseComponent";
import {PullViewComponent,PullListComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {BCHServiceNavigator} from "../../../components/BCNavigator";
import CheckBox from "../../../components/CheckBox";
import {connect} from "react-redux";
import {ActionHistoryService} from "../../../actions/ServiceAction"

class HistoricalService extends PullListComponent {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            dataSource: []
        }
    }

    //设置页面标题
    setTitle() {
        return "历史售后"
    }

    /* onClickNavigationRight() {
         this.push('ServiceManagement')
     }*/

    refeshView(msg) {
        const {dispatch} = this.props;
        dispatch(ActionHistoryService());
    }

    //处理中
    renderRow(data) {
        const {dispatch} = this.props;
        let item = data.item;
        let key = data.index;
        let serviceOrderNo = item.ServiceOrderNo;
        let purchaseOrderNo = item.PurchaseOrderNo;
        let bCompanyName = item.BCompanyName;
        let sCompanyName = item.SCompanyName;
        let amount = item.Amount;
        let bLogoImage=item.BLogoImage;
        let sLogoImage = item.SLogoImage;
        let serviceOrderId = item.ServiceOrderId;
        let statusData = null;
        switch (item.CheckState) {
            case 0:
                statusData = '进行中';
                break;
            case 1:
                statusData = '退款通过';
                break;
            case 2:
                statusData = '退款关闭';
        }
        return (
            <BCTouchable key={key}  style={[Styles.topStyle, gs.bgc_fff]}>
                <View>
                    <View style={[Styles.stateStyle, gs.bgc_fff]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <BCText style={[gs.fts_14, gs.c_b7b7b7]}>订单编号:</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                                {purchaseOrderNo}
                            </BCText>
                        </View>
                        <BCText style={{marginRight: px2dp(14)}}>
                            <BCText style={[gs.fts_14, {color: '#fd827c'}]}>{statusData}</BCText>
                        </BCText>
                    </View>
                    <View style={[Styles.causeStyle, gs.bgc_fff]}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: px2dp(13),
                            marginLeft: px2dp(14)
                        }}>
                            <BCHostImage style={{width: px2dp(29), height: px2dp(29)}}
                                         source={{uri:bLogoImage}}/>
                            <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(7)}]}>
                                {bCompanyName}
                            </BCText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: px2dp(50),
                            paddingTop: px2dp(10)
                        }}>
                            <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                                退款金额:
                            </BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                                {amount}
                            </BCText>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: px2dp(50),
                            paddingTop: px2dp(10),
                            justifyContent: 'space-between'
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <BCText style={[gs.c_b7b7b7, gs.fts_14]}>
                                    售后编号:
                                </BCText>
                                <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                                    {serviceOrderNo}
                                </BCText>
                            </View>
                            <BCTouchable  onPress={() => {
                                this.push('SellerServiceDetail', {serviceOrderId})
                            }} style={{flexDirection: 'row', alignItems: 'center', marginRight: px2dp(16)}}>
                                <BCText style={[gs.c_b7b7b7, gs.fts_13, {marginRight: px2dp(3)}]}>
                                    详情
                                </BCText>
                                <BCImage source={require('../../../imgs/right1.png')}/>
                            </BCTouchable>
                        </View>
                    </View>
                </View>
            </BCTouchable>
        )
    }

    keyExtractor(item, index) {
        return index
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionHistoryService(this._page));
    }
    WillMount() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionHistoryService(this._page));
    }
    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionHistoryService(this._page));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceHistoryServiceManage.datas && nextProps.ReduceHistoryServiceManage.datas !== this.props.ReduceHistoryServiceManage.datas) {
            const {ReduceHistoryServiceManage} = nextProps;
            let datas = ReduceHistoryServiceManage.datas;
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
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(30) : px2dpH(70))
            });
        }
    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        flex: 1,
        minHeight: deviceHeight
    },
    topStyle: {
        paddingVertical: px2dp(14),
        paddingHorizontal: px2dp(14)
    },
    stateStyle: {
        borderTopLeftRadius: px2dp(4),
        borderTopRightRadius: px2dp(4),
        width: px2dp(347),
        height: px2dp(41),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    causeStyle: {
        width: px2dp(347),
        height: px2dp(115),
        borderBottomLeftRadius: px2dp(4),
        borderBottomRightRadius: px2dp(4),
        marginTop: px2dp(1),
    },
});

function mapStateToProps(store) {
    return {
        ReduceHistoryServiceManage: store.ReduceHistoryServiceManage
    }
}

const ReduceHistoricalService = connect(mapStateToProps)(HistoricalService);
ReduceHistoricalService.navigationOptions = NavigationOptions;
export default ReduceHistoricalService;
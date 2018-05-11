/**
 * Created by Administrator on 2017/4/24.
 */
import React from "react";
import {StyleSheet, TextInput, View, Platform} from "react-native";
import {BCText, BCTouchable, deviceHeight, deviceWidth, NavigationOptions, px2dp} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import ProgressBars from './ProgressBars'
import {toastShort} from "../../../utils/ToastUtil";
import {ActionSetReplenish, ActionDelivery} from "../../../actions/MyAction";
import {fetchSetReplenish} from '../../../services/MyServices';


var barWidth = px2dp(256);
const CIRCLE_SIZE = px2dp(30);

class FareScale extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "补货加价比"
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    _ProgressBar = null;

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff]}>
                <View style={[Styles.TopView]}>
                    <View style={[Styles.groupView]}>
                        <BCText style={[gs.fts_16, gs.c_3a3838, {marginLeft: px2dp(15)}]}>设置比例:</BCText>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: px2dp(10),
                        height: px2dp(40),
                        justifyContent: 'space-around'
                    }}>
                        <BCText style={[gs.fts_15, gs.c_00C164]}>100%</BCText>
                        <View>
                            <ProgressBars
                                ref={(c) => {
                                    if (c != null) {
                                        this._ProgressBar = (c);
                                    }
                                }}
                            />

                        </View>
                        <BCText style={[gs.fts_15, gs.c_00C164]}>200%</BCText>
                    </View>
                    <View style={[Styles.showView]}>
                        <BCText style={[gs.fts_16, gs.c_3a3838,{marginLeft:px2dp(15)}]}>补货加价比:</BCText>
                        <BCText style={[gs.fts_16, gs.c_00C164]}>{this.ReplenishAddRate}</BCText>
                        <BCText style={[gs.fts_16, gs.c_00C164]}>%</BCText>
                    </View>
                </View>
            </View>
        )
    }

    Bottom() {
        return (
            this.renderBottom()
        )
    }

    onSave() {
        let CompanyId = this.props.currentEmployee.CompanyId;
        const {dispatch} = this.props;
        var leftW = this._ProgressBar.state.style.left;
        if (leftW === 0) {
            var ReplenishAddRate = 100;
        } else {
            var ReplenishAddRate = parseInt(((leftW) / (barWidth - CIRCLE_SIZE - px2dp(36)) * 100) + 100);
        }
        if (ReplenishAddRate == '') {
            toastShort('请设置')
            return false;
        } else {

           /* dispatch(ActionSetReplenish({
                companyId: CompanyId,   //公司ID
                ReplenishStartPrice: this.ReplenishStartPrice,  //补货起送价
                ReplenishDeliveryAmount: this.ReplenishDeliveryAmount,  //补货配送费
                ReplenishStartQuantity: this.ReplenishStartQuantity,  //补货起送量
                ReplenishDistance: this.ReplenishDistance,  //补货配送范围
                ReplenishAddRate: ReplenishAddRate  //补货加价比
            }));*/

            fetchSetReplenish({
                companyId: CompanyId,   //公司ID
                ReplenishStartPrice: this.ReplenishStartPrice,  //补货起送价
                ReplenishDeliveryAmount: this.ReplenishDeliveryAmount,  //补货配送费
                ReplenishStartQuantity: this.ReplenishStartQuantity,  //补货起送量
                ReplenishDistance: this.ReplenishDistance,  //补货配送范围
                ReplenishAddRate:ReplenishAddRate  //补货加价比
            }).then((ret) => {
                if (ret.error) {
                }
                else {
                    toastShort('设置成功');
                    this.pop();
                }
            }).catch((e) => {

            });

            const {navigation} = this.props;
            if (navigator) {
                navigation.goBack();
            }
        }
    }

    renderBottom() {
        return (
            <View style={Styles.footerWrap}>
                <BCTouchable onPress={() =>
                    this.onSave()
                } style={[Styles.confirmBtn, gs.bgc_00c164]}>
                    <BCText style={[gs.fts_15, gs.c_fff]}>保存</BCText>
                </BCTouchable>
            </View>
        )
    }

    WillMount() {
        this.setState({
            IsReceived: true,
        });
        let companyId = this.props.currentEmployee.CompanyId;
        const {dispatch} = this.props;
        dispatch(ActionDelivery(companyId));
        this.GlobalData = {};
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceDelivery.datas && nextProps.ReduceDelivery.datas !== this.props.ReduceDelivery.datas) {
            const {ReduceDelivery} = nextProps;
            let datas = ReduceDelivery.datas;

            this.ReplenishStartPrice = datas.ReplenishStartPrice; //补货起送价
            this.ReplenishDeliveryAmount = datas.ReplenishDeliveryAmount; // 补货配送费
            this.ReplenishStartQuantity = datas.ReplenishStartQuantity;  //补货起送量
            this.ReplenishDistance = datas.ReplenishDistance;  //补货配送范围
            this.ReplenishAddRate = datas.ReplenishAddRate;  //补货加价比

            this.setState({
                IsReceived: true,
            });
        }
    }

}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight
    },
    TopView: {
        marginTop: px2dp(10),
        height: px2dp(195),
        width: "100%",
    },
    groupView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
        height: px2dp(48),
        borderBottomWidth: 0.5,
        borderBottomColor: '#f2f1ef',
    },
     showView: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
        height: px2dp(48),
    },
    input: {
        marginLeft: px2dp(10),
        width: px2dp(deviceWidth / 2),

    },
    edit: {
        width: px2dp(265),
        height: px2dp(45),
        justifyContent: 'center',
        alignItems: 'center',
        padding: px2dp(10),
        borderRadius: px2dp(8),
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(61),
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmBtn: {
        width: px2dp(355),
        height: px2dp(45),
        borderRadius: px2dp(4),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2ad191'
    },
});

function mapStateToProps(store) {
    return {
        ReduceSetReplenish: store.ReduceSetReplenish,
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceDelivery: store.ReduceDelivery,
    }
}

const connectFareScale = connect(mapStateToProps)(FareScale);
connectFareScale.navigationOptions = NavigationOptions;
export default connectFareScale;
/**
 * Created by Administrator on 2017/4/24.
 */
import React from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {BCText, BCTouchable, deviceHeight, deviceWidth, NavigationOptions, px2dp} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from "../../../components/CheckBox";
import {connect} from "react-redux";
import {toastShort} from "../../../utils/ToastUtil";
import {ActionSetReplenish, ActionDelivery} from "../../../actions/MyAction";
import {fetchSetReplenish} from '../../../services/MyServices';

class ReplenishFee extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "补货运费"
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowBottom: false
        };
        this.ReplenishStartPrice = 0; //补货起送价
        this.ReplenishDeliveryAmount = 0; // 补货配送费
        this.ReplenishStartQuantity = 0;  //补货起送量
        this.ReplenishDistance = 0;  //补货配送范围
        this.ReplenishAddRate = 0;  //补货加价比
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff,]}>
                <View style={Styles.deliveryFee}>
                    <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(20)}]}>起送量:</BCText>
                    <View style={Styles.startingLoad}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput style={Styles.amount2}
                                       placeholder={'' + this.ReplenishStartQuantity}
                                       keyboardType='numeric'
                                       placeholderTextColor='#3a3838'
                                       underlineColorAndroid='transparent'
                                       onChangeText={(text) => {
                                           if (isNaN(text * 1)) {
                                               toastShort('请输入正确的数字');
                                               this.ErrorText = true;
                                               return false;
                                           } else {
                                               this.ReplenishStartQuantity = text * 1;
                                               this.ErrorText = false;
                                               this.setState({isShowBottom: true});
                                           }
                                       }}
                            />
                        </View>
                    </View>
                </View>
                <View style={Styles.deliveryFee}>
                    <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(20)}]}>起送价:</BCText>
                    <View style={Styles.startingLoad}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput style={Styles.amount3}
                                       placeholder={'' + (this.ReplenishStartPrice==null?0:this.ReplenishStartPrice)}
                                       placeholderTextColor='#3a3838'
                                       keyboardType='numeric'
                                       underlineColorAndroid='transparent'
                                       onChangeText={(text) => {
                                           if (isNaN(text * 1)) {
                                               toastShort('请输入正确的数字');
                                               this.ErrorText = true;
                                               return false;
                                           } else {
                                               this.setState({isShowBottom: true});
                                               this.ReplenishStartPrice = text * 1;
                                               this.ErrorText = false;
                                           }
                                       }}/>
                            <View style={Styles.textBackground}>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>元</BCText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={Styles.deliveryFee}>
                    <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(35)}]}>运费:</BCText>
                    <View style={Styles.startingLoad}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput style={Styles.amount3}
                                       placeholder={'' + this.ReplenishDeliveryAmount}
                                       placeholderTextColor='#3a3838'
                                       keyboardType='numeric'
                                       underlineColorAndroid='transparent'
                                       onChangeText={(text) => {
                                           if (isNaN(text * 1)) {
                                               toastShort('请输入正确的数字');
                                               this.ErrorText = true;
                                               return false;
                                           } else {
                                               this.setState({isShowBottom: true});
                                               this.ReplenishDeliveryAmount = text * 1;
                                               this.ErrorText = false;
                                           }
                                       }}
                            />
                            <View style={Styles.textBackground}>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>元</BCText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={Styles.deliveryFee2}>
                    <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(5)}]}>补货范围:</BCText>
                    <View style={Styles.startingLoad}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput style={Styles.amount3}
                                       placeholder={'' + this.ReplenishDistance}
                                       placeholderTextColor='#3a3838'
                                       keyboardType='numeric'
                                       underlineColorAndroid='transparent'
                                       onChangeText={(text) => {
                                           if (isNaN(text * 1)) {
                                               toastShort('请输入正确的数字');
                                               this.ErrorText = true;
                                               return false;
                                           } else {
                                               this.setState({isShowBottom: true});
                                               this.ReplenishDistance = text * 1;
                                               this.ErrorText = false;
                                           }
                                       }}
                            />
                            <View style={Styles.textBackground}>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>公里</BCText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    Bottom() {
        return (
            this.state.isShowBottom ? this.renderBottom() : null
        )
    }

    onSave() {
        let CompanyId = this.props.currentEmployee.CompanyId;
        const {dispatch} = this.props;

        if (this.ReplenishDistance == null || this.ReplenishDistance == '') {

            toastShort('请设置补货范围')

        } else if (this.ReplenishStartPrice || this.ReplenishDeliveryAmount || this.ReplenishStartQuantity || this.ReplenishDistance || this.ReplenishAddRate) {
            fetchSetReplenish({
                companyId: CompanyId,   //公司ID
                ReplenishStartPrice: this.ReplenishStartPrice,  //补货起送价
                ReplenishDeliveryAmount: this.ReplenishDeliveryAmount,  //补货配送费
                ReplenishStartQuantity: this.ReplenishStartQuantity,  //补货起送量
                ReplenishDistance: this.ReplenishDistance*1000,  //补货配送范围
                ReplenishAddRate: this.ReplenishAddRate  //补货加价比
            }).then((ret) => {
                if (ret.error) {
                }
                else {
                    toastShort('设置成功');
                    this.pop();
                }
            }).catch((e) => {

            });
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
            this.ReplenishDistance = datas.ReplenishDistance/1000;  //补货配送范围
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
    edit: {
        height: px2dp(140),
        borderBottomWidth: px2dp(1),
        borderStyle: 'dotted',
        borderBottomColor: '#f2f1ef'
    },
    itemList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(25),
        paddingTop: px2dp(15),
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(90)
    },
    inputStyle: {
        margin: 0,
        padding: 0,
        width: px2dp(50),
        fontSize: px2dp(14)
    },
    startingLoad: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(30)
    },
    amount: {
        width: px2dp(160),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        fontSize: px2dp(14),
        margin: 0,
        padding: 0,
        textAlign: 'center'
    },
    amount2: {
        width: px2dp(160),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        fontSize: px2dp(14),
        margin: 0,
        padding: 0,
        textAlign: 'center'
    },
    amount3: {
        width: px2dp(80),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        fontSize: px2dp(14),
        margin: 0,
        padding: 0,
        textAlign: 'right'
    },
    amount4: {
        width: px2dp(50),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        fontSize: px2dp(14),
        margin: 0,
        padding: 0,
    },
    plenishWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textBackground: {
        width: px2dp(80),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        justifyContent: 'center',
        paddingLeft: px2dp(10)
    },
    deliveryFee: {
        flexDirection: 'row',
        paddingTop: px2dp(12),
        paddingLeft: px2dp(70),
        paddingBottom: px2dp(12),
        borderBottomWidth: px2dp(1),
        borderBottomColor: '#f2f1ef'
    },
    deliveryFee2: {
        flexDirection: 'row',
        paddingTop: px2dp(12),
        paddingLeft: px2dp(70),
        paddingBottom: px2dp(12),
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
    showStyles: {
        width: deviceWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: px2dp(12),
        paddingHorizontal: px2dp(12)
    },
});

function mapStateToProps(store) {
    return {
        ReduceSetReplenish: store.ReduceSetReplenish,
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceDelivery: store.ReduceDelivery,
    }
}

const connectReplenishFee = connect(mapStateToProps)(ReplenishFee);
connectReplenishFee.navigationOptions = NavigationOptions;
export default connectReplenishFee;
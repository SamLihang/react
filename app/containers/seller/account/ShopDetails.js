/**
 * Created by Administrator on 2017/5/24. 店铺详情
 */
import React,{Component} from "react";
import {StyleSheet, View,Platform} from "react-native";
import {BCImage, BCText, BCTouchable, deviceHeight, deviceWidth, px2dp, substr,NavigationOptions,BCHostImage} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from 'react-redux';
import {ActionCustomer} from "../../../actions/ShopDetailAction";

class OnCallMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Call:React.PropTypes.func,
        Cancle:React.PropTypes.func,
        Phone:React.PropTypes.string,
    };

    Trigger(v) {
        this.setState({
            IsShow:v
        })
    }

    render() {
        return (
            this.state.IsShow?
                <View style={[Styles.selectType]}>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff,]}>
                        <BCText style={[gs.fts_17, gs.c_BaseColor, gs.fts_18]}>{this.props.Phone}</BCText>
                    </BCTouchable>
                    <BCTouchable style={[Styles.menuItem, gs.bgc_fff, {marginTop: px2dp(10)}]}
                                 onPress={() => this.props.Cancle()}>
                        <BCText style={[gs.fts_17, gs.c_3a3838, gs.fts_18]}>取消</BCText>
                    </BCTouchable>
                </View>:null
        )
    }
}

class ShopDetails extends PullViewComponent {
    //设置页面标题
    setTitle() {
        let name = this.params.CompanyName;
        return name
    }

    constructor(props) {
        super(props)
        this.state = {
            data:[]
        }
    }

    static propTypes = {
        OnCall:React.PropTypes.func,
    };
    _OnCallMaks=null;


    content() {
        const reduceCustomer = this.props.ReduceCustomer;
        let datas=reduceCustomer.datas;
        return (
            <View style={[Styles.mainStyle, gs.bgc_f2f1ef]}>
                <View style={Styles.companyImage}>
                    <BCHostImage source={{uri:datas.LogoImage}}
                             style={{width: deviceWidth, height: px2dp(175)}}/>
                </View>
                <View style={[Styles.address, gs.bgc_fff]}>
                    <BCImage source={require("../../../imgs/position@2x.png")}></BCImage>
                    <BCText
                        style={[gs.fts_14, gs.c_3a3838, Styles.addressTitle, {borderRightColor: gs.bgc_f2f1ef}]}>{substr((datas.Address), 40)}</BCText>
                    <BCTouchable onPress={() => this.OnCall(datas.Phone)} style={Styles.call}>
                        <BCImage source={require("../../../imgs/telephone@2x.png")}></BCImage>
                    </BCTouchable>
                </View>
                <View style={Styles.listStyle}>
                    <View style={[Styles.itemStyle, gs.bgc_fff]}>
                        <View style={{paddingRight: px2dp(7), paddingLeft: px2dp(12)}}>
                            <BCImage source={require('../../../imgs/money.png')}/>
                        </View>
                        <View style={Styles.txtStyle}>
                            <BCText style={[{paddingLeft: px2dp(7)}, gs.fts_14, gs.c_3a3838]}>供应价格: {datas.PriceGroupName}</BCText>
                        </View>
                    </View>
                    <View style={[Styles.itemStyle, gs.bgc_fff]}>
                        <View style={{paddingRight: px2dp(7), paddingLeft: px2dp(12)}}>
                            <BCImage source={require('../../../imgs/Accountperiod.png')}/>
                        </View>
                        <View style={Styles.txtStyle}>
                            <BCText style={[{paddingLeft: px2dp(7)}, gs.fts_14, gs.c_3a3838]}>约定账期：{datas.Cycle}天</BCText>
                        </View>
                    </View>
                    <View style={[Styles.itemStyle, gs.bgc_fff]}>
                        <View style={{paddingRight: px2dp(7), paddingLeft: px2dp(12)}}>
                            <BCImage source={require('../../../imgs/payment.png')}/>
                        </View>
                        <View style={Styles.txt1Style}>
                            <BCText style={[{paddingLeft: px2dp(7)}, gs.fts_14, gs.c_3a3838]}>付款延迟：{datas.PaymentDelay}天</BCText>
                        </View>
                    </View>
                </View>
                <View style={[Styles.detailStyle, gs.bgc_fff]}>
                    <View style={Styles.title}>
                        <BCImage source={require('../../../imgs/briefintroduction.png')}
                                 style={{marginLeft: px2dp(14)}}/>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(7)}]}>商户简介</BCText>
                    </View>
                    <View style={Styles.content}>
                        <BCText style={[gs.fts_14, gs.c_3a3838]}>{datas.Description}</BCText>
                    </View>
                </View>
            </View>
        );
    }


    OnCall(){
        this._Maks.Trigger(true);
        this._OnCallMaks.Trigger(true);
    }

    maksContent() {
        const reduceCustomer = this.props.ReduceCustomer;
        if(reduceCustomer.datas){
            let datas=reduceCustomer.datas;
            return (
                <View>
                    <OnCallMaks
                        ref={(ref) => this._OnCallMaks = ref}
                        Cancle={()=>{
                            this._OnCallMaks.Trigger(false);
                            this._Maks.Trigger(false);
                        }}
                        Call={()=>{
                            this._Maks.Trigger(false);
                            this._OnCallMaks.Trigger(false);
                        }}
                        Phone={datas.Phone}
                    />
                </View>
            )
        }else{}
    }

    WillMount() {
        const {dispatch} = this.props;
        const bCompanyId = this.params.BCompanyId;
        dispatch(ActionCustomer({bCompanyId: bCompanyId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceCustomer.datas != null && nextProps.ReduceCustomer.datas != this.props.ReduceCustomer.datas) {
            const {ReduceCustomer} = nextProps;
            this.setState({
                IsReceived: true,
                data: ReduceCustomer.datas
            });
        }

    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        height: deviceHeight,
    },
    companyImage: {
        width: deviceWidth,
        height: px2dp(175),
    },
    address: {
        flexDirection: 'row',
        paddingLeft: px2dp(12),
        alignItems: "center",
        height: px2dp(50)

    },
    addressTitle: {
        width: deviceWidth - px2dp(80),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        borderRightWidth: 1,
    },
    call: {
        marginLeft: px2dp(15),
        width: px2dp(30),
        height: px2dp(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    listStyle: {
        width: deviceWidth,
        height: px2dp(147.5),
        marginTop: px2dp(10)
    },
    itemStyle: {
        height: px2dp(48),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtStyle: {
        borderBottomWidth: 1,
        borderBottomColor: gs.bdc_e3e3e3,
        height: px2dp(48),
        width: deviceWidth - px2dp(33),
        justifyContent: 'center',
    },
    txt1Style: {
        height: px2dp(48),
        width: deviceWidth - px2dp(33),
        justifyContent: 'center',
    },
    detailStyle: {
        marginTop: px2dp(10),
    },
    title: {
        height: px2dp(44),
        flexDirection: 'row',
        alignItems: 'center'
    },
    content:{
        paddingLeft:px2dp(32),
        paddingRight:px2dp(21),
        paddingBottom:px2dp(27)
    },
    selectType: {
        position: 'absolute',
        left: 0,
        bottom: Platform.OS === 'ios' ? px2dp(-36) : px2dp(-45),
        width: deviceWidth,
        height: px2dp(183),
        zIndex: 2,
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10)
    },
    menuItem: {
        height: px2dp(57),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    }
})

function mapStateToProps(store) {
    return {
        ReduceCustomer: store.ReduceCustomer
    }
}
const connectShopDetails = connect(mapStateToProps)(ShopDetails);
connectShopDetails.navigationOptions = NavigationOptions;
export default connectShopDetails;

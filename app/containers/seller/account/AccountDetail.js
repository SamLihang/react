/**
 * Created by Administrator on 2017/4/25.
 */
import React ,{Component}from "react";
import {StyleSheet, View,Platform} from "react-native";
import {BCImage, BCText, BCTouchable, deviceHeight, NavigationOptions, px2dp,BCHostImage} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import CheckBox from "../../../components/CheckBox";
import {toDecimal2} from "../../../utils/FormatUtil";
import TextChange from "../../../components/TextChange";
import {ActionOrderSettleListDetail} from "../../../actions/ShopDetailAction";
import {deviceWidth} from "../../../utils/CommonFuns";
import PasswordInput from "../../../components/PasswordInput";
import {fetchCheckPayPassword} from "../../../services/PurchaseOrderServices";
import {fetchUpDateOrderOfflineSellPay} from "../../../services/AccountServices";
import {toastShort} from "../../../utils/ToastUtil";

class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
        _changeText: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v,
            typeSelected:'cash'
        })
    }

    endText(password,typeSelected) {
        this.props._changeText(password,typeSelected);
    }

    render() {

        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 2,
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                    backgroundColor: '#fff',
                    height: Platform.OS == 'ios' ? 472 : 252
                }}>
                    <View style={{flexDirection:'column',alignItems:'center',backgroundColor:'#e3e3e3'}}>
                        <BCText style={{fontSize:18,color:'#000'}}>请选择商家付款方式</BCText>
                        <View style={{marginTop:px2dp(5),marginBottom:px2dp(5),flexDirection:'row',justifyContent:'space-between'}}>
                            <BCTouchable style={{width:px2dp(80),height:px2dp(28),backgroundColor:this.state.typeSelected=='cash'?'#31ca96':'#fff',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#31ca96',borderRadius:20}}
                                         onPress={()=>{this.setState({typeSelected:'cash'})
                                         }}
                            >
                                <BCText style={{fontSize:14}}>现金</BCText>
                            </BCTouchable>
                            <BCTouchable style={{width:px2dp(80),height:px2dp(28),backgroundColor:this.state.typeSelected=='cheque'?'#31ca96':'#fff',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#31ca96',borderRadius:20}}
                                         onPress={()=>{
                                             this.setState({typeSelected:'cheque'})
                                         }}
                            >
                                <BCText style={{fontSize:14}}>支票</BCText>
                            </BCTouchable>
                        </View>

                    </View>
                    <View style={[gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(49),
                        borderBottomWidth: 1,
                        alignItems: 'center'
                    }]}>
                        <BCTouchable onPress={() => this.props.Cancle()}>
                            <BCImage style={{marginLeft: px2dp(12)}}
                                     source={require("../../../imgs/close.png")}></BCImage>
                        </BCTouchable>
                        <BCText
                            style={[gs.fts_17, {color: 'black', marginLeft: px2dp(100)}]}>请输入支付密码</BCText>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: px2dp(30), marginLeft: px2dp(15)}}>
                        <PasswordInput maxLength={6} onEnd={(text) => {
                            this.endText(text,this.state.typeSelected);
                        }}/>
                    </View>

                    <BCTouchable onPress={() => {
                        this.props.navigation.navigate('RevisePayPassword')
                    }} style={{marginTop: px2dp(12), marginLeft: px2dp(282)}}>
                        <BCText style={[gs.fts_15, {color: '#148DE4'}]}>忘记密码？</BCText>
                    </BCTouchable>
                </View> : null
        )
    }
}


class AccountDetail extends PullViewComponent {
    //设置页面标题
    setTitle() {
        return "账期详情"
    }

    _CheckBoxAll = null;
    _CheckBoxList = [];
    _TextChange = null;

    salesOrderId=[];
    amount=null;
    payType=null;
    sellerOrderSettleId=null;


    //绿色背景
    renderDay() {
        return (
            <View>
                <View style={{
                    width: px2dp(358),
                    height: px2dp(6),
                    backgroundColor: '#2dcba0',
                    borderRadius: px2dp(3),
                    marginLeft: px2dp(2)
                }}></View>
                <View style={[Styles.contentStyle, gs.bgc_fff]}>
                    {this.renderDetail()}
                </View>
            </View>
        )
    }
    _ToPayMaks=null;
    _Maks=null;
    //账期数据
    renderDetail() {
        let {ReduceOrderSettleListDetail} = this.props;
        if (ReduceOrderSettleListDetail.datas) {
            let datas = ReduceOrderSettleListDetail.datas;
            return (
                datas.map((item, index) => {
                    let SalesOrderSettle = item.SalesOrderSettle;
                    return (
                        SalesOrderSettle.map((items, detailIndex) => {
                            let SalesOrderNo = items.SalesOrderNo;
                            let CreateTime = items.CreateTime;
                            let Amount = items.Amount;
                            let SettleStatusName = items.SettleStatusName;
                            let IsCompleted=items.IsCompleted;
                            let SalesOrderId=items.SalesOrderId;
                            let SalesOrderState=items.SalesOrderState;
                            let payType=items.OfflinePayCategory;
                            let SalesOrderSettleId=items.SalesOrderSettleId;
                            let SettleStatusId=items.SettleStatusId;
                            return (
                                <View key={detailIndex} style={[Styles.orderStyle]}>
                                    <BCTouchable onPress={()=>{
                                        switch (SalesOrderState) {
                                            case 3:
                                                this.push('SellerDetail1',{salesOrderId:SalesOrderId})
                                                break;
                                            case 4:
                                                this.push('SellerDetail2',{salesOrderId:SalesOrderId})
                                                break;
                                            case 5:
                                                this.push('SellerDetail3',{salesOrderId:SalesOrderId})
                                                break;
                                            case 7:
                                                this.push('SellerDetail4',{salesOrderId:SalesOrderId})
                                                break;
                                            default:
                                                return "";
                                                break;
                                        }

                                    }}
                                     style={{flex:1,flexDirection: 'row', marginRight: px2dp(10), alignItems: 'center',justifyContent:'space-around'
                                     }}>
                                        <View style={{flexDirection: 'row',justifyContent:'flex-start',marginRight:px2dp(5),marginTop:px2dp(8)}}>
                                            {/*<View style={{height: px2dp(44), width: px2dp(46),backgroundColor:'#000'}}></View>*/}
                                            <View>
                                                <BCText style={[gs.fts_12, gs.c_3a3838]}>{CreateTime}</BCText>
                                                <BCText style={[gs.fts_12, gs.c_888]}>订单号 {SalesOrderNo}</BCText>
                                            </View>
                                            <BCText style={[gs.fts_13, gs.c_3a3838, {
                                                marginTop: px2dp(15),
                                                marginLeft: px2dp(29)
                                            }]}>￥{toDecimal2(Amount)}</BCText>
                                        </View>
                                        <View style={{flexDirection:'column',marginBottom:px2dp(10)}}>
                                            {SettleStatusId!=7&&(payType=='Cash'||payType=='Cheque')?
                                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                    <BCTouchable style={{marginRight:px2dp(6),justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#31ca96',borderRadius:20}}
                                                                 onPress={() =>{
                                                                     this.salesOrderId.push(SalesOrderId)
                                                                     this.amount=Amount
                                                                     this.payType=payType
                                                                     this.sellerOrderSettleId=SalesOrderSettleId
                                                                     this.toConfirm()
                                                                 }}
                                                    >
                                                        <BCText style={{marginHorizontal:px2dp(5),marginVertical:px2dp(2),fontSize:13,color:'#31ca96'}}>确认收款</BCText>
                                                    </BCTouchable>
                                                </View>:
                                                <View style={{width:px2dp(5),height:px2dp(18)}}/>
                                            }

                                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                                <BCText
                                                    style={[gs.fts_13, (IsCompleted == false) ? {color: '#fa9032'} : gs.c_888]}>{IsCompleted?'已完成':'进行中'}</BCText>
                                                <BCImage style={{width: px2dp(12), height: px2dp(12),marginTop:px2dp(3)}}
                                                         source={require('../../../imgs/right1.png')}/>
                                            </View>
                                        </View>
                                    </BCTouchable>
                                </View>
                            )
                        })
                    )
                })
            )
        }
    }
    toConfirm(){
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    //弹窗
    maksContent() {
        return (
            <View>

                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._ToPayMaks.Trigger(false)
                               this._Maks.Trigger(false);
                           }}
                           _changeText={(password,typeSelected) => {
                               const {dispatch} = this.props;
                               this._Loading.Trigger(true);
                               //验证支付密码是否正确
                               fetchCheckPayPassword({password}).then((ret) => {
                                   if (ret.data === null) {
                                       let payType = typeSelected
                                       //this._Loading.Trigger(true);
                                       fetchUpDateOrderOfflineSellPay({
                                           salesOrderSettleId: this.sellerOrderSettleId,
                                           payType: typeSelected,
                                           salesOrderId: this.salesOrderId,
                                           amount: this.amount
                                       }).then((ret) => {
                                           if (ret.data==null) {
                                               toastShort("确认成功");
                                           }
                                       })

                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                       this._Loading.Trigger(false);

                                   }
                                   else if (ret.error) {
                                       toastShort("确认失败,请重新输入支付密码");
                                       this._ToPayMaks.Trigger(false);
                                       this._Maks.Trigger(false);
                                       this._Loading.Trigger(false);

                                   }

                               }).catch((e) => {
                                   toastShort("确认失败,请重新输入支付密码");
                                   this._ToPayMaks.Trigger(false)
                                   this._Maks.Trigger(false);
                                   this._Loading.Trigger(false);
                               });
                           }}
                           navigation={this.navigation}

                />
            </View>
        )
    }

    getTotal(self) {
        var price = 0;
        let boxList = self._CheckBoxList;
        boxList.map((list, index) => {
            if (list.state.IsSelect) {
                price += (toDecimal2(list.props.Amount) * 1000) / 1000
            }
        })
        self._TextChange.OnChange(price)
    }

    //不同的账期标题
    renderTitle() {
        let {ReduceOrderSettleListDetail} = this.props;
        if (ReduceOrderSettleListDetail.datas) {
            let datas = ReduceOrderSettleListDetail.datas;
            return (
                datas.map((TitleItem, TitleIndex) => {
                    let StateStr = TitleItem.StateStr;
                    return (<BCText key={TitleIndex} style={[gs.fts_14, {color: '#fa9032'}]}>{StateStr}</BCText>)
                })
            )
        }
    }

    content() {
        let {ReduceOrderSettleListDetail} = this.props;
        if (ReduceOrderSettleListDetail.datas) {
            let datas = ReduceOrderSettleListDetail.datas;
            return (
                datas.map((item, index) => {
                    let LogoImage = item.LogoImage;
                    let BCompany = item.BCompany;
                    let CycleStr = item.CycleStr;
                    let BCompanyId=this.params.BCompanyId
                    return (
                        <View key={index} style={[Styles.main, gs.bgc_f2f1ef]}>
                            <BCTouchable onPress={()=>{
                                this.push('ShopDetails',{BCompanyId,CompanyName:BCompany})}} style={Styles.companyStyle}>
                                <View style={Styles.rowStyle}>
                                    {
                                        LogoImage?
                                        <BCHostImage style={{width: px2dp(39), height: px2dp(39), borderRadius:Platform.OS=='ios'?px2dp(19):px2dp(50)}}
                                           source={{uri: LogoImage}}/> :
                                        <BCImage style={{width: px2dp(39), height: px2dp(39), borderRadius:Platform.OS=='ios'?px2dp(19):px2dp(50)}}
                                                 source={require('../../../imgs/Headportrait.png')}/>
                                    }
                                    <View style={Styles.companyTitle}>
                                        <BCText style={[gs.fts_16, gs.c_3a3838]}>{BCompany}</BCText>
                                        <BCText style={[gs.fts_12, gs.c_888]}>{CycleStr}</BCText>
                                    </View>
                                </View>
                                <View style={{marginRight: px2dp(23)}}>{this.renderTitle()}</View>
                            </BCTouchable>
                            {this.renderDay()}
                        </View>
                    );
                })
            )
        }

    }


    WillMount() {
        const {dispatch} = this.props;
        const SalesOrderSettleId = this.params.SalesOrderSettleId;
        // const sCompanyId=this.params.sCompanyId;
        dispatch(ActionOrderSettleListDetail({salesOrderSettleId: SalesOrderSettleId}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceOrderSettleListDetail.datas != null && nextProps.ReduceOrderSettleListDetail.datas != this.props.ReduceOrderSettleListDetail.datas) {
            this.setState({
                IsReceived: true
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        minHeight:deviceHeight
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
        marginLeft: px2dp(3),
        justifyContent: 'center'
    },
    contentStyle: {
        width: px2dp(355),
        borderWidth: px2dp(0.5),
        borderColor: '#d7d7d7',
        marginLeft: px2dp(3),
    },
    orderStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: px2dp(10),
        paddingBottom: px2dp(10),
        justifyContent: 'space-between'
    }

});

function mapStateToProps(store) {
    return {
        ReduceOrderSettleListDetail: store.ReduceOrderSettleListDetail
    }
}

const connectAccountDetail = connect(mapStateToProps)(AccountDetail);
connectAccountDetail.navigationOptions = NavigationOptions;
export default connectAccountDetail;
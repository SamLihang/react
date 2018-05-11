/**
 * Created by Administrator on 2017/4/10.已完成
 */
import React, {Component} from "react";
import {StyleSheet, TextInput, View, Platform} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr,
    BCHostImage,
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {
    ActionSalesOrderDetail,
    ActionSellerSalesOrder7,
    ActionConfirmReceive
} from "../../../actions/SellerSalesOrderAction";
import {formaTime, toDecimal2,} from "../../../utils/FormatUtil";
import {toastLong, toastShort, confirm} from '../../../utils/ToastUtil';
import {fetchConfirmReceive} from "../../../services/SellerOrderServices";
import {print} from '../../buyer/my/PrintSetup';
const DeliveryType = {

    //已完成
    ToCompleted: 1,
    //已完成有修改
    ToUpdate: 3,
};
/*

class RenderBadListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsOpen: false,
            ToPush: props.ToPush,
        }
    }

    _CheckBoxList = [];
    static propTypes = {
        Company: React.PropTypes.array,
        PurchaseOrderId: React.PropTypes.number,
        ToPush: React.PropTypes.func,
    };
    static defaultProps = {
        Company: {},
        Actul: {},
        PurchaseOrderId: 0,
    };

    //点击跳转
    ToPush(PurchaseOrderId) {
        this.setState(() => {
            this.props.ToPush(PurchaseOrderId)
        });
    };

    //查看明细按钮
    onSelectDetail() {
        this.setState({
            IsOpen: !this.state.IsOpen
        })
    }

    //每行的商品
    renderProductItem(product, index) {
        const actul = this.props.Actul
        let datas = actul
        return (
            <View key={index}>
                <BCTouchable style={[Styles.listItem]}>
                    <BCHostImage style={Styles.productImg}
                                 source={{uri: product.Image ? product.Image : 'https://bcl.baocailang.com:8991/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'}}/>
                    <View style={[Styles.listItemRight]}>
                        <View style={{position: 'absolute', left: '30%'}}>
                            <BCImage source={require("../../../imgs/below-standard.png")}/>
                        </View>
                        <View style={Styles.listTitle}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{product.ProductName}</BCText>
                            <BCText
                                style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13)}]}>￥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                        </View>
                        <BCText
                            style={[gs.fts_13, gs.c_3a3838]}>{product.Spec}</BCText>
                        <View style={Styles.listAmount}>
                            <BCText style={[gs.fts_13, gs.c_3a3838,]}>X {product.Quantity}</BCText>
                            <View style={Styles.number}>
                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>小计:</BCText>
                                <BCText
                                    style={[gs.fts_13, gs.c_fd0319, {marginRight: px2dp(32)}]}>￥{toDecimal2(product.Amount)}</BCText>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: px2dp(5)}}>
                            <BCText style={[gs.fts_13, gs.c_b7b7b7]}>
                                问题说明:{product.Remark}
                            </BCText>
                        </View>
                    </View>
                </BCTouchable>
            </View>
        )
    }


    render() {
        const company = this.props.Company;
        let items = company;
        let IsOpen = this.state.IsOpen;
        let self = this;
        return (
            <View>
                <BCTouchable
                    onPress={() => {
                        //this.ToPush(PurchaseOrderId)
                    }}

                >
                    {
                        IsOpen ?
                            items.map((e, i) => {
                                return self.renderProductItem(e, i)
                            }) :
                            items.map((e, i) => {
                                if (i >= 2) {
                                    return null;
                                }
                                return self.renderProductItem(e, i)
                            })
                    }
                </BCTouchable>
                {
                    items.length > 2 ?
                        <View style={Styles.lookDetail}>
                            <BCTouchable
                                style={{flexDirection: "row", alignItems: 'center'}}
                                onPress={() => {
                                    this.onSelectDetail()
                                }}>
                                <BCText style={[gs.fts_14, gs.c_888,]}>{IsOpen ? "收起" : "查看明细"}</BCText>
                                <BCImage
                                    source={IsOpen ? require('../../../imgs/down.png') : require('../../../imgs/up.png')}
                                    style={{marginLeft: px2dp(5)}}/>
                            </BCTouchable>
                        </View> : <View style={Styles.lookDetail}></View>
                }
            </View>
        )
    }
}

class RenderListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsOpen: false,
            ToPush: props.ToPush,
        }
    }

    _CheckBoxList = [];
    static propTypes = {
        Company: React.PropTypes.array,
        PurchaseOrderId: React.PropTypes.number,
        ToPush: React.PropTypes.func,
    };
    static defaultProps = {
        Company: {},
        Actul: {},
        PurchaseOrderId: 0,
    };

    //点击跳转
    ToPush(PurchaseOrderId) {
        this.setState(() => {
            this.props.ToPush(PurchaseOrderId)
        });
    };

    //查看明细按钮
    onSelectDetail() {
        this.setState({
            IsOpen: !this.state.IsOpen
        })
    }

    //每行的商品
    renderProductItem(product, index) {
        const actul = this.props.Actul
        let datas = actul
        if (this.state.DeliveryType == DeliveryType.ToCompleted) {
            return (
                <View key={index}>
                    <BCTouchable style={[Styles.listItem]}>
                        <BCHostImage style={Styles.productImg}
                                     source={{uri: product.Image ? product.Image : 'https://bcl.baocailang.com:8991/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'}}/>
                        <View style={Styles.listItemRight}>
                            <View style={Styles.listTitle}>
                                <BCText
                                    style={[gs.fts_16, gs.c_3a3838]}>{substr('' + product.ProductName + '', 10)}</BCText>
                                <BCText
                                    style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13)}]}>￥{product.Price}/{product.Unit}</BCText>
                            </View>
                            <BCText
                                style={[gs.fts_13, gs.c_3a3838]}>{product.Spec}</BCText>
                            <View style={Styles.listAmount}>
                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>X {product.Quantity}</BCText>
                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>下单数量:{datas.ActualAmount}</BCText>
                                <View style={Styles.number}>
                                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>小计:</BCText>
                                    <BCText
                                        style={[gs.fts_13, gs.c_fd0319, {marginRight: px2dp(32)}]}>￥{toDecimal2(product.Amount)}</BCText>
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            )
        } else {
            return (
                <View key={index}>
                    <BCTouchable style={[Styles.listItem]}>
                        <BCHostImage style={Styles.productImg}
                                     source={{uri: product.Image ? product.Image : 'https://bcl.baocailang.com:8991/Upload/ProductGlobalIco/A904BFEF8A09934336F9E96B34C06AFD.jpg'}}/>
                        <View style={Styles.listItemRight}>
                            <View style={Styles.listTitle}>
                                <BCText style={[gs.fts_16, gs.c_3a3838]}>{product.ProductName}</BCText>
                                <BCText
                                    style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13)}]}>￥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                            </View>
                            <BCText
                                style={[gs.fts_13, gs.c_3a3838]}>{product.Spec}</BCText>
                            <View style={Styles.listAmount}>
                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>X {product.Quantity}</BCText>
                                <View style={Styles.number}>
                                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>小计:</BCText>
                                    <BCText
                                        style={[gs.fts_13, gs.c_fd0319, {marginRight: px2dp(32)}]}>￥{toDecimal2(product.Amount)}</BCText>
                                </View>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            )
        }
    }


    render() {
        const company = this.props.Company;
        let items = company;
        let IsOpen = this.state.IsOpen;
        let self = this;
        return (
            <View>
                <BCTouchable
                    onPress={() => {
                        //this.ToPush(PurchaseOrderId)
                    }}

                >
                    {
                        IsOpen ?
                            items.map((e, i) => {
                                return self.renderProductItem(e, i)
                            }) :
                            items.map((e, i) => {
                                if (i >= 2) {
                                    return null;
                                }
                                return self.renderProductItem(e, i)
                            })
                    }
                </BCTouchable>
                {/!*{
                    items.length > 2 ?
                        <View style={Styles.lookDetail}>
                            <BCTouchable
                                style={{flexDirection: "row", alignItems: 'center'}}
                                onPress={() => {
                                    this.onSelectDetail()
                                }}>
                                <BCText style={[gs.fts_14, gs.c_888,]}>{IsOpen ? "收起" : "查看明细"}</BCText>
                                <BCImage
                                    source={IsOpen ? require('../../../imgs/down.png') : require('../../../imgs/up.png')}
                                    style={{marginLeft: px2dp(5)}}/>
                            </BCTouchable>
                        </View> : <View style={Styles.lookDetail}></View>
                }*!/}
            </View>
        )
    }
}
*/

class Detail4 extends PullViewComponent {
    constructor(props) {
        super(props);
        this.state = {
            DeliveryType: DeliveryType.ToCompleted,
            IsOpen: false,
            ToPush: props.ToPush,
        }
    }

    PayType = 0;
    OrderType = 0;
    salesOrderIds = 0;
    SettleStatusId = 0;
    //设置页面标题
    setTitle() {
        return "订单详情(已完成)"
    }
    onBack(){
        if(this.params.pageForm&&this.params.pageForm=="Jpush"){
            this.push("SellerIndex");
        }
    }
    //地址
    renderAddress(ContactName, Phone, Address) {
        return (
            <View style={Styles.detailHead}>
                <View style={Styles.information}>
                    <BCImage source={require("../../../imgs/position.png")}></BCImage>
                    <View style={Styles.info}>
                        <View style={Styles.consignee}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_fff]}>收 货 人 ：{ContactName}</BCText>
                            <BCText style={[gs.fts_13, gs.c_fff, {paddingRight:px2dp(20)}]}>{Phone}</BCText>
                        </View>
                        <View style={Styles.address}>
                            <BCText style={[Styles.textStyle, gs.fts_13, gs.c_fff]}>收货地址：</BCText>
                            <BCText style={[gs.fts_13, Styles.addressTitle, gs.c_fff]}>
                                {substr('' + Address + '', 40)}
                            </BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    //合格订单
    renderProductItem(product, index) {
        const reduceSalesOrderDetail = this.props.ReduceSalesOrderDetail;
        let datas = reduceSalesOrderDetail.datas;
        if (this.state.DeliveryType == DeliveryType.ToCompleted) {
            return (
                <View key={index}>
                    <BCTouchable style={[Styles.listItem]}>
                        {
                            product.Image!=null?
                                <BCHostImage style={Styles.productImg}
                                             source={{uri: product.Image}}/>
                                :
                                <BCImage style={Styles.productImg}
                                         source={require('../../../imgs/LOGO.png')} />
                        }
                        <View style={Styles.listItemRight}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(''+product.ProductName+'',12)}</BCText>
                            <BCText style={[gs.fts_13, gs.c_3a3838]}>¥{toDecimal2(product.UnitAmount*product.Price)}/{product.DisplayUnit}({product.UnitAmount}{product.Unit})</BCText>

                            <View style={{flexDirection:'row'}}>
                                <BCText style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13),color:'#fd0016'}]}>¥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                                {
                                    product.Price == product.OriginalPrice ?
                                        (null) :
                                        <View style={[gs.bgc_fd0319,{width: px2dp(15), height: px2dp(15), marginTop: px2dp(2),justifyContent:'center',alignItems:'center'}]}>
                                            {product.Price > product.OriginalPrice ?
                                                <BCText style={[gs.fts_10, gs.c_fff]}>升</BCText>
                                                :
                                                <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>
                                            }
                                        </View>
                                }
                            </View>
                            {/*'订'字*/}
                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(19)}]}>
                                {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {/*¥{toDecimal2(product.Price*product.Quantity*product.UnitAmount)}/{toDecimal2(product.Quantity*product.UnitAmount)}{product.Unit}*/}
                                    {toDecimal2(product.Quantity)}{product.DisplayUnit}({toDecimal2(product.Quantity*product.UnitAmount)}{product.Unit})
                                </BCText>
                            </View>

                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(38)}]}>
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#f1cdda',borderWidth:px2dp(0.5),borderColor:'#f0578c',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#f0578c'}]}>实</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {/*¥{toDecimal2(product.Price*product.RealQuantity)}/{product.RealQuantity}{product.Unit}*/}
                                    {toDecimal2(product.ActualQuantity)}{product.DisplayUnit}({product.RealQuantity}{product.Unit})
                                </BCText>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            )
        } else {
            return (
                <View key={index}>
                    <BCTouchable style={[Styles.listItem]}>
                        {
                            product.Image!=null?
                                <BCHostImage style={Styles.productImg}
                                             source={{uri: product.Image}}/>
                                :
                                <BCImage style={Styles.productImg}
                                         source={require('../../../imgs/LOGO.png')} />
                        }
                        {/*<View style={Styles.listItemRight}>*/}
                            {/*<View style={Styles.listTitle}>*/}
                                {/*<BCText style={[gs.fts_16, gs.c_3a3838]}>{product.ProductName}</BCText>*/}
                                {/*<BCText*/}
                                    {/*style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13)}]}>￥{toDecimal2(product.Price)}/{product.Unit}</BCText>*/}
                            {/*</View>*/}
                            {/*<BCText*/}
                                {/*style={[gs.fts_13, gs.c_3a3838]}>{product.Spec}</BCText>*/}
                            {/*<View style={Styles.listAmount}>*/}
                                {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X {product.Quantity}</BCText>*/}
                                {/*<View style={Styles.number}>*/}
                                    {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>小计:</BCText>*/}
                                    {/*<BCText*/}
                                        {/*style={[gs.fts_13, gs.c_fd0319, {marginRight: px2dp(32)}]}>￥{toDecimal2(product.Amount)}</BCText>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        <View style={Styles.listItemRight}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(''+product.ProductName+'',12)}</BCText>
                            <BCText style={[gs.fts_13, gs.c_3a3838]}>¥{toDecimal2(product.UnitAmount*product.Price)}/{product.DisplayUnit}({product.UnitAmount}{product.Unit})</BCText>

                            <BCText style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13),color:'#fd0016'}]}>¥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                            {/*'订'字*/}
                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(19)}]}>
                                {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {toDecimal2(product.Quantity)}{product.DisplayUnit}({toDecimal2(product.Quantity*product.UnitAmount)}{product.Unit})
                                </BCText>
                            </View>

                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(38)}]}>
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#f1cdda',borderWidth:px2dp(0.5),borderColor:'#f0578c',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#f0578c'}]}>实</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {toDecimal2(product.ActualQuantity)}{product.DisplayUnit}({product.RealQuantity}{product.Unit})
                                </BCText>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
            )
        }
    }

    // 不合格订单
    renderBadProductItem(product, index){
        return (
            <View key={index}>
                <BCTouchable >
                    <View style={[Styles.listItem,{flexDirection:'row',paddingTop:px2dp(10),paddingBottom:px2dp(10)}]}>
                        {
                            product.Image!=null?
                                <BCHostImage style={Styles.productImg}
                                             source={{uri: product.Image}}/>
                                :
                                <BCImage style={Styles.productImg}
                                         source={require('../../../imgs/LOGO.png')} />
                        }
                        <View style={Styles.listItemRight}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(''+product.ProductName+'',12)}</BCText>
                            <BCText style={[gs.fts_13, gs.c_3a3838]}>¥{toDecimal2(product.UnitAmount*product.Price)}/{product.DisplayUnit}({product.UnitAmount}{product.Unit})</BCText>

                            <BCText style={[gs.fts_13, gs.c_3a3838, {marginRight: px2dp(13),color:'#fd0016'}]}>¥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                            {/*'订'字*/}
                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(19)}]}>
                                {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{e.ActualQuantity}</BCText>*/}
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {toDecimal2(product.Quantity)}{product.DisplayUnit}({toDecimal2(product.Quantity*product.UnitAmount)}{product.Unit})
                                </BCText>
                            </View>

                            <View style={[Styles.number,{flexDirection:'row',marginTop:px2dp(38)}]}>
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#f1cdda',borderWidth:px2dp(0.5),borderColor:'#f0578c',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#f0578c'}]}>实</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {toDecimal2(product.ActualQuantity)}{product.DisplayUnit}({product.RealQuantity}{product.Unit})
                                </BCText>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor: "#f7f7f7",flexDirection: 'row',paddingBottom:px2dp(10),paddingLeft:px2dp(23)}}>
                        <BCText style={[gs.fts_13, {color:'#999'}]}>
                            问题说明:{product.Remark}
                        </BCText>
                    </View>
                </BCTouchable>
            </View>
        )
    }


    //查看明细按钮
    onSelectDetail() {
        this.setState({
            IsOpen: !this.state.IsOpen
        })
    }

    content() {
        const reduceSalesOrderDetail = this.props.ReduceSalesOrderDetail;
        if (reduceSalesOrderDetail.datas) {
            let datas = reduceSalesOrderDetail.datas;
            this.PayType = datas.PayType;
            this.OrderType = datas.OrderType;
            this.SettleStatusId = datas.SettleStatusId;
            const {salesOrderId} = this.params;
            this.salesOrderIds = salesOrderId;
            let IsOpen = this.state.IsOpen;
            let self = this;
            //配送费
            let DeliveryAmount = datas.DeliveryAmount;
            //支付方式
            let PayType = null;
            switch (datas.PayType) {
                case 1:
                    PayType = '货到付款';
                    break;
                case 3:
                    PayType = '支付宝';
                    break;
                case 4:
                    PayType = '余额';
                    break;
                case 5:
                    PayType = '账期';
                    break;
                default:
                    PayType = '余额';
                    break;
            }
            let Items = datas.PurchaseOrderLines;
            return (
                <View style={[gs.bgc_f2f1ef, {paddingBottom: '20%'}]}>
                    {this.renderAddress(datas.ContactName, datas.Phone, datas.Address)}
                    {/*订单*/}
                    <View style={[Styles.OrderNumber, gs.bgc_fff]}>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(12)}]}>订单编号：{datas.SalesOrderNo}</BCText>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: Platform.OS == 'ios' ? 50 : 70,marginRight: Platform.OS == 'ios' ? px2dp(6) : px2dp(8)}]}>{formaTime(datas.CreateTime, "yyyy-MM-dd hh:mm:ss")}</BCText>
                    </View>
                    {/*公司名称*/}
                    <View style={[Styles.companyName, gs.bgc_fff, gs.bdc_e3e3e3]}>
                            {
                                datas.LogoImage?
                                <BCHostImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                             source={{uri: datas.LogoImage}}></BCHostImage>
                                :
                                <BCImage style={{height: px2dp(29), width: px2dp(29), marginLeft: px2dp(12)}}
                                         source={require('../../../imgs/LOGO.png')}/>
                            }
                          <BCText style={[gs.fts_16, gs.c_888, {marginLeft: px2dp(7)}]}>{datas.BCompanyFullName}</BCText>
                    </View>
                    {/*订单及查看明细*/}
                    {/* <RenderListItem
                     Company={Items}
                     Actul={datas}
                     />*/}
                    {/*{
                        Items.map((item) => {
                                let Remark = item.Remark;
                                if (Remark) {
                                    return (
                                        <RenderBadListItem
                                            Company={Items}
                                            Actul={datas}
                                        />
                                    )
                                }
                                else {
                                    return(
                                        <RenderListItem
                                            Company={Items}
                                            Actul={datas}
                                        />
                                    )
                                }
                            }
                        )}*/}

                    {/*订单*/}
                    {

                       IsOpen ?
                            Items.map((e, i) => {
                                let Remark = e.Remark;
                                if(Remark){
                                    return self.renderBadProductItem(e,i)
                                }
                                else{
                                    return self.renderProductItem(e, i)
                                }
                            }) :
                            Items.map((e, i) => {
                                let Remark = e.Remark;

                                    if (i >= 2) {
                                        return null;
                                    }
                                if(Remark){
                                    return self.renderBadProductItem(e,i)
                                }
                                return self.renderProductItem(e, i)
                            })
                    }
                    {/*查看明细*/}
                    {
                        Items.length > 2 ?
                            <View style={Styles.lookDetail}>
                                <BCTouchable
                                    style={{flexDirection: "row", alignItems: 'center'}}
                                    onPress={() => {
                                        this.onSelectDetail()
                                    }}>
                                    <BCText style={[gs.fts_14, gs.c_888,]}>{IsOpen ? "收起" : "查看明细"}</BCText>
                                    <BCImage
                                        source={IsOpen ? require('../../../imgs/down.png') : require('../../../imgs/up.png')}
                                        style={{marginLeft: px2dp(5)}}/>
                                </BCTouchable>
                            </View> : <View style={Styles.lookDetail}></View>
                    }


                    {/*下单金额*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>下单金额</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>￥{datas.Amount}</BCText>
                    </View>
                    {/*实际金额*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>实际金额</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>￥{datas.ActualAmount}</BCText>
                    </View>
                    {/*支付方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>支付方式</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>{PayType}</BCText>
                    </View>
                    {/*配送方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>配送方式</BCText>
                        <View style={{flexDirection: 'row'}}>
                            <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>商家配送</BCText>
                            <BCText
                                style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>{DeliveryAmount > 0 ? '￥' + DeliveryAmount : "免配送费"}</BCText>
                        </View>
                    </View>
                    {/*买家留言*/}
                    <View style={[gs.bgc_fff, gs.bdc_e3e3e3, {
                        flexDirection: 'row',
                        height: px2dp(45),
                        alignItems: 'center',
                        borderBottomWidth: 1
                    }]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>买家留言</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(18)}]}>{datas.Remark}</BCText>
                    </View>
                    {/*<View style={[Styles.count, gs.bgc_fff]}>*/}
                        {/*<BCText style={[gs.c_3a3838]}>共{this.TotalCount}件商品 合计:</BCText>*/}
                        {/*<BCText style={[gs.c_fd0319, {marginRight: px2dp(12)}]}>￥{toDecimal2(datas.Amount)}</BCText>*/}
                    {/*</View>*/}
                </View>
            );
        } else {
            return this.noRecord()
        }

    }

    Bottom() {
        const {dispatch} = this.props;
        const reduceSalesOrderDetail = this.props.ReduceSalesOrderDetail;
        let datas=reduceSalesOrderDetail.datas;
        return (
            this.renderBottom(this.Amount, this.DeliveryAmount, this.PayType, this.OrderType, this.salesOrderIds, this.ActualAmount, this.SettleStatusId, dispatch,datas)
        )
    }

    renderBottom(Amount, DeliveryAmount, PayType, OrderType, salesOrderId, ActualAmount, SettleStatusId, dispatch,datas) {
        if (this.state.DeliveryType == DeliveryType.ToCompleted) {
            return (
                <View style={[Styles.singleFooter,{flexDirection:'row',justifyContent:'flex-end'}]}>
                    {/*<View style={[Styles.money]}>*/}
                        {/*<View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>*/}
                            {/*<BCText style={[gs.fts_14, {color: '#ff162c'}]}>总额:*/}
                                {/*￥{toDecimal2(Amount)}元</BCText>*/}
                            {/*<BCText*/}
                                {/*style={[gs.c_3a3838, gs.fts_12]}>({DeliveryAmount ? '含配送费' + DeliveryAmount + '元' : "免配送费"})</BCText>*/}
                        {/*</View>*/}
                        {/*<View style={{flexDirection: 'row', marginLeft: px2dp(13)}}>*/}
                            {/*<BCText style={[gs.fts_14, {color: '#ff162c'}]}>实际总额:￥{toDecimal2(ActualAmount)}元</BCText>*/}
                            {/*<BCText*/}
                                {/*style={[gs.c_3a3838, gs.fts_12]}>({DeliveryAmount ? '含配送费' + DeliveryAmount + '元' : "免配送费"})</BCText>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    <View style={{flexDirection: "row"}}>
                        {
                            PayType === 1 && OrderType === 2 && SettleStatusId < 7 ?
                                <BCTouchable style={[Styles.pay, gs.bgc_fd0319]}
                                             onPress={() => {
                                                 //关闭按钮的提示窗
                                                 let self = this;
                                                 confirm("确定要付款吗？", function () {
                                                     //const dispatch = this.props;
                                                     let salesOrderIds = [];
                                                     salesOrderIds.push(salesOrderId);
                                                     dispatch(ActionConfirmReceive(salesOrderIds));
                                                 }, function () {
                                                     return false
                                                 });
                                             }}
                                >
                                    <BCText style={[gs.c_fff, gs.fts_17, gs.bold]}>确认收款</BCText>
                                </BCTouchable> : null
                        }
                        <BCTouchable style={[Styles.pay, {backgroundColor: '#31ca96'}]}
                                     onPress={() => {
                                         let printDate = [];
                                         printDate.push({
                                                 CreateTime: datas.CreateTime,
                                                 CompanyName: datas.BCompanyFullName,
                                                 Phone: datas.Phone,
                                                 bian: datas.ActualAmount,
                                                 ActualAmount: datas.ActualAmount,
                                                 ContactName: datas.ContactName,
                                                 Address: datas.Address,
                                                 Remark: datas.Remark,
                                                 OrderNo:datas.SalesOrderNo,
                                                 Items: datas.PurchaseOrderLines,
                                             }
                                         );
                                         // if (printDate.length > 0) {
                                         //     this.push("PrintSetup", printDate);
                                         // } else {
                                         //     toastShort("请选中需要打印的内容")
                                         // }
                                         if(printDate.length > 0 ){
                                             if(BluetoothConnection){
                                                 print(printDate);
                                             } else {
                                                 this.push("PrintSetup", printDate);
                                             }
                                         } else {
                                             toastShort("请选中需要打印的内容")
                                         }
                                     }}
                        >
                            <BCText style={[gs.c_fff, gs.fts_17, gs.bold]}>打印</BCText>
                        </BCTouchable>
                    </View>
                </View>

            )
        } else {
            return (
                <View style={[Styles.singleFooter,{flexDirection:'row',justifyContent:'flex-end'}]}>
                    <View style={{flexDirection: "row"}}>
                        {
                            PayType === 1 && OrderType === 2 && SettleStatusId < 7 ?
                                <BCTouchable style={[Styles.pay, gs.bgc_fd0319]}
                                             onPress={() => {
                                                 //关闭按钮的提示窗
                                                 let self = this;
                                                 confirm("确定要收款吗？", function () {
                                                     let salesOrderIds = [];
                                                     salesOrderIds.push(salesOrderId);
                                                     fetchConfirmReceive(salesOrderIds).then((ret) => {
                                                         if (ret.data) {
                                                             const {dispatch} = this.props;
                                                             this._page = 1;
                                                             dispatch(ActionSellerSalesOrder7({p: this._page, t: 7}));
                                                             toastShort("收款成功");
                                                         }
                                                     }).catch((e) => {
                                                         toastShort("收款失败");
                                                     });
                                                 }, function () {
                                                     return false
                                                 });
                                             }}>
                                    <BCText style={[gs.c_fff, gs.fts_17, gs.bold]}>确认收款</BCText>
                                </BCTouchable> : null
                        }

                        <BCTouchable style={[Styles.pay, {backgroundColor: '#00c164'}]}>
                            <BCText style={[gs.c_fff, gs.fts_17, gs.bold]}>打印</BCText>
                        </BCTouchable>
                    </View>
                </View>
            )
        }
    }

    WillMount() {
        const {dispatch} = this.props;
        const {salesOrderId} = this.params;
        dispatch(ActionSalesOrderDetail(salesOrderId));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSalesOrderDetail.datas != null && nextProps.ReduceSalesOrderDetail.datas != this.props.ReduceSalesOrderDetail.datas) {
            const {ReduceSalesOrderDetail} = nextProps;
            const reduceSalesOrderDetail = ReduceSalesOrderDetail.datas;
            //配送费
            let DeliveryAmount = reduceSalesOrderDetail.DeliveryAmount;
            //计算总额
            let Amount = 0;
            let lists = reduceSalesOrderDetail.PurchaseOrderLines;
            lists.map((list, index) => {
                Amount += list.Amount
            });
            this.Amount = Amount + DeliveryAmount;
            this.DeliveryAmount = DeliveryAmount;

            //计算总量
            let TotalCount = 0;
            lists.map((item, index) => {
                TotalCount += item.Quantity;
            });
            this.TotalCount = TotalCount;

            //实际总额
            this.Amount=reduceSalesOrderDetail.Amount+DeliveryAmount;
            this.ActualAmount = reduceSalesOrderDetail.ActualAmount + DeliveryAmount;
            this.setState({
                IsReceived: true,
            });
        }

        if (nextProps.ReduceConfirmReceive.datas != null && nextProps.ReduceConfirmReceive.datas !== this.props.ReduceConfirmReceive.datas) {
            const {navigation} = this.props;
            if(this.params.pageForm&&this.params.pageForm=="Jpush"){
                this.push("SellerIndex");
            }
            if (navigator) {
                navigation.goBack();
            }
        }

    }

}

const Styles = StyleSheet.create({
    detailHead: {
        width: '100%',
        height: px2dp(85),
        backgroundColor: '#6C768A'
    },
    information: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(19)
    },
    info: {
        width: deviceWidth - px2dp(32),
        height: px2dp(85),
        paddingTop: px2dp(18)
    },
    consignee: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    address: {
        paddingTop: px2dp(11),
        flexDirection: 'row'
    },
    addressTitle: {
        width: px2dp(208),
    },
    textStyle: {
        paddingLeft: px2dp(19),
    },
    OrderNumber: {
        height: px2dp(34),
        marginTop: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: gs.bdc_e3e3e3
    },
    companyName: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginLeft: px2dp(12),
    },
    listItemRight: {
        justifyContent: "space-around",
        flex: 1,
        marginLeft:px2dp(8)
    },
    listItem: {
        paddingTop: px2dp(12),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: "#f7f7f7",
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
    },
    listTitle: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    listAmount: {
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    number: {
        flexDirection: 'row',
        marginRight:px2dp(12)
    },
    lookDetail: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: px2dp(12),
        alignItems: "center",
        backgroundColor: '#f7f7f7',
        height: px2dp(40)
    },
    item: {
        height: px2dp(45),
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textInputStyle: {
        width: deviceWidth - px2dp(91),
        height: px2dp(45)
    },
    count: {
        height: px2dp(49),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(45),
        justifyContent: 'flex-end',
        //flexDirection: 'row',
    },
    singleFooter: {
        width: deviceWidth,
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    money: {
        //width: deviceWidth - px2dp(94),
        /*flexDirection: 'row',
         flexWrap: 'nowrap',
         alignItems: 'center',
         paddingRight: px2dp(9),*/
        height: '100%',
        flexWrap: 'nowrap',
        paddingRight: px2dp(9),
        justifyContent: 'center'
    },
    singleMoney: {
        height: '100%',
        alignItems: 'center',
        marginLeft: px2dp(12)
    },
    cancleViewStyle: {
        height: px2dp(105),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancleButton: {
        width: px2dp(316),
        height: px2dp(39),
        borderWidth: px2dp(0.5),
        borderRadius: px2dp(2.5),
        marginTop: px2dp(13),
        marginBottom: px2dp(22),
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        position: 'absolute', right: 0,
        marginLeft:px2dp(5),
        marginTop:px2dp(10)
    },
})

function mapStateToProps(store) {
    return {
        ReduceSalesOrderDetail: store.ReduceSalesOrderDetail,
        ReduceConfirmReceive: store.ReduceConfirmReceive,
    }
}
const connectDetail4 = connect(mapStateToProps)(Detail4);
connectDetail4.navigationOptions = NavigationOptions;
export default connectDetail4;
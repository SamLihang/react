/**
 * Created by Administrator on 2017/6/7. 订单详情(待发货) 完成
 */
import React, {Component} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp,
    substr,
    BCHostImage
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionSalesOrderDetail} from "../../../actions/SellerSalesOrderAction";
import {toastLong} from "../../../utils/ToastUtil"

//查看明细
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
                        <View style={Styles.listTitle}>
                            <BCText style={[gs.fts_16, gs.c_3a3838]}>{substr(''+product.ProductName+'',12)}</BCText>
                        </View>
                        <BCText style={[gs.fts_13, gs.c_3a3838]}>¥{toDecimal2(product.UnitAmount*product.Price)}/{product.DisplayUnit}({product.UnitAmount}{product.Unit})</BCText>

                        <View style={[Styles.listAmount,{flexDirection:'row'}]}>
                            {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X {product.Quantity}</BCText>*/}
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
                            <View style={[Styles.number,{flexDirection:'row'}]}>
                                <View style={{width:px2dp(14),height:px2dp(14),marginTop:px2dp(2),marginRight:px2dp(2),backgroundColor:'#d3f2e3',borderWidth:px2dp(0.5),borderColor:'#30ca80',borderRadius:2,alignItems:'center',justifyContent: 'center'}}>
                                    <BCText style={[gs.fts_12,{color:'#30ca80'}]}>订</BCText>
                                </View>

                                <BCText style={[gs.fts_13, gs.c_3a3838,]}>
                                    {/*¥{toDecimal2(product.Price*product.Quantity*product.UnitAmount)}/{toDecimal2(product.Quantity*product.UnitAmount)}斤*/}
                                    {toDecimal2(product.Quantity)}{product.DisplayUnit}({toDecimal2(product.Quantity*product.UnitAmount)}{product.Unit})
                                </BCText>
                            </View>
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
        //let PurchaseOrderId=this.props.PurchaseOrderId;
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


class Detail5 extends PullViewComponent {
    constructor(props) {
        super(props);
    }

    //设置页面标题
    setTitle() {
        return "订单详情(待发货)"
    }

    rightTitle() {
        return "完成"
    }

    //点击头部右边跳转页面
    onClickNavigationRight() {
        toastLong("编辑完成,保存成功")
    }

    RightType() {
        return true
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
                            <BCText style={[gs.fts_13, gs.c_fff, {marginLeft: px2dp(99)}]}>{Phone}</BCText>
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

    content() {
        const reduceSalesOrderDetail = this.props.ReduceSalesOrderDetail;
        if (reduceSalesOrderDetail.datas) {
            let datas = reduceSalesOrderDetail.datas;
            let Items = datas.PurchaseOrderLines;
            return (
                <View style={[gs.bgc_f2f1ef,{paddingBottom:'20%'}]}>
                    {this.renderAddress(datas.ContactName, datas.Phone, datas.Address)}
                    {/*订单*/}
                    <View style={[Styles.OrderNumber, gs.bgc_fff]}>
                        <BCText
                            style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(12)}]}>订单编号：{datas.SalesOrderNo}</BCText>
                        <BCText style={[gs.fts_12, gs.c_b7b7b7, {paddingLeft: px2dp(91)}]}>2017-03-24 17:59</BCText>
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
                        <BCText
                            style={[gs.fts_16, gs.c_888, {marginLeft: px2dp(7)}]}>{datas.BCompanyFullName}</BCText>
                    </View>
                    {/*订单及查看明细*/}
                    <RenderListItem
                        Company={Items}
                    />
                    {/*支付方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>支付方式</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>支付宝</BCText>
                    </View>
                    {/*配送方式*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>配送方式</BCText>
                        <View style={{flexDirection: 'row'}}>
                            <BCText style={[gs.fts_14, gs.c_888, {marginRight: px2dp(12)}]}>商家配送</BCText>
                            <BCText style={[gs.fts_13, gs.c_888, {marginRight: px2dp(12)}]}>￥0</BCText>
                        </View>
                    </View>
                    {/*买家留言*/}
                    <View style={[Styles.item, gs.bgc_fff, gs.bdc_e3e3e3]}>
                        <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(18)}]}>买家留言</BCText>
                        <TextInput style={[Styles.textInputStyle, gs.fts_14]}
                                   placeholder="特性需求在此输入"
                                   placeholderTextColor='#b7b7b7'/>
                    </View>
                    <View style={[Styles.count, gs.bgc_fff]}>
                        <BCText style={[gs.c_3a3838]}>共{Items.length > 0 ? Items.length : 0}件商品 合计:</BCText>
                        <BCText style={[gs.c_fd0319]}>￥{datas.Amount}</BCText>
                        <BCText style={[gs.c_3a3838, {marginRight: px2dp(12)}]}>(含配送费5元)</BCText>
                    </View>
                </View>
            );
        } else {
            return this.noRecord()
        }
    }

    Bottom() {
        const {ReduceSalesOrderDetail} = this.props;
        var Amount = 0;
        if (ReduceSalesOrderDetail.datas) {
            let lists = ReduceSalesOrderDetail.datas.PurchaseOrderLines;
            lists.map((list, index) => {
                Amount += list.Amount
            })
            return (
                this.renderBottom(Amount)
            )
        }
    }

    renderBottom(Amount) {
        return (
            <View style={Styles.footerWrap}>
                <View style={[Styles.singleFooter, gs.bdc_e3e3e3]}>
                    <View style={[Styles.money]}>
                        <BCText style={[gs.fts_16, {marginLeft: px2dp(12), color: '#ff162c'}]}>￥{Amount}元</BCText>
                        <BCText style={[gs.c_3a3838, gs.fts_12]}>（含配送费5元)</BCText>
                    </View>
                </View>
            </View>
        )
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
            this.setState({
                IsReceived: true,
            });
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
        marginRight: px2dp(8),
    },
    listItemRight: {
        justifyContent: "space-around",
        flex: 1
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
        flexDirection: 'row'
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
    priceInput:{
        width:px2dp(35),
        height:px2dp(15),
        margin:0,
        padding:0
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(45),
        justifyContent: 'flex-end',
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
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingRight: px2dp(9),
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
    }
})

function mapStateToProps(store) {
    //toastLong(JSON.stringify(store))
    return {
        ReduceSalesOrderDetail: store.ReduceSalesOrderDetail
    }
}
const connectDetail5 = connect(mapStateToProps)(Detail5);
connectDetail5.navigationOptions = NavigationOptions;
export default connectDetail5;
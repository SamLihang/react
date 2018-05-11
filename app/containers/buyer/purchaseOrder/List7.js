/**
 * Created by Administrator on 2017/4/10.
 */
//订单列表>已完成
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    InteractionManager,
    ListView,
    AsyncStorage
} from 'react-native';
import BaseComponent, {
    deviceWidth,
    px2dp,
    getFitPX,
    px2dpH,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import {toastLong,confirm,toastShort} from '../../../utils/ToastUtil';
import {PullListComponent} from '../../PageComponent'
import gs from '../../../styles/MainStyles';
import styles from './Styles';
import CheckBox from '../../../components/CheckBox';
import {formaTime,toDecimal2} from "../../../utils/FormatUtil";
import {
    ActionPurchaseOrders7,
    selectAll,
    selectOne,
    openDetail7,
    ActionPrintPurchaseOrder,
    ActionConfirmPay
} from '../../../actions/PurchaseOrderAction';
import { fetchConfirmPayUrl }from "../../../services/PurchaseOrderServices";
import {print} from '../../buyer/my/PrintSetup';

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
        Company: React.PropTypes.object,
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
            <View style={[styles.listItemFinish]} key={index}>
                {
                    product.Image!=null?
                        <BCHostImage style={styles.productImg}
                                     source={{uri: product.Image}}/>
                        :
                        <BCImage style={styles.productImg}
                                 source={require('../../../imgs/LOGO.png')} />
                }
                <View style={styles.listItemRight}>
                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{product.ProductName}</BCText>
                    {/*<BCText style={[gs.fts_13, gs.c_3a3838]}>{product.Spec}</BCText>*/}
                    <BCText style={[gs.fts_13, gs.c_3a3838]}>¥{toDecimal2(product.UnitAmount*product.Price)}/{product.DisplayUnit}({product.UnitAmount}{product.Unit})</BCText>
                    <View style={styles.listDetail}>
                        <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{toDecimal2(product.Price)}/{product.Unit}</BCText>
                        {
                            product.Price == product.OriginalPrice ?
                                (null) :
                                <View style={[styles.actIcon, gs.bgc_fd0319,]}>
                                    {product.Price > product.OriginalPrice ?
                                        <BCText style={[gs.fts_10, gs.c_fff]}>升</BCText>
                                        :
                                        <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>
                                    }
                                </View>
                        }

                        <View style={[styles.number,{flexDirection:'row'}]}>
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
                <View style={[styles.hengXian]}></View>
            </View>
        )
    }

    render() {
        const company = this.props.Company;
        let items = company.Items;
        let IsOpen = this.state.IsOpen;
        let PurchaseOrderId = this.props.PurchaseOrderId;
        let self = this;
        return (
            <View>
                <BCTouchable
                    onPress={() => {
                        this.ToPush(PurchaseOrderId)
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
                        <View style={styles.lookDetail}>
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
                        </View> : <View style={styles.lookDetail}></View>
                }
            </View>
        )
    }

}
class List7 extends PullListComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            isSelect: false,
            //isSelectAll: false,
            dataSource: []
        };
        this.isSelectAll=false;//是否全选
        this.selectList=[];
    }

    // static propTypes={
    //     DataSource:React.PropTypes.object.isRequired,
    //     HandleMaks:React.PropTypes.func.isRequired
    // }
    renderNavigator() {
        return null;
    }

    _CheckBoxList = [];
    _RenderListItem = [];
    _CheckBoxAll = {};

    renderRow(data) {
        const {dispatch} = this.props;
        this._CheckBoxList=[];
        let dataSource = this.state.dataSource;
        let loginEmployee = this.props.currentEmployee;
        let bCompanyId = loginEmployee.CompanyId;
        const item = data.item;
        const key = data.index;
        const PurchaseOrderId = item.PurchaseOrderId;
        let sCompanyId = item.SCompanyId;
        const SCompanyId = item.SCompanyId;
        var isOpen = item.IsOpen;
        var isSelect = item.IsSelect;
        var self = this;
        let DeliveryAmount = item.DeliveryAmount;
        return (
            <View style={[styles.outView, gs.bgc_fff]}>
                <View style={styles.finish}>

                    <CheckBox
                        ref={(c) => {
                            if (c != null) {
                                this._CheckBoxList.push(c);
                            }
                        }}
                        _product={item}
                        CompanyId={SCompanyId}
                        ProductId={PurchaseOrderId}
                        IsSelect={isSelect}
                        OnChange={(isSelect) => {
                            let key = key;
                            let boxProducts = this._CheckBoxList;
                            let i = 0;
                            boxProducts.map((Product, index) => {
                                if (Product.state.IsSelect) {
                                    i++;
                                    if (isSelect) {
                                        if (i + 1 > boxProducts.length) {
                                            this._CheckBoxAll.OnChange(isSelect);
                                            this.isSelectAll=isSelect;
                                        }
                                        //把选中的列表添加到新的数组
                                        this.selectList.push({
                                            PurchaseOrderId:Product.props.ProductId,
                                        });
                                        this.state.dataSource.map((data,index)=>{
                                            this.selectList.map((obj,index)=>{
                                                if(obj.PurchaseOrderId===data.PurchaseOrderId)
                                                    data.IsSelect=true;
                                            });
                                        });
                                    }
                                    else {
                                        if (i + 1 <= boxProducts.length) {
                                            this._CheckBoxAll.OnChange(isSelect);
                                            this.isSelectAll=isSelect;
                                        }
                                    }
                                }else {
                                    if (i + 1 <= boxProducts.length) {
                                        this._CheckBoxAll.OnChange(Product.state.IsSelect);
                                        this.isSelectAll=Product.state.IsSelect;
                                    }
                                    //把取消选中的列表删除到新的数组
                                    this.selectList.map((list,index)=>{
                                        if(list.PurchaseOrderId===Product.props.ProductId){
                                            this.selectList.splice(index,1);
                                            //state中的值也改为false;
                                            this.state.dataSource.map((data,index)=>{
                                                if(data.PurchaseOrderId===list.PurchaseOrderId){
                                                    data.IsSelect=false;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }}/>
                    <BCTouchable style={[styles.companyW]} onPress={() => {
                        this.push('CompanyDetial', {bCompanyId, sCompanyId})
                    }}>
                        <View style={{width:deviceWidth-px2dp(60), alignItems: 'center', flexDirection: "row",}}>
                            {
                                item.CompanyLogo!=null?
                                    <BCHostImage style={styles.companyImg}
                                                 source={{uri: item.CompanyLogo}}/>
                                    :
                                    <BCImage style={styles.productImg}
                                             source={require('../../../imgs/LOGO.png')} />
                            }
                             <BCText
                                style={[gs.fts_16, gs.c_888, {paddingLeft: px2dp(7)}]}>{substr(item.CompanyName, 11)}</BCText>
                            <BCImage source={require('../../../imgs/right1.png')} style={{marginLeft: px2dp(10)}}/>
                            <View style={ {position: 'absolute', right: px2dp(10)}}>
                                <BCText
                                    style={[gs.fts_12, gs.c_b7b7b7,]}>{formaTime(item.CreateTime, "MM-dd hh:mm")}</BCText>
                            </View>
                        </View>
                    </BCTouchable>
                </View>
                <RenderListItem
                    Company={item}
                    PurchaseOrderId={PurchaseOrderId}
                    key={key}
                    ref={(c) => {
                        if (c) {
                            this._RenderListItem.push(c);
                        }
                    }}
                    ToPush={() => {
                        this.toPush(PurchaseOrderId);
                    }}
                />
                <View style={styles.titleText}>
                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>共{this.itemNum(item.Items)}件商品
                        合计：</BCText>
                    <BCText style={[gs.fts_13, gs.c_fd0319]}>¥{toDecimal2(item.ActualAmount)}</BCText>
                    <BCText style={[gs.fts_13, gs.c_3a3838,]}>({DeliveryAmount ? '含配送费' + DeliveryAmount + '元' : '免配送费'})</BCText>
                </View>
                {/*{
                  item.PayType===1&&item.SettleTypeId===2&&item.SettleStatusId<5?
                      <View style={[styles.titleText, {borderTopWidth: 1, borderTopColor: '#f2f1ef'}]}>
                          <BCTouchable style={[styles.border, {borderColor: "#b0b1b6"}]} onPress={() => {
                              //关闭按钮的提示窗
                              let self = this;
                              confirm("确定要付款吗？", function () {
                                  const purchaseOrderId = item.PurchaseOrderId;
                                  dispatch(ActionConfirmPay({purchaseOrderId}));
                              }, function () {
                                  return false
                              });
                          }}>
                              <BCText style={[gs.fts_13, gs.c_3a3838,]}>确认付款</BCText>
                          </BCTouchable>
                      </View>:null
                }*/}
            </View>)
    }

    itemNum(items) {
        let num = 0;
        items.map((item, index) => {
            num += item.ActualQuantity;
        });
        return (
            <BCText>{num}</BCText>
        )
    }

    toPush(PurchaseOrderId) {
        this.push('PurchaseOrderDetail', {PurchaseOrderId, PurchaseOrderState: 7})
    }

    renderLine(item, index) {
        return (
            <View style={[styles.listItemFinish]} key={index}>

                {
                    item.Image!=null?
                        <BCHostImage style={styles.productImg}
                                     source={{uri: item.Image}}/>
                        :
                        <BCImage style={styles.productImg}
                                 source={require('../../../imgs/LOGO.png')} />
                }
                <View style={styles.listItemRight}>
                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{item.ProductName}</BCText>
                    <BCText style={[gs.fts_13, gs.c_3a3838]}>{item.Spec}</BCText>
                    <View style={styles.listDetail}>
                        <BCText style={[gs.fts_13, gs.c_fd0319,]}>¥{item.Price}/{item.Unit}</BCText>
                        {
                            item.Price == item.OriginalPrice ?
                                (null) :
                                <View style={[styles.actIcon, gs.bgc_fd0319,]}>
                                    {item.Price > item.OriginalPrice ?
                                        <BCText style={[gs.fts_10, gs.c_fff]}>升</BCText>
                                        :
                                        <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>
                                    }
                                </View>
                        }

                        <View style={styles.number}>
                            <BCText style={[gs.fts_11, gs.c_3a3838,]}>X{item.Quantity}</BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    Bottom() {
        const {ReducePurchaseOrders7} = this.props;
        //isSelectAll = ReducePurchaseOrders7.isSelectAll;
        const dataSource=this.state.dataSource;
        return (
            dataSource.length>0?
            <View style={styles.footer}>
                <View style={styles.allSelect}>
                    <CheckBox
                        ref={(c) => {
                            this._CheckBoxAll = c
                        }}
                        IsSelect={this.isSelectAll}
                        OnChange={(isSelect) => {
                            this.isSelectAll=isSelect;
                            let boxBoxList = this._CheckBoxList;
                            boxBoxList.map((data, index) => {
                                data.OnChange(isSelect);
                            });
                            if(isSelect){
                                if( this.selectList.length>0){
                                    this.selectList.splice(0,this.selectList.length);

                                }
                                //list.PurchaseOrderId===Product.props.ProductId
                                this.state.dataSource.map((data,index)=>{
                                    this.selectList.push({
                                        PurchaseOrderId:data.PurchaseOrderId,
                                    });
                                    data.IsSelect=true;
                                });

                            }else{
                                this.state.dataSource.map((data,index)=>{
                                    data.IsSelect=false;
                                });
                                this.selectList.splice(0,this.selectList.length);
                            }
                        }}/>
                    <BCText style={[gs.fts_14, gs.c_fff, {marginLeft: px2dp(9)}]}>全选</BCText>
                </View>
                <BCTouchable onPress={() => {
                    this.state.dataSource.map((data,index)=>{
                        data.IsSelect=false;
                    });
                    let printDate = [];
                    let boxBoxList = this._CheckBoxList;
                    boxBoxList.map((data, index) => {
                        if (data.state.IsSelect) {
                            printDate.push({
                                    CreateTime: data.props._product.CreateTime,
                                    CompanyName: data.props._product.CompanyName,
                                    Address:data.props._product.Address,
                                    Phone: data.props._product.Phone,
                                    bian:data.props._product.ActualAmount,
                                    ActualAmount:data.props._product.ActualAmount,
                                    Remark:data.props._product.Remark,
                                    OrderNo:data.props._product.PurchaseOrderNo,
                                    Items: data.props._product.Items,
                                }
                            )
                        }
                    });
                    // if (printDate.length > 0) {
                    //    {/* this.setState({
                    //         dataSource: this.state.dataSource
                    //     });*/}
                    //     this.isSelectAll = false;//是否全选
                    //     this.push("PrintSetup", printDate);
                    // } else {
                    //     toastShort("请选中需要打印的内容")
                    // }
                    if (printDate.length > 0) {
                        this.isSelectAll = false;//是否全选
                        if(BluetoothConnection){
                            print(printDate);
                        } else {
                            this.push("PrintSetup", printDate);
                        }
                    } else {
                        toastShort("请选中需要打印的内容")
                    }
                }} style={[styles.print, gs.bgc_31ca96]}>
                    <BCText style={[gs.fts_17, gs.c_fff,]}>打印</BCText>
                </BCTouchable>
            </View>:null
        )
    }

    selectOne(PurchaseOrderID, isSelectOne) {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch, ReducePurchaseOrders7} = this.props;
            dispatch(selectOne(PurchaseOrderID, isSelectOne));
            //console.log(isSelectOne);
            //console.log(ReducePurchaseOrders7.selectPurchaseOrders7Arr);
        });

    }

    selectAll() {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch, ReducePurchaseOrders7} = this.props;
            dispatch(selectAll(!isSelectAll));
        });
    }

    onOpen(PurchaseOrderID, isOpen) {
        InteractionManager.runAfterInteractions(() => {
            const {dispatch, ReducePurchaseOrders7} = this.props;
            dispatch(openDetail7(PurchaseOrderID, isOpen));
        });
    }

    keyExtractor(item, index) {
        return item.PurchaseOrderId
    }

    onRefersh() {
        const {dispatch} = this.props;
        this._page = 1;
        //更新状态
        this.state.dataSource.map((data,index)=>{
            data.IsSelect=false;
        });
        dispatch(ActionPurchaseOrders7({p: this._page, t: 7}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionPurchaseOrders7({p: this._page, t: 7}));
    }

    WillMount() {
        _CheckBoxList = [];
        _RenderListItem = [];
        _CheckBoxAll = {};
        const {dispatch} = this.props;
        dispatch(ActionPurchaseOrders7({p: this._page, t: 7}));
    }

    WillReceive(nextProps) {
        if (nextProps.ReducePurchaseOrders7.datas != null && nextProps.ReducePurchaseOrders7.datas != this.props.ReducePurchaseOrders7.datas) {
            const {ReducePurchaseOrders7} = nextProps;
            const purchaseOrders7 = ReducePurchaseOrders7.datas;
            let dataSource = this.state.dataSource;
            if (purchaseOrders7.length <= 0) {
                if (this._page === 1) {
                    dataSource = purchaseOrders7;
                }
                this.noMoreData('暂时没有您的订单记录喔～');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    purchaseOrders7.map((purchaseOrder) => {
                        dataSource.push(purchaseOrder)
                    })
                } else {
                    dataSource = purchaseOrders7;
                }
                if(purchaseOrders7.length===0){
                    this.isSelectAll=true;
                }else{
                    this.isSelectAll=false;
                }
            }
            //刷新为空
            if(this._page===1){
                this.isSelectAll=false;//是否全选
                this.selectList=[];
                this.state.dataSource=dataSource;
                this.state.dataSource.map((data,index)=>{
                    data.IsSelect=false;
                });
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(65) : px2dpH(65) ) - px2dpH(50) - px2dpH(30)
            });
        }
        if (nextProps.ReduceDetailsInspectionPurchaseOrder.datas != null && nextProps.ReduceDetailsInspectionPurchaseOrder.datas !== this.props.ReduceDetailsInspectionPurchaseOrder.datas) {
            this._Loading.Trigger(false);
            //toastShort("验货成功");
            const {dispatch} = this.props;
            this._page = 1;
            dispatch(ActionPurchaseOrders7({p: this._page, t: 7}));
        }
        if (nextProps.ReduceConfirmPay.datas != null && nextProps.ReduceConfirmPay.datas !== this.props.ReduceConfirmPay.datas) {
            toastLong("付款成功");
            const {dispatch} = this.props;
            this._page = 1;
            dispatch(ActionPurchaseOrders7({p: this._page, t: 7}));
        }
        if (nextProps.ReduceConfirmPay.error != null && nextProps.ReduceConfirmPay.error !== this.props.ReduceConfirmPay.error) {
            //toastLong("付款失败");
                //this._Loading.Trigger(false);
        }
    }
}

function mapStateToProps(store) {
    return {
        ReducePurchaseOrders7: store.ReducePurchaseOrders7,
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceDetailsInspectionPurchaseOrder:store.ReduceDetailsInspectionPurchaseOrder,
        ReduceConfirmPay:store.ReduceConfirmPay,
    }

}
const connectPurchaseOrders7 = connect(mapStateToProps)(List7);
connectPurchaseOrders7.navigationOptions = NavigationOptions;
export default connectPurchaseOrders7;
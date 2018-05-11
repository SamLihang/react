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
    substr
} from "../../../BaseComponent";
import {PullViewComponent,PullListComponent} from "../../PageComponent";
import {toastShort, confirm} from '../../../utils/ToastUtil';
import gs from "../../../styles/MainStyles";
import {BCServiceNavigator} from "../../../components/BCNavigator";
import CheckBox from "../../../components/CheckBox";
import {connect} from "react-redux";
import {ActionService} from "../../../actions/ServiceAction";
import {fetchRefusedToRefund} from '../../../services/SellerOrderServices'
import {ActionGetServiceorderdetail} from '../../../actions/PurchaseOrderAction'
import {toDecimal2, formaTime} from "../../../utils/FormatUtil";

import styles from '../order/Styles';

//遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.totalPrice = 0
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
        _changeText: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    _CheckBoxList = [];
    _CheckBoxAll = null;

    refeshView(msg) {
        const {dispatch} = this.props;
        dispatch(ActionService());
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={{
                    zIndex: 1000,
                    position: 'absolute',
                    bottom: Platform.OS == 'ios' ? (deviceHeight - px2dpH(165)) / 2 : (deviceHeight - px2dpH(165)) / 3,
                    left: px2dp(58),
                    width: px2dp(260),
                    backgroundColor: '#f0f0f0',
                    borderRadius: px2dp(10),
                    height: px2dpH(165)
                }}>
                    <View style={{borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb',}}>
                        <BCText style={[gs.fts_17, gs.c_3a3838, {marginTop: px2dpH(20), marginLeft: px2dp(50)}]}>请输入拒绝申请原因</BCText>
                        <TextInput
                            style={Styles.InputStyle}
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={{flexDirection: 'row', paddingTop: px2dp(10)}}>
                        <BCTouchable onPress={() => this.props.Cancle()}
                                     style={{justifyContent: 'center', alignItems: 'center', width: px2dp(130)}}>
                            <BCText style={[gs.fts_16, gs.c_888]}>取消</BCText>
                        </BCTouchable>
                        <View style={{width: 0.5, height: px2dp(32), backgroundColor: '#dbdbdb'}}></View>
                        <BCTouchable style={{justifyContent: 'center', alignItems: 'center', width: px2dp(130)}}>
                            <BCText style={[gs.fts_16, gs.c_00C164]}>确定</BCText>
                        </BCTouchable>
                    </View>
                </View> : (null)
        )
    }
}

class ServiceManagement extends PullListComponent {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            dataSource: []
        };
        this.isSelectAll=false;//是否全选
        this.selectList=[];
    }

    //设置页面标题
    setTitle() {
        return "售后管理"
    }

    onClickNavigationRight() {
        this.push('HistoricalService')
    }

    renderNavigator() {
        return (
            <BCServiceNavigator navigation={this.props.navigation}
                                title={this.setTitle()}
                                OnBack={() => {
                                    const {navigation} = this.props;
                                    if (navigator) {
                                        navigation.goBack();
                                    }
                                }}
                                OnClick={() => {
                                    this.onClickNavigationRight()
                                }}
            />
        )
    }

    _RenderListItem = [];
    _CheckBoxList = [];
    _CheckBoxAll = null;

    _ToPayMaks = null;

    renderRow(data) {
        this._CheckBoxList = [];
        let list = data.item;
        let key = data.index;
        let purchaseOrderNo = list.PurchaseOrderNo;
        let sCompanyName = list.SCompanyName;
        let bCompanyName = list.BCompanyName;
        let amount = list.Amount;
        let serviceOrderNo = list.ServiceOrderNo;
        let serviceOrderId = list.ServiceOrderId;
        let bLogoImage = list.BLogoImage;
        let isSelect = list.IsSelect;

        const dataSource = this.state.dataSource;
        switch (list.CheckState) {
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
            <View style={Styles.topStyle} key={key}>
                <View>
                    <View style={[Styles.stateStyle, gs.bgc_fff]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox
                                ref={(c) => {
                                    if (c != null) {
                                        this._CheckBoxList.push(c);
                                    }
                                }}
                                serviceOrderId={serviceOrderId}
                                IsSelect={isSelect}
                                Key={serviceOrderId}
                                Amount={amount}
                                checked={require('../../../imgs/onSelect.png')}
                                OnChange={(isSelect) => {
                                    let boxProducts = this._CheckBoxList;
                                    let i = 0;
                                    boxProducts.map((Product, index) => {
                                        if (Product.state.IsSelect) {
                                            i++;
                                            if (isSelect){
                                                if (i + 1 > boxProducts.length) {
                                                    this._CheckBoxAll.OnChange(isSelect);
                                                    this.isSelectAll=isSelect;
                                                }
                                                //把选中的列表添加到新的数组
                                                this.selectList.push({
                                                    serviceOrderId:Product.props.serviceOrderId
                                                });
                                                this.selectList.newArr();
                                                this.state.dataSource.map((data,index)=>{
                                                    this.selectList.map((obj,index)=>{
                                                        if(obj.serviceOrderId===data.serviceOrderId)
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
                                        } else {
                                            if (i + 1 <= boxProducts.length) {
                                                this._CheckBoxAll.OnChange(Product.state.IsSelect);
                                                this.isSelectAll=Product.state.IsSelect;
                                            }
                                            //把取消选中的列表删除到新的数组
                                            this.selectList.newArr();
                                            this.selectList.map((list,index)=>{
                                                if(list.serviceOrderId===Product.props.serviceOrderId){
                                                    this.selectList.splice(index,1);
                                                    this.state.dataSource.map((data,index)=>{
                                                        if(data.serviceOrderId===list.serviceOrderId){
                                                            data.IsSelect=false;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }}
                            />
                            <BCText style={[gs.fts_14, gs.c_b7b7b7]}>订单编号:</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_14, {marginLeft: px2dp(5)}]}>
                                {purchaseOrderNo}
                            </BCText>
                        </View>
                        <BCText style={{marginRight: px2dp(14)}}>
                            <BCText style={[gs.fts_14, {color: '#fd827c'}]}>{statusData}</BCText>
                        </BCText>
                    </View>
                    <BCTouchable style={[Styles.causeStyle, gs.bgc_fff]}
                                 onPress={() => {
                                     this.push('SellerServiceDetail', {
                                         serviceOrderId,
                                         callBack: this.onRefersh.bind(this)
                                     })
                                 }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: px2dp(13),
                            marginLeft: px2dp(14)
                        }}>
                            <BCHostImage style={{width: px2dp(29), height: px2dp(29)}}
                                         source={{uri: bLogoImage}}/>
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
                            <BCTouchable onPress={() => {
                                this.push('SellerServiceDetail', {
                                    serviceOrderId,
                                    callBack: this.onRefersh.bind(this)
                                })
                            }} style={{flexDirection: 'row', alignItems: 'center', marginRight: px2dp(16)}}>
                                <BCText style={[gs.c_b7b7b7, gs.fts_13, {marginRight: px2dp(3)}]}>
                                    详情
                                </BCText>
                                <BCImage source={require('../../../imgs/right1.png')}/>
                            </BCTouchable>
                        </View>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    //计算价格
    calculatePrice() {
        let totalPrice = 0;
        let boxBoxList = this._CheckBoxList;
        let newlist = [];
        boxBoxList.map((list, index) => {
            if (list.state.IsSelect) {
                newlist.push(list)
            }
        });

        newlist.forEach((item, index) => {
            totalPrice += item.props.data.Amount
        })

        this.totalPrice = toDecimal2(totalPrice);
    }



    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    maksContent() {
        return (
            <View>
                <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                           Cancle={() => {
                               this._Maks.Trigger(false);
                               this._ToPayMaks.Trigger(false);
                           }}
                />
            </View>
        )
    }

    Bottom() {
        this._CheckBoxAll=null;
        const dataSource=this.state.dataSource;
        return (
            dataSource.length>0?
            <View style={Styles.footerWrap}>
                <View style={styles.allSelect3}>
                    <CheckBox
                        checked={require('../../../imgs/onSelect.png')}
                        ref={(c) => {
                            if(c!==null){
                                this._CheckBoxAll = c
                            }
                        }}
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
                                this.state.dataSource.map((data,index)=>{
                                    this.selectList.push({
                                        serviceOrderId:data.serviceOrderId,
                                    });
                                    data.IsSelect=true;
                                });

                            }else{
                                this.state.dataSource.map((data,index)=>{
                                    data.IsSelect=false;
                                });
                                this.selectList.splice(0,this.selectList.length);
                            }
                        }}
                    />
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(0)}]}>全选</BCText>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <BCTouchable style={Styles.agreeBtn} onPress={() => {
                        confirm('同意售后?', this.onAgreeConfirm.bind(this), this.onCancle)
                    }}>
                        <BCText style={[gs.fts_16, gs.c_fff]}>同意</BCText>
                    </BCTouchable>
                    <BCTouchable onPress={() => {
                        confirm('拒绝售后?', this.onRefusedConfirm.bind(this), this.onCancle)
                    }} style={Styles.refuseBtn}>
                        <BCText style={[gs.fts_16, gs.c_fff]}>拒绝</BCText>
                    </BCTouchable>
                </View>
            </View>:null
        )
    }

    onAgreeConfirm() {
        let boxProducts = this._CheckBoxList;
        var serviceOrderIds = [];
        let totalPrice = 0;
        let lists = this.state.dataSource;
        boxProducts.map((product, index) => {
            lists.map((data, i) => {
                if (product.state.IsSelect && data.ServiceOrderId === product.props.serviceOrderId) {
                    serviceOrderIds.push(product.props.serviceOrderId);
                    //alert(product.props.Amount);
                    totalPrice += product.props.Amount;
                }
            });
        });
        if (serviceOrderIds.length>0) {
            this.push('ServicePayable', {
                title: '售后结算',
                serviceOrderIds: serviceOrderIds,
                allAmounts: toDecimal2(totalPrice),
                callBack: this.onRefersh.bind(this)
            });
        }else{
            toastShort("请选择要同意退款的买家");
        }
    }

    onRefusedConfirm() {
        let boxProducts = this._CheckBoxList;
        var serviceOrderIds = [];
        let lists = this.state.dataSource;
        boxProducts.map((product, index) => {
            lists.map((data, i) => {
                if (product.state.IsSelect && data.ServiceOrderId === product.props.serviceOrderId) {
                    serviceOrderIds.push(product.props.serviceOrderId);
                }
            });
        });

        if(serviceOrderIds.length>0) {
            fetchRefusedToRefund(serviceOrderIds).then((ret) => {
                if (ret.data.success == 0) {
                    toastShort("拒绝退款成功")
                }
                else {
                    toastShort("拒绝失败,请刷新重试")
                }
                this.onRefersh();
            }).catch((e) => {
            });
        }else{
            toastShort("请选择要拒绝退款的买家");
        }
    }
    keyExtractor(item, index) {
        return item.serviceOrderId
    }

    WillMount() {
        const {dispatch} = this.props;
        this._page = 1;
        dispatch(ActionService(this._page));
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionService(this._page));
        let Data=this.selectList;
    }

    onRefersh() {
        const {dispatch} = this.props;
        this._page = 1;
        this.state.dataSource.map((data,index)=>{
            data.IsSelect=false;
        });
        dispatch(ActionService(this._page));

    }

    onCancle() {

    }

    WillReceive(nextProps) {
        if (nextProps.ReduceServiceManage.datas && nextProps.ReduceServiceManage.datas !== this.props.ReduceServiceManage.datas) {

            const {ReduceServiceManage} = nextProps;
            const sellerSalesOrders1 = ReduceServiceManage.datas;
            let dataSource = this.state.dataSource;

            if (sellerSalesOrders1.length <= 0) {
                this.noMoreData('暂无数据');
            } else {
                if (this._page > 1 || dataSource.length <= 0) {
                    sellerSalesOrders1.map((purchaseOrder) => {
                        dataSource.push(purchaseOrder)
                    });

                } else {
                    dataSource = sellerSalesOrders1
                }
                if(sellerSalesOrders1.length===0){
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
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(65) : px2dpH(90))
            });

           // alert(deviceWidth+'*'+ deviceHeight);
        }
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
        height: px2dpH(41),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    causeStyle: {
        width: px2dp(347),
        height: px2dpH(115),
        borderBottomLeftRadius: px2dp(4),
        borderBottomRightRadius: px2dp(4),
        marginTop: px2dpH(1),
    },
    footerWrap: {
        // width: deviceWidth,
        // height: px2dpH(45),
        // borderTopWidth: 1,
        // borderTopColor: '#e3e3e3',
        // backgroundColor: '#fff',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        // flexDirection: 'row',

        width: '100%',
        height: px2dp(46),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'

    },
    agreeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2dcba0',
        width: px2dp(95),
        height: px2dpH(45)
    },
    refuseBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fd0319',
        width: px2dp(95),
        height: px2dpH(45)
    },
    InputStyle: {
        width: px2dp(210),
        height: px2dpH(32),
        borderWidth: 0.5,
        borderColor: '#c8c8c8',
        marginTop: px2dpH(15),
        marginLeft: px2dp(25),
        padding: 0,
        marginBottom: px2dp(25)
    },

});

function mapStateToProps(store) {
    return {
        ReduceServiceManage: store.ReduceServiceManage
    }
}

const ReduceServiceList = connect(mapStateToProps)(ServiceManagement);
ReduceServiceList.navigationOptions = NavigationOptions;
export default ReduceServiceList;
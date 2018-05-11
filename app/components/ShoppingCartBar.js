import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {BCImage, BCText, BCTouchable, px2dp, substr} from "../BaseComponent";
import gs from "../styles/MainStyles";
import {toDecimal2} from '../utils/FormatUtil';
import {toastShort} from "../utils/ToastUtil";
import {deviceWidth} from "../utils/CommonFuns";

export default class ShoppingCartBar extends Component {
    _Products = {}

    static defaultProps = {
        TotalCount: 0,
        TotalPrice: 0,
        Items: [],
        Provider: {},
        deliver: 0,
    };
    static propTypes = {
        TotalCount: React.PropTypes.number,
        TotalPrice: React.PropTypes.number,
        Items: React.PropTypes.array,
        OnOpenMask: React.PropTypes.func,
        OnBuy: React.PropTypes.func,
        OnListsItemsChange: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            totalCount: props.TotalCount,
            Items: props.Items,
            totalPrice: props.TotalPrice,
            Provider: props.Provider,
            markedWord: '',
        }
    }

    resetItems(items) {
        this.setState({
            Items: items
        })
    }

    //设置Quantity
    SetTotalCount(type, ProductObj, product) {
        if (!product === null) {
            this._Products[ProductObj.ProductGlobalId + '-' + ProductObj.SpecId] = product;
        }

        let Items = this.state.Items;

        if (Items.length) {
            //找到操作的哪一个
            const index = Items.findIndex(item => item.ProductGlobalId == ProductObj.ProductGlobalId && item.SpecId == ProductObj.SpecId);

            //如果找到了
            if (index >= 0) {
                //计算差值
                let b = ProductObj.Quantity - Items[index].Quantity;
                //更新之前的item
                Items[index] = ProductObj;
                //判断Quantity是否为0了
                if (!ProductObj.Quantity) {
                    Items.splice(index, 1)
                    this.props.OnListsItemsChange(this.state.Items)
                }
                //计算更新totalCount
                let totalCount = this.state.totalCount + b;
                if (!totalCount) {
                    totalCount = 0;
                }
                this.setState({
                    totalCount: totalCount
                })

                /*if (type == 'add') {
                 Items[index] = ProductObj
                 this.setState({
                 totalCount: ++this.state.totalCount
                 })
                 }//减减
                 else if (type == 'reduce') {
                 Items[index] = ProductObj
                 if (!Items[index].Quantity) {
                 Items.splice(index, 1)
                 this.props.OnListsItemsChange(this.state.Items)
                 }
                 this.setState({
                 totalCount: --this.state.totalCount
                 }, () => {
                 this.state.totalCount ? null : this.props.closeMask()
                 })

                 }
                 else if (type == 'input') {
                 let b = ProductObj.Quantity - Items[index].Quantity;
                 Items[index].Quantity = ProductObj.Quantity;
                 if (!Items[index].Quantity) {
                 Items.splice(index, 1)
                 this.props.OnListsItemsChange(this.state.Items)
                 }
                 this.setState({
                 totalCount: this.state.totalCount + b
                 })
                 }*/
            }
            else {
                Items.push(ProductObj);

                this.setState({
                    totalCount: this.state.totalCount + ProductObj.Quantity
                })
            }
        }
        else {
            Items.push(ProductObj)
            this.setState({
                totalCount: ProductObj.Quantity
            })
        }

        //计算价格
        this.calculatePrice()
    }

    //计算价格
    calculatePrice() {
        let totalPrice = 0;
        this.state.Items.forEach((item, index) => {
            if (item.DisplayUnitTypeId == 2) {
                totalPrice += item.Price * item.Quantity * item.UnitAmount
            }
            else {
                totalPrice += item.Price * item.Quantity
            }

        })
        this.setState({
            totalPrice: toDecimal2(totalPrice)
        })
        this.jundgeDelivery()
    }

    //判断配送达到
    jundgeDelivery(){
        let markedWord= '';
        let deliver = this.props.DeliveryAmount;
        if(this.state.totalPrice){
            if(this.state.totalPrice>=this.props.StartPrice){
                if(this.state.totalCount>=this.props.StartQuantity){
                    markedWord = '';
                    deliver = 0;
                }else{
                    markedWord = '还差'+(this.props.StartQuantity-this.state.totalCount)+'件免运费～'
                }
            }else {
                markedWord = '还差￥'+toDecimal2(this.props.StartPrice-this.state.totalPrice)+'免运费～'
            }
        }else{
            if(this.props.StartPrice){
                markedWord = '￥'+toDecimal2(this.props.StartPrice)+'免运费～'
            }else if(this.props.StartQuantity) {
                markedWord = this.props.StartQuantity + '件免运费～'
            }else{
                markedWord = '';
                deliver = 0;
            }
        }
        this.setState({
            markedWord:markedWord,
            deliver:deliver
        })
    }

    //开启弹窗
    _onOpenMask() {
        this.setState(() => {
            this.props.OnOpenMask(this.state.totalCount, this.state.Items, this._Products)
        })
    }

    //去结算
    _onBuy() {
        this.setState(() => {
            this.props.OnBuy()
        })
    }

    render() {
        let uri1 = require('../imgs/ic_go_shoppingCart.png');

        let text = this.state.deliver ? '(配送费'+this.props.DeliveryAmount+'元)' : '(免配送费)';
        // if (this.props.StartQuantity) {
        //     text = this.state.totalCount >= this.props.StartQuantity ? '（免配送费）' : '（含配送费' + this.props.DeliveryAmount + '元）'
        // }
        // if (this.props.StartPrice) {
        //     text = this.state.totalPrice >= this.props.StartPrice ? '（免配送费）' : '（含配送费' + this.props.DeliveryAmount + '元）'
        // }

        // return (
        //     <View style={styles.footerWrap}>
        //         <BCTouchable style={[styles.cartImg]} onPress={() => this._onOpenMask()}>
        //             <BCImage style={[{width: px2dp(49), height: px2dp(49)}]}
        //                      source={this.state.totalCount ? uri1 : uri2}/>
        //             {
        //                 this.state.totalCount ?
        //                     <View style={[styles.num, gs.bgc_fd0319,]}>
        //                         <BCText style={[gs.fts_10, gs.c_fff]}>{substr(this.state.totalCount + '', 5)}</BCText>
        //                     </View> :
        //                     (null)
        //             }
        //         </BCTouchable>
        //         {
        //             this.state.totalCount ?
        //                 <View style={styles.footer}>
        //                     <View style={[styles.money]}>
        //                         <BCText
        //                             style={[gs.c_fff, gs.fts_16]}>￥{substr(this.state.totalPrice + '', 12)}元</BCText>
        //                         <BCText style={[gs.c_b7b7b7, gs.fts_12]}>{text}</BCText>
        //                     </View>
        //                     < BCTouchable style={[gs.bgc_00c164, styles.pay]} onPress={() => this._onBuy()}>
        //                         <BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText>
        //                     </BCTouchable>
        //                 </View> :
        //                 <View style={styles.noProducts}>
        //                     <BCText style={[gs.c_fff, gs.fts_14]}>请选购食材</BCText>
        //                     <BCText style={[gs.c_b7b7b7, gs.fts_12]}>(免配送费)</BCText>
        //                 </View>
        //         }
        //     </View>
        // )
        return(
            <View style={{width:deviceWidth,height:px2dp(68),position:'absolute',bottom:0,left:0, zIndex:10}}>
                {this.state.totalCount&&this.state.deliver?<View style={{width:deviceWidth,height:px2dp(22),backgroundColor:'rgba(251,247,215,.9)',justifyContent:'center',alignItems:'center',borderWidth:.5,borderColor:'#ffed9c'}}>
                    <BCText>{this.state.markedWord}</BCText>
                </View>:null}
                <View style={styles.footerWrap}>
                    <BCTouchable style={[styles.cartImg]} onPress={() => this._onOpenMask()}>
                        <BCImage style={[{width: px2dp(15), height: px2dp(17)}]}
                                 source={uri1}
                                 resizeMode = "contain"/>
                        <BCText style={[gs.fts_10,gs.c_999]}>购物车</BCText>
                        {
                            this.state.totalCount ?
                                <View style={[styles.num, gs.bgc_fd0319]}>
                                    <BCText style={[gs.fts_9, gs.c_fff]}>{substr(this.state.totalCount + '', 5)}</BCText>
                                </View> :
                                (null)
                        }
                    </BCTouchable>
                    {
                        <View style={styles.footer}>
                           {
                                this.state.totalCount?
                                    <View style={[styles.money]}>
                                <View style={{flexDirection:'row'}}>
                                    <BCText style={[gs.c_333,gs.fts_16]}>合计</BCText>
                                    <BCText style={[gs.c_fd3547, gs.fts_16]}>￥{substr(this.state.totalPrice + '', 12)}元</BCText>
                                </View>
                                    <BCText style={[gs.c_666, gs.fts_12]}>{text}</BCText>
                                    </View>
                                    :null}
                            <BCTouchable style={[gs.bgc_31ca96,{width:px2dp(95),height:'100%',justifyContent:'center',alignItems:'center'}]}
                                          onPress={() => this._onBuy()}>
                                <BCText style={[gs.c_fff,gs.fts_17]}>去购物车</BCText>
                            </BCTouchable>
                        </View>
                    }
                </View>
            </View>
        )
    }

    componentWillMount(){
        this.jundgeDelivery()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.TotalCount != null && nextProps.TotalCount != this.state.totalCount) {
            this.setState({
                totalCount: nextProps.TotalCount,
                Items: nextProps.Items,
                totalPrice: nextProps.TotalPrice,
            }, () => {
                this.props.OnListsItemsChange(nextProps.Items)
            });
        }
    }
}

const styles = StyleSheet.create({
    footerWrap: {
        width: '100%',
        height: px2dp(46),
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
        zIndex: 5
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        borderTopColor: '#eee',
        borderTopWidth: 1,
    },
    noProducts: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        backgroundColor: '#202020',
        paddingLeft: px2dp(80),
        alignItems: 'center'
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    money: {
        height: '100%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: px2dp(9),
    },
    cart: {
        flex: 1,
        paddingLeft: px2dp(18),
        justifyContent: 'center',
        zIndex: 2,
    },
    cartImg: {
        position: 'absolute',
        width:px2dp(45),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    num: {
        minWidth: px2dp(15),
        height: px2dp(15),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: px2dp(0),
        right: px2dp(3),
        borderRadius: px2dp(9),
    },
});
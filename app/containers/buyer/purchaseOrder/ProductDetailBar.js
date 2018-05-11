/**
 * Created by Administrator on 2017/5/16.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BCTouchable, BCImage, px2dp, BCText, NavigationOptions, BCHostImage} from '../../../BaseComponent'
import gs from '../../../styles/MainStyles';
import {toDecimal2} from '../../../utils/FormatUtil';

export default  class ProductDetailBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCount: props.TotalCount,
            totalPrice: props.TotalPrice,
            Items: props.Items,
            Push:props.Push,
        }
    }

    _Product = {}
    static defaultProps = {
        TotalCount: 0,
        TotalPrice: 0,
        Items: [],
    };
    static propTypes = {
        TotalPrice: React.PropTypes.number,
        TotalCount: React.PropTypes.number,
        OnBuy: React.PropTypes.func,
        OnListsItemsChange: React.PropTypes.func,
        ToShoppingCar: React.PropTypes.func,
        Items: React.PropTypes.array,
        Push:React.PropTypes.func,
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            totalCount: nextProps.TotalCount,
            totalPrice: nextProps.TotalPrice,
            Items:nextProps.Items,
            push:nextProps.push,
        })
    }
    //设置Quantity
    SetTotalCount(type, ProductObj, product) {
        //this._Product[ProductObj.ProductId] = product;
        let Items = this.state.Items;

        if (Items.length) {
            //找到操作的哪一个
            const index = Items.findIndex(
                item =>
                item.SpecId === ProductObj.SpecId);
            //如果找到了
            if (index >= 0) {
                //加加
                if (type === 'add') {
                    Items[index].Quantity++;
                    this.setState({
                        totalCount: ++this.state.totalCount
                    })
                }//减减
                else if (type === 'reduce') {
                    Items[index].Quantity--;
                    this.setState({
                        totalCount: --this.state.totalCount
                    })
                }
                //切换
                else if (type === 'ban') {
                    if (Items[index].Quantity === 0) {
                        this.setState({
                            totalCount: 0
                        })
                    } else {
                        this.setState({
                            totalCount: Items[index].Quantity,
                        })
                    }
                }
                else if (type === 'input') {
                    let b = ProductObj.Quantity - Items[index].Quantity;
                    Items[index].Quantity = ProductObj.Quantity;
                    this.setState({
                        totalCount: this.state.totalCount + b
                    })
                }
            }
            /*else {
             Items.push(ProductObj);
             this.setState({
             totalCount: ++this.state.totalCount
             })
             }*/
        }
        /* else {
         Items.push(ProductObj);
         this.setState({
         totalCount: ++this.state.totalCount
         })
         }*/
        this.calculatePrice(ProductObj.Quantity, ProductObj.Price, ProductObj.SpecId)
    }

    //计算价格
    calculatePrice(Quantity, Price ,SpecId) {
        let totalPrice = 0;
        let Spec =this.state.Items;
        const index = Spec.findIndex(
            item =>
            item.SpecId === SpecId);
        if(Spec[index].DisplayUnitTypeId===2){
            totalPrice = toDecimal2(Price) * Quantity*Spec[index].UnitAmount;
        }else{
            totalPrice = toDecimal2(Price) * Quantity;
        }
        this.setState({
            totalPrice: toDecimal2(totalPrice)
        })
    }

    //去购物车
    _ToCar() {
        this.props.ToShoppingCar();
    }
    _Push(){
        this.props.Push();
    }

    render() {
        let url1 = require('../../../imgs/shop.png');
        let url2 = require('../../../imgs/Shopping.png');
        return (
            <View style={styles.footerWrap}>
                <BCTouchable style={[{position:'absolute',alignItems:'center',bottom:px2dp(5),left:px2dp(15),zIndex:12}]}
                            onPress={()=>{
                                this._Push()
                            }}
                >
                    <BCImage style={[{width: px2dp(20), height: px2dp(20)}]}
                             // source={this.state.totalCount ? url1 : url2}
                        source={url1}
                    />
                    <BCText style={{height:px2dp(15),fontSize:px2dp(11),color:'#999',}}>店铺</BCText>
                    {/*{*/}
                        {/*this.state.totalCount ?*/}
                            {/*<View style={[styles.num, gs.bgc_fd0319,]}>*/}
                                {/*<BCText style={[gs.fts_10, gs.c_fff]}>{this.state.totalCount}</BCText>*/}
                            {/*</View> : null*/}
                    {/*}*/}
                </BCTouchable>

                {
                    this.state.totalCount ?
                        <View style={styles.footer}>
                            <View style={[styles.money,{flex:1,flexDirection:'row',justifyContent:'flex-end'}]}>
                                <BCText style={[gs.c_000, gs.fts_18]}>合计</BCText>
                                <BCText style={[gs.c_fd0319, gs.fts_16]}>￥{this.state.totalPrice}元</BCText>
                            </View>
                            <BCTouchable style={[styles.car]}
                                         onPress={() => this._ToCar()}>
                                <BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText>
                            </BCTouchable>
                            {/*  <BCTouchable style={[gs.bgc_fd0319, styles.pay]}><BCText style={[gs.c_fff, gs.fts_17]}>去结算</BCText></BCTouchable>*/}
                        </View> :
                        <View style={styles.footer}>
                            <View style={{backgroundColor:'#6a6a6a',width:px2dp(95),alignItems:'center',justifyContent:'center',height:'100%'}}>
                                <BCText style={[gs.c_fff, gs.fts_14]}>请+食材数量</BCText>
                            </View>
                           {/* <BCText style={[gs.c_b7b7b7, gs.fts_12]}>(免配送费)</BCText>*/}
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    //底部
    footerWrap: {
        width: '100%',
        height: px2dp(66),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex:1,
        justifyContent: 'flex-end',
        zIndex: 2,

    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: "#eee"
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    car: {
        width: px2dp(95),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#31ca96"
    },
    money: {
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingRight: px2dp(9),
    },
    cart: {
        flex: 1,
        paddingLeft: px2dp(18),
        justifyContent: 'center',
        zIndex: 5,
    },
    cartImg: {
        position: 'absolute',
        // bottom: px2dp(17),
        left: px2dp(18),
        zIndex: 6,
    },
    num: {
        minWidth: px2dp(18),
        height: px2dp(11),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 1,
        right: 0,
        paddingHorizontal: px2dp(4),
        borderRadius: px2dp(9),
    },


});
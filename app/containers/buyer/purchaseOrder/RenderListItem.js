/**
 * Created by Administrator on 2017/5/12.
 */

//订单列表>除已完成外其余四项

import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {BCTouchable,BCImage,px2dp,BCText,NavigationOptions,BCHostImage} from '../../../BaseComponent'
import gs from '../../../styles/MainStyles';
import {formaTime,toDecimal2} from "../../../utils/FormatUtil";
import styles from './Styles';
export default  class RenderListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsOpen: false,
            ToPush:props.ToPush,
            isFinish:false,
        }
    }

    static propTypes = {
        Company: React.PropTypes.object,
        PurchaseOrderId:React.PropTypes.number,
        ToPush:React.PropTypes.func,
        isFinish:React.PropTypes.bool,
        PurchaseOrderLineId:React.PropTypes.number,
        BCompanyId:React.PropTypes.number,
        ActualQuantity:React.PropTypes.number,
    };
    static defaultProps = {
        Company: {},
        PurchaseOrderId:0,
    };

    //点击跳转
    ToPush(PurchaseOrderId){
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
    onChangeIsFinish(one){
        this.setState({
            isFinish:one,
            });
    }

    //每行的商品
    renderProductItem(product, index) {
        return (
            <View style={this.state.isFinish?[styles.listItemFinish]:[styles.listItem]} key={index}>
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
                            {/*<BCText style={[gs.fts_13, gs.c_3a3838,]}>X{product.ActualQuantity}</BCText>*/}
                        </View>
                    </View>
                </View>
                <View style={[styles.hengXian,{left:px2dp(12),width:px2dp(336)}]}></View>
            </View>
        )
    }

    render() {
        const company = this.props.Company;
        let items = company.Items;
        let IsOpen = this.state.IsOpen;
        let PurchaseOrderId=this.props.PurchaseOrderId;
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

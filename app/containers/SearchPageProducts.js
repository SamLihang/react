/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Keyboard, ScrollView
} from 'react-native';
// import {PullViewComponent} from './PageComponent';
import PageComponent, {PullViewComponent, PullListComponent} from './PageComponent'
import BaseComponent,{deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr, deviceHeight, BCHostImage} from '../BaseComponent';
import gs from '../styles/MainStyles';
import SearchInputBar from '../components/SearchInputBar';
import {toastShort} from '../utils/ToastUtil';
import {SearchPageCalculate,Calculate} from '../components/Calculate';
import {fetchShoppingCarts,fetchDeleteShoppingCarts, fetchInsertOrUpdateShoppingCart} from "../services/ShoppingCartServices";
import {ActionShoppingCarts, UpdateCar} from "../actions/ShoppingCartAction";
import {toDecimal2} from '../utils/FormatUtil'

import {ActionLoaderProducts, ActionProducts} from '../actions/ProductAction';
import {fetchProducts, fetchMallProducts, fetchReplenishProducts} from '../services/ProductServices';
import {fetchAlwaysBuy} from '../services/AlwaysBuytServices';
import {connect} from 'react-redux';

class SearchPageProducts extends PullViewComponent {
    static defaultProps = {};
    static propTypes = {
        backCallBack: React.PropTypes.func,
        goSearch: React.PropTypes.func,
    }

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            searchKey:null
        }
    }

    renderTop() {
        return (
            <SearchInputBar
                onChangeText={(text) => {
                    if (text) {
                        this.state.searchKey = text;
                        //0采购 1自营 2补货 -1常购
                        switch (this.GlobalData.productType) {
                            case -1:
                                //采购
                                fetchAlwaysBuy(
                                    null,
                                    null,
                                    text
                                ).then((ret) => {
                                    if (ret.data.Products && this.state.searchKey == text) {
                                        this.setState({
                                            dataSource: ret.data.Products
                                        })
                                    }
                                }).catch((e) => {

                                });
                                break;
                            case 0:
                                //采购
                                fetchProducts({
                                    productType: this.GlobalData.productType,
                                    sCompanyId: this.GlobalData.sCompanyId,
                                    priceGroupId: this.GlobalData.priceGroupId,
                                    searchKey: text
                                }).then((ret) => {
                                    if (ret.data.Products && this.state.searchKey == text) {
                                        this.setState({
                                            dataSource: ret.data.Products
                                        })
                                    }
                                }).catch((e) => {

                                });
                                break;
                            case 1:
                                //自营
                                fetchMallProducts({
                                    searchKey: text
                                }).then((ret) => {
                                    if (ret.data.Products && this.state.searchKey == text) {
                                        this.setState({
                                            dataSource: ret.data.Product
                                        })
                                    }
                                }).catch((e) => {

                                });
                                break;
                            case 2:
                                //补货
                                fetchReplenishProducts({
                                    productType: this.GlobalData.productType,
                                    sCompanyId: this.GlobalData.sCompanyId,
                                    priceGroupId: this.GlobalData.priceGroupId,
                                    searchKey: text
                                }).then((ret) => {
                                    if (ret.data.Products && this.state.searchKey == text) {
                                        this.setState({
                                            dataSource: ret.data.Products
                                        })
                                    }
                                }).catch((e) => {

                                });
                                break;
                            default:
                                break;
                        }
                    }
                    else {

                    }
                }}
                onEndEditing={() => {

                }}
                onCanale={() => {
                    if (this.params.callBack) {
                        this.params.callBack();
                    }
                    this.pop();
                }}
            />
        )
    }

    //选规格View
    renderChooseSpecView() {
        return (
            <BCTouchable style={[styles.spec,{paddingBottom:px2dp(5),paddingTop:px2dp(5), paddingLeft:px2dp(8),paddingRight:px2dp(5), backgroundColor:'#00c164',
                borderRadius:50,flex:1,justifyContent:'center',alignItems:'center'}]}
                         onPress={() => this.onSelectSpec()}>
                <BCText
                    style={[gs.fts_12, gs.c_fff, {marginRight: px2dp(5),textAlign:'center'}]}>{this.state.IsOpen ? '选规格' : '收起'}</BCText>
                {/*<BCImage style={[{width: px2dp(10), height: px2dp(8)}]}/>*/}
                {/*source={require('../imgs/up.png')}/>*/}
            </BCTouchable>

        )
    }

    //选择规格view
    renderSpecView(ProductId, productName,companyId) {
        return (
            !this.state.IsOpen ?
                this.state.item.Specs.map((obj, index) => {
                    if (index < 0) {
                        return false
                    }
                    else {
                        // let specName = obj.SpecName;
                        let spec=obj.Spec;
                        let price = obj.Price;
                        let unit = obj.Unit;
                        let priceStr = substr(toDecimal2(price) + '', 8) + '/' + unit;
                        let unitAmount = obj.UnitAmount;
                        let disPlayUnit = obj.DisplayUnit;
                        let displayUnitTypeId = obj.DisplayUnitTypeId;
                        if (displayUnitTypeId == 2) {
                            //priceStr += disPlayUnit;
                        } else {
                            //priceStr += unit;
                        }
                        return (
                            <View style={[gs.bgc_fff, styles.listItem]}
                                  key={ProductId + '-' + obj.SpecId + '-' + index}>
                                <View style={styles.productImg}/>
                                <View style={{flex: 1}}>
                                    {/*<BCImage style={[{width: px2dp(207)}]} source={require('../imgs/line.png')}/>*/}
                                    <View style={styles.listItemRight}>
                                        <View style={[styles.listItemRightTop,{justifyContent:'flex-start'}]}>
                                            <BCText style={[gs.c_3a3838, {marginTop: px2dp(8)}]}>
                                                {/*<BCText style={[gs.fts_12]}>￥</BCText>*/}
                                                <BCText style={[gs.fts_14]}>{spec}</BCText>
                                            </BCText>
                                            {
                                                obj.PriceChangeReason == 1?<View style={[styles.jiang,{marginTop:px2dp(4)}]}><BCText style={[gs.fts_12,gs.c_fff]}>降</BCText></View>:null

                                            }
                                        </View>
                                        <View style={styles.listDetail}>
                                            <View style={[styles.listDetailRight]}>
                                                <BCText style={[gs.fts_14, gs.c_fd0319,]}>¥{priceStr}</BCText>
                                                {/*<BCImage style={[styles.actIcon]}
                                                 source={require('../imgs/drop.png')}/>*/}
                                            </View>
                                            <SearchPageCalculate
                                                ref={(c) => {
                                                    this._Products[ProductId + '-' + obj.SpecId] = c;
                                                }}
                                                ProductId={ProductId}
                                                Price={obj.Price}
                                                Quantity={obj.Quantity}
                                                SpecId={obj.SpecId}
                                                ShoppingCartId={obj.ShoppingCartId}
                                                CompanyId={companyId}
                                                UnitAmount={obj.UnitAmount}
                                                OnChange={this.props.updateShoppingCart}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }) : null
        )
    }

    //选规格
    onSelectSpec() {
        this.setState({
            IsOpen: !this.state.IsOpen,
        });
    }

    renderList() {
        switch (this.GlobalData.productType) {
            case -1:
                return (
                    <View>
                        {
                            this.state.dataSource.map((product, index) => {
                                let spec0 = product.Specs[0];
                                let price = spec0.Price;
                                let unit = spec0.Unit;
                                let priceStr = substr(price + '', 8) + '/' + unit;
                                return (
                                    <BCTouchable onPress={() => {
                                        Keyboard.dismiss();
                                        this.push('ProductDetail', {
                                            productGlobalId: product.ProductId,
                                            companyId: product.CompanyId || product.SCompanyId || spec0.CompanyId,
                                            productType: this.GlobalData.productType,
                                            isActive: spec0.IsActive,
                                            callBack: null
                                        });
                                    }}>
                                        <View style={[{borderBottomWidth: 1, borderBottomColor: '#e3e3e3'}, gs.bgc_fff]}
                                              key={index}>
                                            <View style={[styles.listItem]}>
                                                <BCHostImage
                                                    style={this.state.isEdit ? styles.productImg1 : styles.productImg}
                                                    source={{uri: product.Image}}/>
                                                <View style={styles.listItemRight}>
                                                    <View style={[styles.listItemRightTop]}>
                                                        <BCText
                                                            style={[gs.fts_15, gs.c_3a3838]}>{substr(product.ProductName, 11)}</BCText>
                                                    </View>
                                                    <BCText
                                                        style={[gs.fts_13, gs.c_3a3838, {marginBottom: px2dp(4)}]}>{spec0.SpecName}</BCText>
                                                    <View style={styles.listDetail}>
                                                        <View style={[styles.listDetailRight]}>
                                                            <BCText style={[gs.c_fd0319, {width: px2dp(100)}]}>
                                                                {/*<BCText style={[gs.fts_12]}>￥</BCText>*/}
                                                                <BCText style={[gs.fts_13]}>{priceStr}</BCText>
                                                            </BCText>
                                                            {/*<BCImage style={[styles.actIcon]} source={require('../../imgs/drop.png')}/>*/}
                                                        </View>

                                                        {
                                                            spec0.IsActive ?
                                                                <View style={{
                                                                    position: 'absolute',
                                                                    bottom: px2dp(2),
                                                                    right: px2dp(12)
                                                                }}>
                                                                    <SearchPageCalculate
                                                                        // ref={(c) => {
                                                                        //     this._Products[product.ProductId + '-' + spec0.SpecId] = c;
                                                                        // }}
                                                                        Quantity={spec0.Quantity}
                                                                        Price={spec0.Price}
                                                                        ProductId={product.ProductId}
                                                                        SpecId={spec0.SpecId}
                                                                        CompanyId={product.CompanyId || product.SCompanyId || spec0.CompanyId}
                                                                        UnitAmount={spec0.UnitAmount}
                                                                        ShoppingCartId={spec0.ShoppingCartId}
                                                                        OnChange={this.updateShoppingCart}/>
                                                                </View>
                                                                : <BCText style={[gs.c_3a3838]}>已下架</BCText>
                                                        }

                                                    </View>
                                                </View>
                                            </View>
                                            <View style={[styles.company]}>
                                                <BCText style={[gs.fts_13, gs.c_b7b7b7]}>由{spec0.CompanyName}配送</BCText>
                                            </View>
                                        </View>
                                    </BCTouchable>
                                )
                            })
                        }
                    </View>
                );
                break;
            default:
                return (
                    <View style={{paddingBottom:px2dp(60)}}>
                        {
                            this.state.dataSource.map((product, index) => {
                                if(product.Specs && product.Specs.length>0) {
                                    let spec0 = product.Specs[0];
                                    let specName = spec0.SpecName;
                                    let price = spec0.Price;
                                    let unit = spec0.Unit;
                                    let SpecId = spec0.SpecId;
                                    let priceStr = substr(toDecimal2(price) + '', 8) + '/' + unit;
                                    let priceChangeReason = spec0.PriceChangeReason;
                                    return (
                                        <View style={[ gs.bgc_fff]} key={index}>
                                            <BCTouchable  style={[styles.listItem,]}
                                                onPress={() => {
                                                Keyboard.dismiss();
                                                this.push('ProductDetail', {
                                                    productGlobalId: product.ProductId,
                                                    companyId: product.CompanyId || product.SCompanyId,
                                                    productType: this.GlobalData.productType,
                                                    isActive: true,
                                                    callBack: null
                                                });
                                            }}>
                                                <BCHostImage style={styles.productImg}
                                                                 source={{uri: product.Image}}/>

                                                <View style={styles.listItemRight}>
                                                    <View style={[styles.listItemRightTop]}>
                                                        <BCText
                                                            style={[gs.fts_15, gs.c_3a3838]}>{product.ProductName}</BCText>
                                                    </View>
                                                    <BCText style={[gs.c_3a3838]}>
                                                        <BCText style={[gs.fts_10]}>{specName}</BCText>
                                                    </BCText>
                                                    <View style={styles.listDetail}>
                                                        <View style={[styles.listDetailRight]}>
                                                            <BCText style={[gs.c_fd0319]}>
                                                                <BCText style={[gs.fts_11]}>￥</BCText>
                                                                <BCText style={[gs.fts_13]}>{priceStr}</BCText>
                                                            </BCText>
                                                            {priceChangeReason == 1?
                                                                <View style={[gs.bgc_fd0319, styles.down]}>
                                                                    <BCText style={[gs.fts_10, gs.c_fff]}>降</BCText>
                                                                </View> : null}
                                                        </View>
                                                        <View style={{
                                                            position: 'absolute',
                                                            bottom: px2dp(2),
                                                            right: px2dp(12)
                                                        }}>
                                                            <SearchPageCalculate
                                                                // ref={(c) => {
                                                                //     this._Products[product.ProductId + '-' + spec0.SpecId] = c;
                                                                // }}
                                                                Quantity={spec0.Quantity}
                                                                Price={spec0.Price}
                                                                ProductId={product.ProductId}
                                                                SpecId={spec0.SpecId}
                                                                CompanyId={product.CompanyId}
                                                                UnitAmount={spec0.UnitAmount}
                                                                ShoppingCartId={spec0.ShoppingCartId}
                                                                OnChange={this.updateShoppingCart}/>
                                                        </View>
                                                    </View>
                                                    {this.props.IsOpen ? this.renderSpecView(product.ProductGlobalId, product.ProductName,product.CompanyId) : null}
                                                </View>
                                            </BCTouchable>
                                        </View>

                                    )
                                }else{
                                    return(<View/>)
                                }
                            })
                        }
                    </View>
                );
                break;
        }
    }
    updateShoppingCart=(type, quantity, shoppingCartId, specId,companyId,productId,moneyChanged)=> {
        if(quantity&&quantity>0){
            fetchInsertOrUpdateShoppingCart({
                ProductGlobalId:productId,
                ShoppingCartId:shoppingCartId,
                CompanyId:companyId,
                SpecId:specId,
                Quantity:quantity,
                ProductType:0,
            }).then((ret)=>{
                if(moneyChanged){
                    if(type=='add'){
                        this.setState({totalPrice:this.state.totalPrice+moneyChanged});
                    }else{
                        this.setState({totalPrice:this.state.totalPrice-moneyChanged});
                    }
                }
            });
        }else {
            fetchDeleteShoppingCarts(
                [shoppingCartId]
            ).then(()=>{
                this.setState({totalPrice:this.state.totalPrice-moneyChanged});
            });
        }
    }

    renderFooter() {
        return  <View style={styles.footerWrap}>
            <View style={styles.footer}>
                <View style={[styles.money]}>
                    <BCText style={[gs.c_fd0319, gs.fts_16]}>合计:{toDecimal2(this.state.totalPrice) * 1}元</BCText>
                </View>
                <BCTouchable style={[styles.car]}
                             onPress={() =>{
                                 this.push('Cart', { pageFrom: 'SearchPage', onBack: this.refreshView.bind(this)})}}>
                    {this.state.totalCount ?<BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText> : <BCText style={[gs.c_fff, gs.fts_17]}>去购物车</BCText>}
                </BCTouchable>
            </View>
        </View>
    }
    //刷新
    onRefersh() {
        // const {dispatch} = this.props;
        // let GlobalDatas = this.GlobalDatas;
        this._page = 1;

    }

    refreshView() {
        this.setState({
            // dataSource: [],
            // totalPrice: 0
        });
        // this.onRefersh();
    }

    render() {
        return (
            <View style={{height:deviceHeight}}>
                {this.renderTop()}
                <View style={{height:deviceHeight-px2dp(68)-(Platform.OS === 'ios' ? px2dp(65) : px2dp(45))}}>
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
                </View>
                {this.renderFooter()}
            </View>

        )
    }



    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionShoppingCarts());
        const {productType, sCompanyId, priceGroupId} = this.params;
        this.GlobalData = {productType, sCompanyId, priceGroupId};

    }
    WillReceive(nextProps) {
        if (nextProps.ReduceLoadShoppingCarts.datas != null && nextProps.ReduceLoadShoppingCarts.datas != this.props.ReduceLoadShoppingCarts.datas) {
            const {ReduceLoadShoppingCarts} = nextProps;
            let totalMoney=0;
            ReduceLoadShoppingCarts.datas.map((n,index)=>{
                totalMoney+=n.Amount;
            });
            this.setState({
                IsReceived: true,
                totalPrice:totalMoney,
            })
        }
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    down:{
        width: px2dp(15),
        height: px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px2dp(3),
        marginLeft: px2dp(6.5)
    },
    navigator: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        //justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        borderBottomWidth: 1,
        paddingLeft: px2dp(16),
        paddingRight: px2dp(16)
    },
    rightButton: {
        width: '13%',
        alignItems: 'center',
        height: px2dp(28),

        justifyContent: "center"
    },
    searchBox: {
        width: '87%',
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        backgroundColor: '#ececec',

    },
    searchBar: {
        color: '#aea9a9',
        marginLeft: px2dp(6),
        padding: 0,
        width: '80%',
    },
    searchIcon: {
        width: px2dp(16),
        height: px2dp(17),
        marginLeft: px2dp(8)
    },

    //搜索结果
    listItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingRight: px2dp(12),
        paddingVertical: px2dp(10),
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
        marginLeft: px2dp(14),
    },
    productImg1: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
    },
    productImg2: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
        marginLeft: px2dp(46)
    },
    listItemRight: {
        flex: 1,
    },
    listItemRightTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
    },
    listDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        height: px2dp(22)
    },
    listDetailRight: {
        flexDirection: "row",
        alignItems: 'center',
    },

    company: {
        height: px2dp(29),
        marginLeft: px2dp(14),
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        justifyContent: 'center',
    },

    //footer
    footerWrap: {
        width: '100%',
        height: px2dp(66),
        position: 'absolute',
        bottom: px2dp(22),
        left: 0,
        justifyContent: 'flex-end',
        zIndex: 8
    },
    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        overflow: 'visible',
        borderTopWidth:1,
        borderTopColor: '#eee',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
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
    car: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00c164"
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
        zIndex: 9,
    },
    cartImg: {
        position: 'absolute',
        bottom: px2dp(17),
        left: px2dp(18),
        zIndex: 102,
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


function selector(store) {
    return {
        ReduceLoadShoppingCarts: store.ReduceLoadShoppingCarts,
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(selector)(App) 中；
export default connect(selector)(SearchPageProducts);
/**
 * Created by Administrator on 2017/4/12.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TextInput,
    InteractionManager,
    AsyncStorage,
    FlatList,
    ScrollView
} from 'react-native';
import BaseComponent, {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCHostImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import {PullListComponent} from '../../PageComponent'
import {connect} from "react-redux";
import {ActionLoaderMarketPrices, ActionMarketPrices} from '../../../actions/PriceParityAction';
import {toastShort} from '../../../utils/ToastUtil';

import Tab from '../../../components/Tab';

class PriceParity extends PullListComponent {
    GlobalDatas = {};

    constructor(props) {
        super(props);
        this.state = {
            // 主分类数组
            Category: [],
            dataSource: []
        }
    }

    //设置页面标题
    setTitle() {
        return "商品比价"
    }

    Top() {
        if (this.GlobalDatas.Categorys.length > 0) {
            let categorys = this.GlobalDatas.Categorys;
            return <Tab Style={1}
                        Items={categorys}
                        OnPress={(i, categoryId) => {
                            const {dispatch} = this.props;
                            this.GlobalDatas.CategoryId = categoryId;
                            //发送请求
                            this._page = 1;
                            dispatch(ActionMarketPrices({pCategoryId: categoryId}));
                        }}/>
        }
    }

    rightType() {
        return 'imgSearch'
    }

    //点击搜索
    goSearch() {
        this.push('PriceParitySearch')
    }

    keyExtractor(item, index) {
        return item.Id + '-' + index
    }

    renderRow(data) {
        const product = data.item;
        return (
            <View style={[styles.outView, gs.bgc_fff]}>
                <BCTouchable style={[styles.product]} onPress={() => {
                    this.push('PriceTendency', {product})
                }}>
                    <BCHostImage style={styles.productImg}
                                 source={{uri: product.Image}}/>
                    <View>
                        <BCText
                            style={[gs.fts_16, {paddingLeft: px2dp(8)}]}>{substr((product.ProductName), 11)}</BCText>
                        <BCText style={[gs.fts_14, gs.c_888, {paddingLeft: px2dp(8)}]}>规格：{product.Spec}</BCText>
                    </View>
                </BCTouchable>

                <ScrollView style={styles.marks}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                    {
                        product.Items ?
                            product.Items.map((mark, index) => {
                                //  mark.PriceStatus 1不变 2升 3降
                                let priceStatus = mark.PriceStatus;
                                let symbol = null;
                                switch (priceStatus) {
                                    case 1:
                                        symbol = null;
                                        break;
                                    case 2:
                                        symbol = require("../../../imgs/rise.png");
                                        break;
                                    case 3:
                                        symbol = require("../../../imgs/decline.png");
                                        break;
                                }
                                return (
                                    <View key={index + mark}
                                          style={[styles.marksView, {
                                              borderRightWidth: 1,
                                              borderRightColor: '#e3e3e3'
                                          }]}>
                                        <BCText style={[gs.fts_14, gs.c_888,]}>{mark.MarketName}</BCText>
                                        <View style={styles.price}>
                                            <BCText style={[gs.fts_15, gs.c_fd0319,]}>￥{mark.Price}</BCText>
                                            <BCImage style={{paddingLeft: px2dp(10)}}
                                                     source={symbol}/>
                                        </View>
                                    </View>
                                )
                            }) : null
                    }
                </ScrollView>
            </View>
        )
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 0
        dispatch(ActionMarketPrices({pCategoryId: this.GlobalDatas.CategoryId}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++;
        dispatch(ActionMarketPrices({pCategoryId: this.GlobalDatas.CategoryId, p: this._page}));
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderMarketPrices());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoaderMarketPrices.datas != null && nextProps.ReduceLoaderMarketPrices.datas != this.props.ReduceLoaderMarketPrices.datas) {
            const {ReduceLoaderMarketPrices} = nextProps;
            let datas = ReduceLoaderMarketPrices.datas;

            let products = datas.Products;
            this.GlobalDatas.Categorys = datas.Category;
            this.GlobalDatas.CategoryId = datas.Category[0].CategoryId;

            this.setState({
                IsReceived: true,
                dataSource: products,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(43)
            });
        }
        if (nextProps.ReduceMarketPrices.datas != null && nextProps.ReduceMarketPrices.datas != this.props.ReduceMarketPrices.datas) {
            const {ReduceMarketPrices} = nextProps;
            let products = ReduceMarketPrices.datas.Products;

            let dataSource = this.state.dataSource;
            if (this._page > 1) {
                products.map((product) => {
                    dataSource.push(product)
                })
            }
            else {
                dataSource = products;
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(43)
            });
        }
    }
}

const styles = StyleSheet.create({
    Category: {
        flexWrap: 'nowrap',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    },
    CategoryItem: {
        height: px2dp(43),
        borderBottomWidth: 2,
        alignItems: 'center',
        marginRight: px2dp(24),
        justifyContent: 'center'
    },
    outView: {
        marginBottom: px2dp(10),
    },
    product: {
        flexDirection: "row",
        paddingTop: px2dp(13),
        paddingBottom: px2dp(13),
        paddingLeft: px2dp(16),
        alignItems: 'center',
    },
    companyW: {
        flexDirection: "row",
        paddingTop: px2dp(8),
        paddingBottom: px2dp(8),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        alignItems: 'center',
    },
    productImg: {
        width: px2dp(49),
        height: px2dp(49),
        borderRadius: Platform.OS == 'ios' ? px2dp(20) : px2dp(50),
    },
    finish: {
        flexDirection: "row",
        alignItems: 'center',
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1,
    },

    marks: {
        flexDirection: "row",
        height: px2dp(79),
        marginTop: px2dp(8)
    },
    marksView: {
        width: deviceWidth / 3 - 1,
        height: px2dp(59),
        justifyContent: 'space-around',
        alignItems: "center",

    },
    price: {
        flexDirection: "row",
        width: deviceWidth / 3 - 1,
        alignItems: "center",
        justifyContent: "space-around",
        paddingLeft: px2dp(20),
        paddingRight: px2dp(10)
    },


});

function mapStateToProps(store) {
    return {
        ReduceLoaderMarketPrices: store.ReduceLoaderMarketPrices,
        ReduceMarketPrices: store.ReduceMarketPrices
    }
}

const connectProviders = connect(mapStateToProps)(PriceParity);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
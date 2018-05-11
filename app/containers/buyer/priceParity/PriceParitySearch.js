/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Keyboard,
    ScrollView
} from 'react-native';
import {PullViewComponent} from '../../PageComponent';
import {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    BCHostImage
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import SearchInputBar from '../../../components/SearchInputBar';
import {toastShort} from '../../../utils/ToastUtil';

import {fetchMarketPrices} from '../../../services/PriceParityServices';

export default class PriceParitySearch extends PullViewComponent {
    static defaultProps = {};
    static propTypes = {
        backCallBack: React.PropTypes.func,
        goSearch: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    renderTop() {
        return (
            <SearchInputBar
                onChangeText={(text) => {
                    if (text) {
                        //比价
                        fetchMarketPrices({
                            searchKey: text
                        }).then((ret) => {
                            if (ret.data.Products) {
                                this.setState({
                                    dataSource: ret.data.Products
                                })
                            }
                        }).catch((e) => {

                        });
                    }
                    else {

                    }
                }}
                onEndEditing={() => {

                }}
                onCanale={() => {
                    if (this.params && this.params.callBack) {
                        this.params.callBack();
                    }
                    this.pop();
                }}
            />
        )
    }

    renderList() {
        return (
            <ScrollView style={[{flex: 1}]}>
                {
                    this.state.dataSource.map((product, index) => {
                        //  mark.PriceStatus 1不变 2升 3降
                        let priceStatus = product.PriceStatus;
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
                            <View style={[styles.outView, gs.bgc_fff]} key={index}>
                                <BCTouchable style={[styles.product]} onPress={() => {
                                    Keyboard.dismiss();
                                    this.push('PriceTendency', {product})
                                }}>
                                    <BCHostImage style={styles.productImg}
                                                 source={{uri: product.Image}}/>
                                    <View>
                                        <BCText
                                            style={[gs.fts_16, {paddingLeft: px2dp(8)}]}>{substr((product.ProductName), 11)}</BCText>
                                        <BCText
                                            style={[gs.fts_14, gs.c_888, {paddingLeft: px2dp(8)}]}>规格：{product.Spec}</BCText>
                                    </View>
                                </BCTouchable>

                                <ScrollView style={styles.marks}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}>
                                    {
                                        product.Items ?
                                            product.Items.map((mark, index) => {
                                                return (
                                                    <View key={index + mark}
                                                          style={[styles.marksView, {
                                                              borderRightWidth: 1,
                                                              borderRightColor: '#e3e3e3'
                                                          }]}>
                                                        <BCText
                                                            style={[gs.fts_14, gs.c_888,]}>{mark.MarketName}</BCText>
                                                        <View style={styles.price}>
                                                            <BCText
                                                                style={[gs.fts_15, gs.c_fd0319,]}>￥{mark.Price}</BCText>
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
                    })
                }
            </ScrollView>
        )
    }

    render() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderTop()}
                {this.renderList()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    main: {
        flex: 1
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
        borderRadius: 50,
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

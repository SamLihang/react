/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Keyboard,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import PageComponent, {PullViewComponent,PullListComponent} from '../../PageComponent';
import {
    px2dp,
    deviceWidth,
    deviceHeight,
    substr,
    BCText,
    BCImage,
    BCTouchable,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import SearchInputBar from '../../../components/SearchInputBar';
import {connect} from "react-redux";
import {toastShort} from '../../../utils/ToastUtil';

import CheckBox from '../../../components/CheckBox';
import {ActionActiveProducts} from '../../../actions/SellerProductAction';
import {
    fetchSellerReplenishProducts,
    fetchSellerUpdateReplenishProducts
} from '../../../services/SellerProductServices';

//操作
class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsLoading: false
        }
    }

    Trigger(state) {
        this.setState({
            IsLoading: state
        })
    }

    render() {
        if (this.state.IsLoading) {
            return (
                <View
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: px2dp(20),
                        height: px2dp(20),
                        marginLeft: px2dp(-10),
                        marginTop: px2dp(-10),
                        backgroundColor: '#ffffff'
                    }}
                >
                    <ActivityIndicator animating color='#ff0000'/>
                </View>
            )
        }
        else {
            return null
        }
    }
}

class Dl extends Component {
    _Product = {}
    _CheckBox = {}

    static defaultProps = {
        product: {},
    };
    static propTypes = {
        product: React.PropTypes.object,
        OnSelect: React.PropTypes.func,
        ToPush: React.PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            specState: false,
            ToPush: props.ToPush,
            isSelect: props.isSelect
        }
    }

    onChangeSelect(isSelect) {
        this.setState({
            isSelect: isSelect
        }, () => {
            this._CheckBox.OnChange(isSelect)
        })
    }

    _goDetail(ProductId) {
        this.props.GoDetail(ProductId);
    }

    render() {
        let product = this.props.product;
        let ProductId = product.ProductId;
        let CompanyId = product.CompanyId;
        let productType = 1;

        return (
            <BCTouchable onPress={() => {this._goDetail(ProductId)}}>
                <View style={[styles.listItem, gs.bgc_fff]}>
                    <CheckBox
                        IsSelect={this.state.isSelect}
                        ref={(c) => {
                            this._CheckBox = c
                        }}
                        OnChange={(isSelect) => {
                            this.setState({
                             isSelect: isSelect
                             }, () => {
                             this.props.OnSelect(isSelect, product.ProductId)
                             })
                            // this.props.OnSelect(isSelect, product.ProductId)
                        }}/>

                    <BCHostImage style={styles.productImg}
                                 source={{uri: product.Image}}/>

                    <View style={styles.listItemRight}>
                        <View style={[styles.listItemRightTop]}>
                            <BCText
                                style={[gs.fts_15, gs.c_3a3838]}>{substr(product.ProductName, 11)}</BCText>
                        </View>
                        <BCText style={[gs.c_3a3838]}>
                            <BCText style={[gs.fts_10]}>{product.Specs[0].SpecName}</BCText>
                        </BCText>
                        <View style={styles.listDetail}>
                            <View style={[styles.listDetailRight]}>
                                <BCText style={[gs.c_fd0319]}>
                                    <BCText style={[gs.fts_11]}>￥</BCText>
                                    <BCText style={[gs.fts_13]}>{product.Specs[0].Price}</BCText>
                                    <BCText style={[gs.fts_10]}>/{product.Specs[0].Unit}</BCText>
                                </BCText>
                                {/*<BCImage style={[styles.actIcon]} source={require('../../../imgs/drop.png')}/>*/}
                            </View>
                            <BCTouchable style={[styles.productDetail]}
                                         onPress={() => {
                                             this._goDetail(ProductId)
                                         }}>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>商品详情</BCText>
                                <BCImage style={[{width: px2dp(6), height: px2dp(11), marginLeft: px2dp(8)}]}
                                         source={require('../../../imgs/right1.png')}/>
                            </BCTouchable>
                        </View>
                    </View>
                </View>
            </BCTouchable>
        )
    }
}

class Bottom extends Component {
    static defaultProps = {};
    static propTypes = {
        OnSelectAll: React.PropTypes.func,
        OnActive: React.PropTypes.func,
        OnDelete: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            isGray: true,
            side: this.props.side,
            isSelect: false
        }
    }

    onChangeColor(state) {
        this.setState({
            isGray: state
        })
    }

    onReset(state, isSelect) {
        this.setState({
            isGray: state,
            isSelect: isSelect
        })
    }

    changeSide(side) {
        this.setState({
            side: side
        })
    }

    render() {
        return (
            <View style={[styles.footer, gs.bgc_fff]}>
                <CheckBox
                    IsSelect={this.state.isSelect}
                    OnChange={(isSelect) => {
                        this.setState({
                            isSelect: isSelect,
                            isGray: !isSelect
                        }, () => {
                            this.props.OnSelectAll(isSelect)
                        })
                    }}/>
                <BCText style={[gs.fts_15, gs.c_3a3838]}>全选</BCText>
                <BCTouchable style={[this.state.isGray ? gs.bgc_ccc : {backgroundColor:'#31ca96'}, styles.active]} onPress={() => {
                    this.props.OnActive(this.state.side)

                }}>
                    <BCText style={[gs.c_fff, gs.fts_17]}>{(this.state.side == 'left') ? '取消补货' : '参与补货'}</BCText>
                </BCTouchable>
            </View>
        )
    }
}

export default class SellerReplenishProductsSearch extends PageComponent {
    _Products = {};
    _Bottom = {};
    _Tab = null;
    _HorizontalTab = null;
    ProductGlobalIds = [];
    GlobalDatas = {
        Categorys: [],
        ParentCategoryId: null,
        ChildCategoryId: null,
        isActive: true,
        changeCategory: false
    };
    isSelectAll = false;
    ProductIndex = [];

    static defaultProps = {};
    static propTypes = {
        backCallBack: React.PropTypes.func,
        goSearch: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            text:''
        }
    }

    renderTop() {
        return (
            <SearchInputBar
                onChangeText={(text) => {
                    this.state.text = text
                    if (this.state.text) {
                        //比价
                        fetchSellerReplenishProducts({
                            searchKey: this.state.text,
                            IsReplenish: this.params.isActive
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
            <ScrollView>
                {
                    this.state.dataSource.map((product, index) => {
                        return this.renderRow(product, index)
                    })
                }
            </ScrollView>
        )
    }

    renderRow(product, index) {
        return <Dl key={index}
                   ref={(p) => {
                       this._Products[product.ProductId] = p;
                   }}
                   product={product}
                   OnSelect={(isSelect, productId) => {
                       if (isSelect) {
                           //把bottom的颜色改为亮色
                           if (this._Bottom.state.isGray) {
                               this._Bottom.onChangeColor(false);
                           }
                           //将选中的商品加入ProductGlobalIds
                           if (!this.ProductGlobalIds.includes(productId)) {
                               this.ProductGlobalIds.push(productId)
                               //加入选中数组
                               this.ProductIndex.push(index)
                           }
                           //如果全选了 改变底部
                           if (this.ProductGlobalIds.length == this.state.dataSource.length) {
                               this._Bottom.onReset(false, true);
                           }
                       }
                       else {
                           //删除
                           let index = this.ProductGlobalIds.findIndex(id => id == productId);
                           if (index >= 0) {
                               this.ProductGlobalIds.splice(index, 1)
                               //移除选中数组
                               this.ProductIndex.splice(index, 1)
                           }

                           //取消全选,颜色不变 如果ProductGlobalIds为空,bottom颜色发生改变
                           if (this.ProductGlobalIds.length <= 0) {
                               this._Bottom.onReset(true, false);
                           }
                           else {
                               this._Bottom.onReset(false, false);
                           }
                       }
                   }}
                   GoDetail={(productGlobalId) => {
                       this.push('ProductDetails', {ProductId: productGlobalId})
                   }}
        />
    }

    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        //重置全选 清空ProductGlobalIds
        this.ProductGlobalIds = [];
        Object.keys(this._Products).forEach((id) => {
            let productDl = this._Products[id];
            if (productDl) {
                productDl.onChangeSelect(false);
            }
        });
        this._page = 1;
        fetchSellerReplenishProducts({
            searchKey: this.state.text,
            IsReplenish: this.params.isActive
        }).then((ret) => {
            if (ret.data.Products) {
                this.setState({
                    dataSource: ret.data.Products
                })
            }
        }).catch((e) => {

        });
    }

    Bottom() {
        return (
            <Bottom side={this.params.isActive ? 'left' : 'right'}
                    ref={(b) => {
                        this._Bottom = b
                    }}
                    OnSelectAll={(isSelect) => {
                        this.isSelectAll = isSelect;
                        Object.keys(this._Products).forEach((id) => {
                            let productDl = this._Products[id];
                            if (productDl) {
                                productDl.props.OnSelect(isSelect, id * 1)
                                productDl.onChangeSelect(isSelect);
                            }
                        });

                    }}
                    OnActive={(side) => {
                        this._Bottom.onReset(true, false);
                        if (this.ProductGlobalIds.length <= 0) {
                            toastShort('请选择商品');
                            return false
                        }

                        this._Loading.Trigger(true);
                        fetchSellerUpdateReplenishProducts({
                            productGlobalIds: this.ProductGlobalIds,
                            IsReplenish: !this.params.isActive
                        }).then((ret) => {
                            if (ret.data == null) {
                                this.onRefersh();
                                // let productIndex = this.ProductIndex;
                                // productIndex.map((item, index) => {
                                //     this.state.dataSource.splice(item, 1);
                                // })
                                // this.ProductIndex = [];
                                // this.setState({
                                //     dataSource: this.state.dataSource
                                // });

                            }
                            else {
                                toastShort(JSON.stringify(ret.data))
                            }
                            this._Loading.Trigger(false);
                        }).catch((e) => {
                            toastShort(JSON.stringify(e));
                            this._Loading.Trigger(false);
                        });
                    }}
            />
        )
    }

    render() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderTop()}
                {this.renderList()}
                {this.Bottom()}
                <Loading ref={(ref) => {
                    this._Loading = ref
                }}/>
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
    listItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingRight: px2dp(12),
        paddingVertical: px2dp(8)
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
        marginLeft: px2dp(14),
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

    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
    },

    productDetail: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    footer: {
        width: '100%',
        height: px2dp(46),
        flexDirection: 'row',
        paddingLeft: px2dp(12),
        alignItems: 'center',
        //position: 'absolute',
        //bottom: 0,
        //left: 0
    },
    active: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    delete: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
});
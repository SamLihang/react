import React, {Component} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {PullListComponent} from '../../PageComponent'
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
import {connect} from "react-redux";
import {toastShort} from '../../../utils/ToastUtil';

import CheckBox from '../../../components/CheckBox';
import Tab, {HorizontalTab} from '../../../components/Tab';
import {BCDoNavigator} from '../../../components/BCNavigator'

import {
    ActionLoadActiveProducts,
    ActionActiveProducts,
    ActionPostActiveProducts
} from '../../../actions/SellerProductAction';
import {fetchPostActiveProducts, fetchDeleteProducts} from '../../../services/SellerProductServices'

class Dl extends Component {
    _Product = {}
    _CheckBox = {}

    static defaultProps = {
        product: {}
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
    _GoEdit(ProductId){
        this.props.GoEdit(ProductId);
    }



    render() {
        const {dispatch} = this.props;
        let product = this.props.product;
        let ProductId = product.ProductId;
        let CompanyId = product.CompanyId;
        let productType = 1;

        return (
            <BCTouchable
                style={{borderBottomWidth:1,borderBottomColor:'#eee'}}
                onPress={() => {this._goDetail(ProductId)}}
            >
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

                        }}/>

                    <BCHostImage style={styles.productImg} source={{uri: product.Image}}/>

                    <View style={[styles.listItemRight,{}]}>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={[styles.listItemRightTop]}>
                                <BCText
                                    style={[gs.fts_15, gs.c_3a3838]}>{substr(product.ProductName, 11)}</BCText>
                            </View>
                            <BCTouchable style={[styles.productDetail]}
                                         onPress={() => {this._GoEdit(ProductId)}}
                            >
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>商品编辑</BCText>
                                <BCImage style={[{width: px2dp(6), height: px2dp(11), marginLeft: px2dp(8)}]}
                                         source={require('../../../imgs/right1.png')}/>
                            </BCTouchable>
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

                            <BCTouchable style={[styles.productDetail]} onPress={() => {this._goDetail(ProductId)}}>
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
            side: 'left',
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
                <BCTouchable style={[this.state.isGray ? gs.bgc_ccc : gs.bgc_ffaf15, styles.active]} onPress={() => {
                    this.props.OnActive(this.state.side)
                }}>
                    <BCText style={[gs.c_fff, gs.fts_17]}>{(this.state.side == 'left') ? '下架' : '上架'}</BCText>
                </BCTouchable>
                <BCTouchable style={[this.state.isGray ? gs.bgc_ccc : gs.bgc_fd0319, styles.delete]} onPress={() => {
                    this.props.OnDelete()
                }}>
                    <BCText style={[gs.c_fff, gs.fts_17]}>删除</BCText>
                </BCTouchable>
            </View>
        )
    }
}

class Products extends PullListComponent {
    _Products = {};
    _Bottom = {};
    _Tab = null;
    _HorizontalTab = null;
    ProductGlobalIds = [];
    GlobalDatas = {
        Categories: [],
        ParentCategoryId: null,
        ChildCategoryId: null,
        isActive: true,
        changeCategory: false
    };
    isSelectAll = false;

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        };
    }

    renderNavigator() {
        return (
            <BCDoNavigator navigation={this.props.navigation}
                           backCallBack={this.onBack}
                           OnChange={(type) => {
                               const {dispatch} = this.props;
                               this.GlobalDatas.isActive = (type == 'left') ? true : false;
                               //重置分页未1 重置分类为第一个
                               this._page = 1;
                               //this._Tab.reLoad();
                               //this._HorizontalTab.reLoad();

                               //发送请求
                               dispatch(ActionActiveProducts({
                                   isActive: this.GlobalDatas.isActive
                               }));
                               //改变全选状态 清空之前选择的id
                               this.isSelectAll = false;
                               this.ProductGlobalIds = [];
                               //重置底部
                               if (this._Bottom) {
                                   this._Bottom.changeSide(type);
                               }

                           }}
                           onPressRight={() => {
                               this.goSearch()
                           }}/>
        )
    }

    //点击搜索
    goSearch() {
        this.push('ProductsSearch', {
            callBack: this.refeshView.bind(this),
            isActive: this.GlobalDatas.isActive
        })
    }

    Top() {
        let GlobalDatas = this.GlobalDatas;
        // let categories = GlobalDatas.Categories;
        let categories=this.state.Categories
        let categoryArray = categories?categories[0].Children:[];
        return (
            <View>
                <Tab
                    ref={(t) => {
                        this._Tab = t
                    }}
                    Style={1}
                    Items={categories}
                    OnPress={(i, categoryId) => {
                        const {dispatch} = this.props;
                        let GlobalDatas = this.GlobalDatas;

                        GlobalDatas.ParentCategoryId = categoryId;
                        GlobalDatas.ChildCategoryId = GlobalDatas.Categories[i].Children[0].CategoryId;

                        this._HorizontalTab.state.Items = GlobalDatas.Categories[i].Children;
                        this._HorizontalTab.reLoad();

                        //重置全选 清空ProductGlobalIds
                        this.isSelectAll = false;
                        this.ProductGlobalIds = [];

                        this._page = 1;
                        dispatch(ActionActiveProducts({
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.ChildCategoryId,
                            isActive: GlobalDatas.isActive
                        }));
                    }}/>

                <HorizontalTab Items={categoryArray}
                               ref={(h) => {
                                   this._HorizontalTab = h
                               }}
                               OnPress={(i, categoryId, pid) => {
                                   const {dispatch} = this.props;
                                   let GlobalDatas = this.GlobalDatas;

                                   GlobalDatas.ChildCategoryId = categoryId;
                                   GlobalDatas.ParentCategoryId = pid;

                                   //重置全选 清空ProductGlobalIds
                                   this.isSelectAll = false;
                                   this.ProductGlobalIds = [];

                                   this._page = 1;
                                   dispatch(ActionActiveProducts({
                                       parentCategoryId: pid,
                                       categoryId: categoryId,
                                       isActive: GlobalDatas.isActive
                                   }));
                               }}/>
            </View>
        )
    }

    keyExtractor(item, index) {
        return item.ProductId + '-' + index
    }

    renderRow(data) {
        const product = data.item;
        const {dispatch} = this.props;

        return <Dl
            ref={(p) => {
                this._Products[product.ProductId] = p;
            }}
            product={product}
            dispatch={dispatch}
            isSelect={this.isSelectAll}
            OnSelect={(isSelect, productId) => {
                if (isSelect) {
                    //把bottom的颜色改为亮色
                    if (this._Bottom.state.isGray) {
                        this._Bottom.onChangeColor(false);
                    }
                    //将选中的商品加入ProductGlobalIds
                    if (!this.ProductGlobalIds.includes(productId)) {
                        this.ProductGlobalIds.push(productId)
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
            GoEdit={(productGlobalId)=>{
                this.push('EditProductInformation',{productGlobalId:productGlobalId,onBack:this.refeshView.bind(this)})
            }}
            GoDetail={(productGlobalId) => {
                this.push('ProductDetails', {ProductId: productGlobalId})
            }}
            onRefersh={()=>{this.onRefersh()}}

        />
    }

    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        //重置全选 清空ProductGlobalIds
        this.isSelectAll = false;
        this.ProductGlobalIds = [];
        Object.keys(this._Products).forEach((id) => {
            let productDl = this._Products[id];
            if (productDl) {
                productDl.onChangeSelect(false);
            }
        });

        this._page = 1;
        dispatch(ActionActiveProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
            isActive: GlobalDatas.isActive
        }));
    }

    refeshView() {
        this.onRefersh();
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        dispatch(ActionActiveProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
            p: ++this._page,
            isActive: GlobalDatas.isActive
        }));
    }

    Bottom() {
        return (
            <Bottom
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
                    if (this.ProductGlobalIds.length <= 0) {
                        toastShort('请选择商品');
                        return false
                    }

                    this._Loading.Trigger(true);

                    fetchPostActiveProducts({
                        productGlobalIds: this.ProductGlobalIds,
                        isActive: !this.GlobalDatas.isActive
                    }).then((ret) => {
                        if (ret.data == null) {
                            this.onRefersh()
                        }
                        else {
                            toastShort(JSON.stringify(ret.data))
                        }
                    }).catch((e) => {
                        toastShort(JSON.stringify(e))
                    });
                }}
                OnDelete={() => {
                    if (this.ProductGlobalIds.length <= 0) {
                        toastShort('请选择商品');
                        return false
                    }

                    this._Loading.Trigger(true);

                    fetchDeleteProducts({
                        productGlobalIds: this.ProductGlobalIds
                    }).then((ret) => {
                        if (ret.data == null) {
                            this.onRefersh()
                        }
                        else {
                            toastShort(JSON.stringify(ret.data))
                        }
                    }).catch((e) => {
                        toastShort(JSON.stringify(e))
                    });
                }}
            />
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoadActiveProducts(true))
    }

    //初始化数据
    WillReceive(nextProps) {
        if (nextProps.ReduceLoadActiveProducts.datas != null && nextProps.ReduceLoadActiveProducts.datas != this.props.ReduceLoadActiveProducts.datas) {
            const {ReduceLoadActiveProducts} = nextProps;
            let Products = ReduceLoadActiveProducts.datas.Products;
            this.GlobalDatas.Categories = ReduceLoadActiveProducts.datas.Categories;
            this.setState({
                Categories:ReduceLoadActiveProducts.datas.Categories
            })
            //this.GlobalDatas.ParentCategoryId = ReduceLoadActiveProducts.datas.Categorys[0].CategoryId;
            //this.GlobalDatas.ChildCategoryId = ReduceLoadActiveProducts.datas.Categorys[0].Items[0].CategoryId;
            this.GlobalDatas.ParentCategoryId = null;
            this.GlobalDatas.ChildCategoryId = null;


            this.setState({
                IsReceived: true,
                dataSource: Products,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(70) : px2dp(60) ) - px2dp(93 + 46)
            });
        }
        if (nextProps.ReduceActiveProducts.datas != null && nextProps.ReduceActiveProducts.datas != this.props.ReduceActiveProducts.datas) {
            const {ReduceActiveProducts} = nextProps;

            let products = ReduceActiveProducts.datas.Products;
            let dataSource = this.state.dataSource;
            if (this._page > 1) {
                products.map((product) => {
                    dataSource.push(product)
                })
            }
            else {
                if (this._Bottom) {
                    this._Bottom.onReset(true, false);
                }
                dataSource = products;
            }

            this._Loading.Trigger(false);
            this.setState({
                IsReceived: true,
                dataSource: dataSource
            });
        }
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },

    content: {
        flex: 1,
        //borderTopWidth: 1,
        //borderTopColor: '#e3e3e3'
    },

    listItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingTop: px2dp(12),
        paddingRight: px2dp(12),
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
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    active: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: px2dp(94)
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

function mapStateToProps(store) {
    return {
        ReduceLoadActiveProducts: store.ReduceLoadActiveProducts,
        ReduceActiveProducts: store.ReduceActiveProducts
    }
}

const connectProviders = connect(mapStateToProps)(Products);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
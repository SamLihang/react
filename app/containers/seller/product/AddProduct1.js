import React, {Component}from "react";
import {ScrollView, StyleSheet, View, FlatList, Platform} from "react-native";
import PageComponent from "../../PageComponent";
import {BCImage, BCText, BCTouchable, px2dp, NavigationOptions, deviceHeight} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionLoaderProducts, ActionProducts, ActionProductSpecPrices} from '../../../actions/SellerProductAction'

import Tab, {VerticalTab} from '../../../components/Tab'

class ListItem extends Component {
    static defaultProps = {
        Item: {},
    };
    static propTypes = {
        Item: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            IsSelect: false,
        }
    }

    _onPress(ProductGlobalId) {
        this.setState({
            IsSelect: !this.state.IsSelect
        }, () => {
            this.props.OnClick(ProductGlobalId)
        })
    }

    changeSelectState(IsSelect) {
        this.setState({
            IsSelect: IsSelect
        })
    }

    render() {
        let item = this.props.Item;
        return (
            <BCTouchable style={Styles.listItem} onPress={() => {
                this._onPress(item.ProductGlobalId)
            }}>
                <BCText style={[gs.fts_14, this.state.IsSelect ? gs.c_00C164 : gs.c_3a3838]}>{item.ProductName}</BCText>
                {
                    this.state.IsSelect ?
                        <BCImage style={[{width: px2dp(14), height: px2dp(10)}]}
                                 source={require('../../../imgs/Choice.png')}/>
                        : null
                }

            </BCTouchable>
        )
    }
}

class AddProduct1 extends PageComponent {
    _FlatList = null
    _VerticalTab = null
    _page = 1
    GlobalDatas = {
        Categorys: [],
        ParentCategoryId: null,
        ChildCategoryId: null,
    };
    _ListItems = {};

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    isShowSearchBar() {
        return true
    }

    //点击搜索
    goSearch() {
        this.push('AddProduct1Search', {
            callBack: this.refeshView.bind(this),
        })
    }

    //主分类
    Top() {
        let Categorys = this.GlobalDatas.Categorys;
        return (
            <Tab Items={Categorys} Style={1}
                 OnPress={(i, categoryId) => {
                     const {dispatch} = this.props;
                     let GlobalDatas = this.GlobalDatas;

                     GlobalDatas.ParentCategoryId = categoryId;
                     GlobalDatas.ChildCategoryId = GlobalDatas.Categorys[i].Items[0].CategoryId;

                     this._VerticalTab.state.Items = GlobalDatas.Categorys[i].Items;
                     this._VerticalTab.reLoad();

                     this._page = 1;
                     dispatch(ActionProducts({
                         parentCategoryId: categoryId,
                         categoryId: GlobalDatas.ChildCategoryId
                     }));
                 }}/>
        )
    }

    //主要内容
    renderContent() {
        let GlobalDatas = this.GlobalDatas;
        let categoryArray = this.GlobalDatas.Categorys[0].Items

        return (
            <View style={[Styles.content, gs.bgc_f2f1ef]}>
                {this.renderSecondCategory(categoryArray)}
                {this.renderList()}
            </View>
        )
    }

    //二级分类
    renderSecondCategory(categoryArray) {
        return (
            <VerticalTab Items={categoryArray}
                         ref={(v) => {
                             this._VerticalTab = v
                         }}
                         Height={1}
                         OnPress={(i, categoryId, pid) => {
                             const {dispatch} = this.props;
                             let GlobalDatas = this.GlobalDatas;

                             GlobalDatas.ChildCategoryId = categoryId;
                             GlobalDatas.ParentCategoryId = pid;

                             this._page = 1;
                             dispatch(ActionProducts({
                                 parentCategoryId: pid,
                                 categoryId: categoryId,
                             }));
                         }}/>
        )
    }

    //商品列表
    renderList() {
        return (
            <View style={[Styles.lists, gs.bgc_fff]}>
                {
                    this.state.dataSource.length ?
                        <FlatList
                            initialNumToRender={10}
                            //ListFooterComponent={this.renderFooter.bind(this)}
                            data={this.state.dataSource}
                            renderItem={this.renderItem.bind(this)}
                            ref={(ref) => {
                                this._FlatList = ref;
                            }}
                            keyExtractor={this.keyExtractor.bind(this)}
                            onRefresh={this.onRefersh.bind(this)}
                            refreshing={false}
                            onEndReached={this.onEndReached.bind(this)}
                        /> : this.noRecord('暂无商品', gs.bgc_fff)
                }
            </View>
        )
    }

    //商品列表Item
    renderItem(rowData) {
        const {dispatch} = this.props;
        let item = rowData.item;
        return <ListItem Item={item}
                         ref={(l) => {
                             this._ListItems[item.ProductGlobalId] = l;
                         }}
                         OnClick={(productGlobalId) => {
                             Object.keys(this._ListItems).forEach((id) => {
                                 if (id != productGlobalId) {
                                     if (this._ListItems[id]) {
                                         this._ListItems[id].changeSelectState(false);
                                     }
                                 }
                             })
                             this.push('AddProduct2', {productGlobalId});
                         }}/>
    }

    //商品列表Item key
    keyExtractor(item, index) {
        return item.CategoryId + item.ProductName + index
    }

    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        this._page = 1;
        dispatch(ActionProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
        }));
    }

    refeshView() {
        this.onRefersh();
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        dispatch(ActionProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
            p: ++this._page
        }));
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff]}>
                {this.renderContent()}
            </View>
        )
    }

    //初始化数据
    WillReceive(nextProps) {
        if (nextProps.ReduceSellerLodeProducts.datas != null && nextProps.ReduceSellerLodeProducts.datas != this.props.ReduceSellerLodeProducts.datas) {
            const {ReduceSellerLodeProducts} = nextProps;
            let Products = ReduceSellerLodeProducts.datas.Products;
            this.GlobalDatas.Categorys = ReduceSellerLodeProducts.datas.Categorys;

            this.GlobalDatas.ParentCategoryId = ReduceSellerLodeProducts.datas.Categorys[0].CategoryId;
            this.GlobalDatas.ChildCategoryId = ReduceSellerLodeProducts.datas.Categorys[0].Items[0].CategoryId;

            this.setState({
                IsReceived: true,
                dataSource: Products
            });
        }
        if (nextProps.ReduceSellerProduct.datas != null && nextProps.ReduceSellerProduct.datas != this.props.ReduceSellerProduct.datas) {
            const {ReduceSellerProduct} = nextProps;

            let products = ReduceSellerProduct.datas.Products;
            let dataSource = this.state.dataSource;
            if (this._page > 1 || dataSource.length <= 0) {
                products.map((product) => {
                    dataSource.push(product)
                })
            }
            else {
                dataSource = products;
            }
            this.setState({
                IsReceived: true,
                dataSource: dataSource
            });
        }
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderProducts());
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1
    },
    content: {
        width: '100%',
        //height: px2dp(428),
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        flexDirection: "row",
        flexWrap: 'nowrap',
    },

    lists: {
        width: '74%',
        height: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(70),
        paddingTop: px2dp(9),
    },
    listItem: {
        paddingLeft: px2dp(30),
        paddingRight: px2dp(24),
        height: px2dp(40),
        flexDirection: "row",
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});

function mapStateToProps(store) {
    return {
        ReduceSellerLodeProducts: store.ReduceSellerLodeProducts,
        ReduceSellerProduct: store.ReduceSellerProduct,
        ReduceSellerProductSpecPrices: store.ReduceSellerProductSpecPrices
    }
}
const connectProviders = connect(mapStateToProps)(AddProduct1);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
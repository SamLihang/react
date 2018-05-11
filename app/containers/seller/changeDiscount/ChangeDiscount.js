import React, {Component}from "react";
import {ScrollView, StyleSheet, View, FlatList} from "react-native";
import PageComponent,{PullViewComponent} from "../../PageComponent";
import {BCImage, BCText, BCTouchable, px2dp, NavigationOptions,deviceWidth,deviceHeight} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionLoaderProducts, ActionProducts, ActionProductSpecPrices} from '../../../actions/SellerProductAction'
import ProgressBar from './../priceGroup/ProgressBar'

import Tab, {VerticalTab,HorizontalTab} from '../../../components/Tab'

class ChangeDiscount extends PageComponent {
    _FlatList = null
    _VerticalTab = null
    _page = 1;
    _Tab = null;
    _ProgressBar=null;
    GlobalDatas = {
        Categorys: [],
        ParentCategoryId: null,
        ChildCategoryId: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                {
                    Categorys:[
                        {
                            CategoryName:"烘培类",
                            Items:[
                                {CategoryName:"巧克力",},
                                {CategoryName:"油脂类",},
                                {CategoryName:"面粉类",},
                                {CategoryName:"糖类",},
                            ]
                        },
                        {
                            CategoryName:"新鲜时蔬",
                            Items:[
                                {CategoryName:"糖类",},
                                {CategoryName:"油脂类",},
                                {CategoryName:"面粉类",},
                                {CategoryName:"糖类",},
                            ]
                        },
                        {
                            CategoryName:"禽蛋肉类",
                            Items:[
                                {CategoryName:"巧克力",},
                                {CategoryName:"油脂类",},
                                {CategoryName:"面粉类",},
                                {CategoryName:"糖类",},
                            ]
                        },
                        {
                            CategoryName:"调料其他"
                        },
                        {
                            CategoryName:"米面粮油"
                        },
                    ]
                }
            ],
        }
    }
    //设置页面标题
    setTitle() {
        return "商家改价"
    }

    //点击搜索
    goSearch() {
    }

    //主分类
    Top() {
        /*let GlobalDatas = this.GlobalDatas;
        let categorys = GlobalDatas.Categorys;
        let categoryArray = categorys[0].Items;*/
        let categorys = this.state.dataSource[0].Categorys;
        let categoryArray=categorys[0].Items;
        return (
            <View>
                <Tab
                    ref={(t) => {
                        this._Tab = t
                    }}
                    Style={1}
                    Items={categorys}
                    OnPress={(i, categoryId) => {
                        const {dispatch} = this.props;
                        let GlobalDatas = this.GlobalDatas;

                       {/* GlobalDatas.ParentCategoryId = categoryId;
                        GlobalDatas.ChildCategoryId = GlobalDatas.Categorys[i].Items[0].CategoryId;

                        this._HorizontalTab.state.Items = GlobalDatas.Categorys[i].Items;
                        this._HorizontalTab.reLoad();

                        dispatch(ActionActiveProducts({
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.ChildCategoryId,
                            isActive: GlobalDatas.isActive
                        }));*/}
                    }}/>

                <HorizontalTab Items={categoryArray}
                               ref={(h) => {
                                   this._HorizontalTab = h
                               }}
                               OnPress={(i, categoryId, pid) => {
                                   const {dispatch} = this.props;
                                   let GlobalDatas = this.GlobalDatas;
                                   {/*let ppid = GlobalDatas.Categorys[i].CategoryId;

                                   GlobalDatas.ChildCategoryId = categoryId;
                                   GlobalDatas.ParentCategoryId = pid;

                                   dispatch(ActionActiveProducts({
                                       parentCategoryId: pid,
                                       categoryId: categoryId,
                                       isActive: GlobalDatas.isActive
                                   }));*/}
                               }}/>
            </View>
        )
    }

    //主要内容
    renderContent() {
        //let GlobalDatas = this.GlobalDatas;
        //let categoryArray = this.GlobalDatas.Categorys[0].Items
        let categoryArray =  this.state.dataSource.Categorys;
        return (
            <View style={[Styles.content]}>
                {/*{this.renderSecondCategory(categoryArray)}
                {this.renderList()}*/}
                <View style={{marginTop:px2dp(57),alignItems:"center",}}>
                {
                    ["一级商家","二级商家","樟树低"].map((name,index)=>{
                        return this.rederCompanys(name,index)
                    })
                }
                </View>
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
                         OnPress={(i, categoryId, pid) => {
                             const {dispatch} = this.props;
                             let GlobalDatas = this.GlobalDatas;
                             let ppid = GlobalDatas.Categorys[i].CategoryId;

                             GlobalDatas.ChildCategoryId = categoryId;
                             GlobalDatas.ParentCategoryId = pid;

                             dispatch(ActionProducts({
                                 parentCategoryId: pid,
                                 categoryId: categoryId,
                             }));
                         }}/>
        )
    }

    rederCompanys(name,index){
            return(
                <View key={index} style={{flexDirection:"row",
                    //justifyContent:"center",
                    alignItems:"center",
                    height:px2dp(60),
                    width:px2dp(deviceWidth),
                    //width:"100%",
                    backgroundColor:"#fff",
                    marginLeft:px2dp(15),
                }}>

                    <BCText style={[gs.fts_15, gs.c_3a3838, {marginRight: px2dp(12)}]}>{name}</BCText>

                    <View style={{ position: 'absolute',
                        top: px2dp(18),
                        left: px2dp(65),
                    width:px2dp(256)}}>
                    <ProgressBar
                        ref={(c) => {
                            if (c != null) {
                                this._ProgressBar=(c);
                            }
                        }}
                    />
                    </View>
                </View>
            )


    }

    //商品列表
   /* renderList() {
        return (
            <View style={[Styles.lists, gs.bgc_fff]}>
                <FlatList
                    initialNumToRender={5}
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
                />
            </View>
        )
    }*/

    //商品列表Item
   /* renderItem(rowData) {
        const {dispatch} = this.props;
        let item = rowData.item;
        return <ListItem Item={item}
                         OnClick={(productGlobalId) => {
                             this.push('AddProduct2', {productGlobalId})
                         }}/>
    }*/

    //商品列表Item key
    keyExtractor(item, index) {
        return item.CategoryId + item.ProductName
    }

    //刷新
    onRefersh() {
       /* const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        this._page = 1;
        dispatch(ActionProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
        }));*/
    }

    //加载更多
    onEndReached() {
       /* const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;

        dispatch(ActionProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
            p: ++this._page
        }));*/
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff]}>
                {this.renderContent()}
            </View>
        )
    }

    //初始化数据
   /* WillReceive(nextProps) {
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
    }*/

    WillMount() {
        const {dispatch} = this.props;
        //dispatch(ActionLoaderProducts());
        this.setState({
            IsReceived: true,
        });
    }
}

const Styles = StyleSheet.create({
    main: {
        //flex: 1
        minHeight:px2dp(deviceHeight),
    },
    content: {
        //width:px2dp(deviceWidth),
        //height: px2dp(428),
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        flexDirection: "row",
        flexWrap: 'nowrap',
        //backgroundColor:"green"
    },

    lists: {
        width: '74%',
        height: px2dp(432),
        paddingTop: px2dp(9),
        //paddingBottom: px2dp(46),
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
        //ReduceSellerLodeProducts: store.ReduceSellerLodeProducts,
        //ReduceSellerProduct: store.ReduceSellerProduct,
        //ReduceSellerProductSpecPrices: store.ReduceSellerProductSpecPrices
    }
};
const connectProviders = connect(mapStateToProps)(ChangeDiscount);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
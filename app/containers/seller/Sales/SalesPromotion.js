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
import {BCDoNavigator} from '../../../containers/seller/Sales/PromotionBCNavigator'

import {
    ActionPromotionProducts,
    ActionLoadPromotionProducts,
    ActionPostActiveProducts,
} from '../../../actions/SellerPromotionAction';
import {fetchPostActiveProducts} from '../../../services/SellerPromotionServices'


class Dl extends Component {
    _Product = {}
    _CheckBox = {}

    static defaultProps = {
        product: {}
    };
    static propTypes = {
        IsOpen: React.PropTypes.bool,
        product: React.PropTypes.object,
        OnSelect: React.PropTypes.func,
        ToPush: React.PropTypes.func,
        NowTime: React.PropTypes.number,
    }

    constructor(props) {
        super(props);
        this.state = {
            specState: false,
            ToPush: props.ToPush,
            isSelect: props.isSelect,
            IsOpen: false,
            NowTime: parseInt(props.product.NowTime.substring(6,props.product.NowTime.length-2))/1000
        }
        this._index= parseInt(props.product.NowTime.substring(6,props.product.NowTime.length-2))/1000;
        this._timer=null;
    }

    onChangeSelect(isSelect,IsPromotion) {
        this.setState({
            isSelect: isSelect
        }, () => {
            if(IsPromotion){
                this._CheckBox.OnChange(isSelect)
            }

        })
    }

    _goDetail(ProductGlobalId,PromotionBegin,PromotionEnd) {
        this.props.GoDetail(ProductGlobalId,PromotionBegin,PromotionEnd);
    }

    openList(){
        this.setState({
            IsOpen: !this.state.IsOpen
        })
    };
    canOpen(){
        let IsOpen = this.state.IsOpen;
        return(
            <View>
                <BCTouchable style={[styles.upandown]}
                    onPress={() => {
                        this.openList();
                    }}>
                    <BCText style={[gs.fts13,gs.c_666]}>规格详情</BCText>
                    <BCImage
                        source={IsOpen ? require('../../../imgs/down.png'):require('../../../imgs/up.png') }
                        style={{marginLeft: px2dp(5),marginTop: px2dp(8)}}/>
                </BCTouchable>
            </View>
        )
    };
    canotOpen(Specs){
        return(
            <View style={[styles.listDetailRight]}>
                <BCText style={[gs.c_fd0319]}>
                    <BCText style={[gs.fts_11]}>¥</BCText>
                    <BCText style={[gs.fts_13]}>{Specs[0].PromotionPrice?Specs[0].PromotionPrice:Specs[0].Price}</BCText>
                    <BCText style={[gs.fts_13]}>{'/'+Specs[0].Unit}</BCText>
                </BCText>
                {Specs[0].PromotionPrice == 1?
                    <View style={[gs.bgc_fd0319,styles.down]}>
                        <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                    </View>:null}
            </View>
        )
    };
    drawLei(item,index){
        let SpecName = item.SpecName;
        let Unit = item.Unit;
        return(
            <View key={index} style={[styles.SpecItem]}>
                <View>
                    <BCText style={[gs.fts_13,gs.c_fd0319]}>{SpecName}</BCText>
                </View>
                <View style={[styles.listDetailRight]}>
                    <BCText style={[gs.c_fd0319]}>
                        <BCText style={[gs.fts_11]}>¥</BCText>
                        <BCText style={[gs.fts_13]}>{item.PromotionPrice?item.PromotionPrice:item.Price}</BCText>
                        <BCText style={[gs.fts_13]}>/{Unit}</BCText>
                    </BCText>
                    {item.PromotionPrice == 1?
                        <View style={[gs.bgc_fd0319,styles.down]}>
                            <BCText style={[gs.fts_10,gs.c_fff]}>降</BCText>
                        </View>:null}
                </View>
            </View>
        )
    }
    dropLine(PromotionSpecs,product){
        let Specs = PromotionSpecs.length>0 ? PromotionSpecs : product.Specs;
    return (
        <View style={{borderBottomWidth:1,borderColor:'#EEE'}}>{
            Specs.length>1?<View style={{marginLeft: px2dp(130),marginRight: px2dp(12),width: px2dp(220)}}>
                {Specs.map((item,index)=>this.drawLei(item,index))}
            </View>:null
        }
        </View>
        )
    };
    //倒计时
    componentDidMount() {
        this._timer&&clearInterval(this._timer);
        this._timer = setInterval(
            () => {this.setState({NowTime : this._index++});
            },
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this._timer);
    }
    startTime(PromotionBegin,PromotionEnd,NowTime,ProductGlobalId){
        PromotionBegin=parseInt(PromotionBegin.substring(6,PromotionBegin.length-2));
        PromotionEnd=parseInt(PromotionEnd.substring(6,PromotionEnd.length-2));
        let RemainingTime=0;
        if(PromotionBegin > NowTime){
              RemainingTime = PromotionBegin - NowTime;
        }else if(NowTime < PromotionEnd && PromotionBegin < NowTime) {
             RemainingTime = PromotionEnd - NowTime;
             if(RemainingTime<=1000){
                     fetchPostActiveProducts({
                         productGlobalIds: ProductGlobalId,
                     }).then(() => {
                         this.onRefersh()
                     }).catch((e) => {

                     });
             }
        }
        let Day=parseInt(RemainingTime/(1000 * 60 * 60 * 24));
        let Hour=parseInt(RemainingTime%(1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        let Minute=parseInt((RemainingTime % (1000 * 60 * 60) / (1000 * 60)));
        let Second=parseInt(RemainingTime % (1000 * 60) / 1000);
        return(
            <View>
                <BCText style={[gs.c_3a3838]}>
                    <BCText style={[gs.fts_13]}>{PromotionBegin<NowTime?'促销结束：':'促销开始：'}</BCText>
                    <BCText style={[gs.c_31ca96]}>{this.fix(Day,2)+':'+this.fix(Hour,2)+':'+this.fix(Minute,2)+':'+this.fix(Second,2)}</BCText>
                </BCText>
            </View>
        )
    }
    //转化为两位数字
    fix(num, length) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
    }
    // drawCheckBox(isSelect,ProductGlobalId){
    //     return(
    //         <CheckBox
    //             IsSelect={isSelect}
    //             ref={(c) => {
    //                 this._CheckBox = c
    //             }}
    //             OnChange={(isSelect) => {
    //                 this.setState({
    //                     isSelect: isSelect
    //                 }, () => {
    //                     this.props.OnSelect(isSelect,ProductGlobalId)
    //                 })
    //
    //             }}/>
    //     )
    // }
    JudgePromotionSpec(product,PromotionSpecs){
        if(PromotionSpecs.length>0){
            if(PromotionSpecs.length<2){
                return PromotionSpecs[0].SpecName
            }else {return '多种规格'}
        }else {
            if(product.Specs.length<2){
                return product.Specs[0].SpecName
            }else {return '多种规格'}
        }
    }
    JudegPromotionPrice(product,PromotionSpecs){
        if(PromotionSpecs.length>0){
            if(PromotionSpecs.length>1){
                return this.canOpen()
            }else {
                return this.canotOpen(PromotionSpecs)
            }
        }else {
            if(product.Specs.length>1){
                return this.canOpen()
            }else {
                return this.canotOpen(product.Specs)
            }
        }
    }
    render() {
        const {dispatch} = this.props;
        let product = this.props.product;
        let ProductGlobalId = product.ProductGlobalId;
        let PromotionSpecs = [];
        let PromotionNowTime = product.NowTime ? parseInt(product.NowTime.replace('/Date(','').replace(')/','')):0;
        let PromotionEndTime = product.PromotionEnd ? parseInt(product.PromotionEnd.replace('/Date(','').replace(')/','')):0;
        for(let SpecsContent of product.Specs){
            if(SpecsContent.PromotionPrice){
                PromotionSpecs.push(SpecsContent)
            }
        }
        return (
            <View>
            <View style={[styles.listItem, gs.bgc_fff]}>
                <View>{PromotionEndTime > PromotionNowTime ?
                    <CheckBox
                    IsSelect={this.state.isSelect}
                    ref={(c) => {
                        this._CheckBox = c
                    }}
                    OnChange={(isSelect) => {
                        this.setState({
                            isSelect: isSelect
                        }, () => {
                            this.props.OnSelect(isSelect, product.ProductGlobalId)
                        })

                    }}/>:null}</View>
                    <BCTouchable>
                        <BCHostImage style={styles.productImg}
                                     source={{uri: product.Image60}}/>
                    </BCTouchable>
                    <View style={styles.listItemRight}>
                        <BCTouchable onPress={() => {
                            this._goDetail(ProductGlobalId,product.PromotionBegin,product.PromotionEnd)
                        }}>
                        <View style={styles.listDetail}>
                            <BCText
                                style={[gs.fts_15, gs.c_3a3838]}>{substr(product.ProductName, 11)}
                            </BCText>
                            <View style={[styles.productDetail]}>
                                <BCText style={[gs.fts_13, gs.c_3a3838]}>编辑</BCText>
                            </View>
                        </View>
                        <View>{PromotionEndTime > PromotionNowTime?this.startTime(product.PromotionBegin,product.PromotionEnd,this.state.NowTime*1000,product.ProductGlobalId):null}</View>
                        <View style={styles.listDetail}>
                            <BCText style={[gs.c_3a3838]}>
                                <BCText style={[gs.fts_13]}>{this.JudgePromotionSpec(product,PromotionSpecs)}</BCText>
                            </BCText>
                            <View>{this.JudegPromotionPrice(product,PromotionSpecs)}</View>
                        </View>
                        </BCTouchable>
                    </View>
                </View>
                <View style={[gs.bgc_fff]}>{this.state.IsOpen?this.dropLine(PromotionSpecs,product):null}</View>
            </View>
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
                            isSelect: isSelect
                        }, () => {
                            this.props.OnSelectAll(isSelect)
                        })
                    }}/>
                <BCText style={[gs.fts_15, gs.c_3a3838]}>全选</BCText>
                <BCTouchable style={[this.state.isGray ? gs.bgc_ccc : gs.bgc_00c164, styles.cancel]} onPress={() => {
                    this.props.OnActive(this.state.side)
                }}>
                    <BCText style={[gs.c_fff, gs.fts_17]}>取消促销</BCText>
                </BCTouchable>
            </View>
        )
    }
}

class SalesPromotion extends PullListComponent {
    _Products = {};
    _Bottom = {};
    _Tab = null;
    _HorizontalTab = null;
    ProductGlobalIds = [];
    GlobalDatas = {
        Categorys: [],
        ParentCategoryId: null,
        ChildCategoryId: null,
        IsPromotion: true,
        changeCategory: false
    };
    isSelectAll = false;

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isPromotion:true,
        };
    }

    renderNavigator() {
        return (
            <BCDoNavigator navigation={this.props.navigation}
                           backCallBack={()=>{
                               this.props.navigation.navigate("SellerIndex",{ companyTypeId: 2})
                           }}
                           OnChange={(type) => {
                               const {dispatch} = this.props;
                               this.setState({isPromotion:(type == 'left') ? true : false})
                               this._page = 1;
                               //发送请求
                              // dispatch(ActionLoadPromotionProducts(type == 'left'));
                               dispatch(ActionPromotionProducts({
                                   parentCategoryId: this.GlobalDatas.ParentCategoryId,
                                   categoryId: this.GlobalDatas.ChildCategoryId,
                                   //IsPromotion: GlobalDatas.IsPromotion
                                   IsPromotion:type == 'left'
                               }));
                               this.isSelectAll = false;
                               this.ProductGlobalIds = [];
                               Object.keys(this._Products).forEach((id) => {
                                   let productDl = this._Products[id];
                                   if (productDl) {
                                       productDl.onChangeSelect(false,this.state.isPromotion);
                                   }
                               });

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
        this._timer && clearInterval(this._timer);
        this.push('ProductsSearch', {
            callBack: this.refeshView.bind(this),
            isPromotion: this.state.isPromotion,
            //IsPromotion: this.GlobalDatas.IsPromotion
        })
    }

    Top() {
        let GlobalDatas = this.GlobalDatas;
        let categorys = GlobalDatas.Categorys;
        let categoryArray = categorys[0].Items;
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

                        GlobalDatas.ParentCategoryId = categoryId;
                        GlobalDatas.ChildCategoryId = GlobalDatas.Categorys[i].Items[0].CategoryId;

                        this._HorizontalTab.state.Items = GlobalDatas.Categorys[i].Items;
                        this._HorizontalTab.reLoad();
                        //重置全选 清空ProductGlobalIds
                        this.isSelectAll = false;
                        this.ProductGlobalIds = [];

                        Object.keys(this._Products).forEach((id) => {
                            let productDl = this._Products[id];
                            if (productDl) {
                                productDl.onChangeSelect(false,this.state.isPromotion);
                            }
                        });
                        this._page = 1;
                        dispatch(ActionPromotionProducts({
                            parentCategoryId: categoryId,
                            categoryId: GlobalDatas.ChildCategoryId,
                            //IsPromotion: GlobalDatas.IsPromotion
                            IsPromotion:this.state.isPromotion
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
                                   Object.keys(this._Products).forEach((id) => {
                                       let productDl = this._Products[id];
                                       if (productDl) {
                                           productDl.onChangeSelect(false,this.state.isPromotion);
                                       }
                                   });

                                   this._page = 1;
                                   dispatch(ActionPromotionProducts({
                                       parentCategoryId: pid,
                                       categoryId: categoryId,
                                       //IsPromotion: GlobalDatas.IsPromotion
                                       IsPromotion:this.state.isPromotion
                                   }));
                               }}/>
            </View>
        )
    }

    renderRow(data) {
        const product = data.item;
        const {dispatch} = this.props;
        return <Dl
            ref={(p) => {
                this._Products[product.ProductGlobalId] = p;
            }}
            product={product}
            dispatch={dispatch}
            isSelect={this.isSelectAll}
            OnSelect={(isSelect, ProductGlobalId) => {
                if (isSelect) {
                    //把bottom的颜色改为亮色
                    if (this._Bottom.state.isGray) {
                        this._Bottom.onChangeColor(false);
                    }
                    //将选中的商品加入ProductGlobalIds
                    if (!this.ProductGlobalIds.includes(ProductGlobalId)) {
                        this.ProductGlobalIds.push(ProductGlobalId)
                    }
                    //如果全选了 改变底部
                    if (this.ProductGlobalIds.length == this.state.dataSource.length) {
                        this._Bottom.onReset(false, true);
                    }
                }
                else {
                    //删除
                    let index = this.ProductGlobalIds.findIndex(id => id == ProductGlobalId);
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
            GoDetail={(productGlobalId, PromotionBegin, PromotionEnd) => {
                this._timer && clearInterval(this._timer);
                this.push('PromotionDetails', {
                    ProductId: productGlobalId,
                    PromotionBegin: PromotionBegin,
                    PromotionEnd: PromotionEnd,
                    finishEdit:this.finishEdit.bind(this)
                })
            }}
        />
    }

    finishEdit(){
        this.setState({dataSource:[]});
        this._page=1;
    }
    //刷新
    onRefersh() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        //重置全选 清空ProductGlobalIds
        this.isSelectAll = false;
        this.ProductGlobalIds = [];
        this._timer&&clearInterval(this._timer);
        Object.keys(this._Products).forEach((id) => {
            let productDl = this._Products[id];
            if (productDl) {
                productDl.onChangeSelect(false,this.state.isPromotion);
            }
        });
        this._page = 1;
        dispatch(ActionPromotionProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
            IsPromotion: this.state.isPromotion
        }));
    }

    refeshView() {
        this.onRefersh();
    }

    //加载更多
    onEndReached() {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        dispatch(ActionPromotionProducts({
            parentCategoryId: GlobalDatas.ParentCategoryId,
            categoryId: GlobalDatas.ChildCategoryId,
            p: ++ this._page,
            IsPromotion: this.state.isPromotion
        }));
    }

    Bottom() {
        return (
            this.state.isPromotion?
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
                            productDl.onChangeSelect(isSelect,this.state.isPromotion);
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
            />:null
        )
    }

    WillMount() {
        const {dispatch} = this.props;

        dispatch(ActionLoadPromotionProducts(true));
    }

    //初始化数据
    WillReceive(nextProps) {
        if (nextProps.ReduceLoadPromotionProducts.datas != null && nextProps.ReduceLoadPromotionProducts.datas != this.props.ReduceLoadPromotionProducts.datas) {
            const {ReduceLoadPromotionProducts} = nextProps;
            let Products = ReduceLoadPromotionProducts.datas.Products;
            this.GlobalDatas.Categorys = ReduceLoadPromotionProducts.datas.Categorys;
            this.GlobalDatas.ParentCategoryId = null;
            this.GlobalDatas.ChildCategoryId = null;
            let Pageheight=deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(154);

            if(!this.state.isPromotion){
                Pageheight=deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(100);
            }
            this.setState({
                IsReceived: true,
                dataSource: Products,
                FlatListHeight: Pageheight
            });
        }
        if (nextProps.ReducePromotionProduct.datas != null && nextProps.ReducePromotionProduct.datas != this.props.ReducePromotionProduct.datas) {
            const {ReducePromotionProduct} = nextProps;
            let products = ReducePromotionProduct.datas.Products;
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
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },

    content: {
        flex: 1,
        //borderTopWidth: 1,
        //borderTopColor: '#e3e3e3'
    },

    listRow:{
        flexDirection: 'column',
        flexWrap:'nowrap',
        justifyContent:'center',
        alignItems:'center',
    },

    SpecItem:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height : px2dp(35),
        borderBottomWidth: 1,
        borderColor: '#EEE'
    },

    listItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: px2dp(5),
        paddingBottom: px2dp(5),
        paddingRight: px2dp(12),
        borderBottomWidth: 1,
        borderColor: '#EEE'
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(8),
        marginLeft: px2dp(11),
    },
    listItemRight: {
        flex: 1,
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
    cancel: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
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
    upandown:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

function mapStateToProps(store) {
    return {
        ReduceLoadPromotionProducts: store.ReduceLoadPromotionProducts,
        ReducePromotionProduct: store.ReducePromotionProduct
    }
}

const salesPromotion = connect(mapStateToProps)(SalesPromotion);
salesPromotion.navigationOptions = NavigationOptions;
export default salesPromotion;
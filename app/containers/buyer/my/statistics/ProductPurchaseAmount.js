/**
 * Created by Administrator on 2017/5/19.
 */
//采购统计
import React from "react";
import {StyleSheet, View, Platform} from "react-native";
import {
    BCHostImage, BCText, deviceWidth, NavigationOptions, px2dp, deviceHeight,
    BCTouchable,BCImage
} from "../../../../BaseComponent";
import {PullListComponent} from "../../../PageComponent";
import gs from "../../../../styles/MainStyles";
import {connect} from "react-redux";
import {
    ActionLoaderProductPurchaseAmount,
    ActionProductPurchaseAmount
} from "../../../../actions/ProductPurchaseAmountAction";
import Tab from "../../../../components/Tab";
import {Today} from '../../../../utils/CommonFuns';
import {formaTime, toDecimal2} from "../../../../utils/FormatUtil";

class ProductPurchaseAmount extends PullListComponent {
    GlobalDatas = [];

    constructor(props) {
        super(props);
        let Today = new Date();
        this.Month = Today.getMonth() + 1 < 10 ? '0' + (Today.getMonth() + 1) : Today.getMonth() + 1;
        this.Year = Today.getFullYear();
        this.statisticsTime = this.Year+'年'+this.Month+'月';
        this.state = {
            dataSource: []
        }
    }

    //设置页面标题
    setTitle() {
        return (
            <BCText>
                <BCImage style={{width:Platform.OS=='ios'?px2dp(12):px2dp(36),height:Platform.OS=='ios'?px2dp(12):px2dp(36), marginRight: px2dp(12)}}
                         source={require("../../../../imgs/date.png")}></BCImage>
                <BCText style={[gs.fts_15,gs.c_666]}>{this.statisticsTime}</BCText>
            </BCText>

        )
    }

    // isShowImage() {
    //     return true
    // }

    Top() {
        let categoryArray = this.GlobalDatas;
        if (categoryArray.length > 0) {
            return(
            <View >
                {/*<View style={[styles.title]}>*/}
                    {/*/!*<BCTouchable style={[styles.titleCon]} onPress={() => {*!/*/}
                        {/*/!*this.push('MonthPicker', {pageFrom: 'statistics', callBack: this.setTime.bind(this)})*!/*/}
                    {/*/!*}}>*!/*/}
                        {/*<BCImage style={{marginRight: px2dp(10)}}*/}
                                 {/*source={require("../../../../imgs/date.png")}></BCImage>*/}
                        {/*<BCText style={[gs.fts_15,gs.c_666]}>{this.statisticsTime}</BCText>*/}
                    {/*/!*</BCTouchable>*!/*/}
                {/*</View>*/}
                <Tab
                    Style={1}
                    Items={categoryArray}
                    OnPress={(i, categoryId) => {
                        const {dispatch} = this.props;
                        this.GlobalDatas.CategoryId = categoryId;
                        //发送请求
                        dispatch(ActionProductPurchaseAmount({parentCategoryId: categoryId}));
                    }}/>
            </View>)
        }
    }

    setTime(year, month) {
        this.Year = year;
        this.Month = month;
        this.statisticsTime = year + '年' + month + '月';
    }

    keyExtractor(item, index) {
        return index
    }

    renderRow(rowData) {
        const product = rowData.item;
        return (
            <View style={[gs.bgc_fff]}>
                <View style={[styles.ItemView]}>
                    <BCHostImage style={{width: px2dp(60), height: px2dp(60)}}
                                 source={{uri: product.Image200}}/>
                    <View style={styles.RightStyle}>
                        <BCText
                            style={[gs.fts_15, gs.c_3a3838, {marginBottom: px2dp(20)}]}>{product.ProductName}</BCText>
                        {/*{
                         product.map((s, i) => {
                         return (
                         <View key={i} style={[styles.BottomStyle]}>
                         <BCText style={[gs.fts_14, gs.c_3a3838]}>{s.Spec}</BCText>
                         <BCText style={[gs.fts_13, gs.c_3a3838]}>{s.Amount}</BCText>
                         </View>
                         )
                         })
                         }*/}
                        <View style={[styles.BottomStyle]}>
                            <BCText style={[gs.fts_14, gs.c_3a3838]}>{product.Spec}</BCText>
                            <BCText style={[gs.fts_13, gs.c_3a3838]}>{product.Amount}</BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    Bottom() {
        return (
            this.renderBottom()
        )
    }

    renderBottom() {
        let datas = this.props.ReduceLoaderProductPurchaseAmount.datas
        return (
            <View style={styles.footerWrap}>
                <BCText style={[gs.c_3a3838, gs.fts_13]}>日采购额: </BCText>
                <BCText style={[gs.c_fd0319, gs.fts_13]}>¥{toDecimal2(datas.AmountToday)}</BCText>
            </View>
        )
    }

    onRefersh(item) {
        const {dispatch} = this.props;
        this._page = 0;
        dispatch(ActionProductPurchaseAmount({parentCategoryId: this.GlobalDatas.CategoryId}));
    }

    onEndReached() {
        const {dispatch} = this.props;
        this._page++
        dispatch(ActionProductPurchaseAmount({p: this._page, parentCategoryId: this.GlobalDatas.CategoryId}));
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoaderProductPurchaseAmount());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoaderProductPurchaseAmount.datas != null && nextProps.ReduceLoaderProductPurchaseAmount.datas != this.props.ReduceLoaderProductPurchaseAmount.datas) {
            const {ReduceLoaderProductPurchaseAmount} = nextProps;
            let datas = ReduceLoaderProductPurchaseAmount.datas;
            const Category = datas.Category;
            const products = datas.PurchaseStatistics;

            this.GlobalDatas = Category;

            this.setState({
                IsReceived: true,
                dataSource: products,
                FlatListHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(45) ) - px2dp(45) - px2dp(43)
            });
        }
        if (nextProps.ReduceProductPurchaseAmount.datas != null && nextProps.ReduceProductPurchaseAmount.datas != this.props.ReduceProductPurchaseAmount.datas) {
            const {ReduceProductPurchaseAmount} = nextProps;
            const products = ReduceProductPurchaseAmount.datas.PurchaseStatistics;

            let Products = this.state.dataSource;
            if (this._page > 1) {
                products.map((product) => {
                    Products.push(product)
                })
            }
            else {
                Products = products
            }

            this.setState({
                dataSource: Products,
            });
        }
    }
}

const styles = StyleSheet.create({
    title:{
        width: '100%',
        height: px2dp(45),
        position: 'absolute',
        marginTop: px2dp(-45),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleCon:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    outView: {
        height: px2dp(500),
        width: '100%'
    },
    ItemView: {
        flexDirection: 'row',
        marginTop: px2dp(12),
        marginLeft: px2dp(20)
    },
    RightStyle: {
        marginLeft: px2dp(8),
        alignContent: 'space-between'
    },
    BottomStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: px2dp(17),
        width: px2dp(270)
    },
    footerWrap: {
        backgroundColor: '#fff',
        height: px2dp(45),
        width: deviceWidth,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function mapStateToProps(store) {
    return {
        ReduceLoaderProductPurchaseAmount: store.ReduceLoaderProductPurchaseAmount,
        ReduceProductPurchaseAmount: store.ReduceProductPurchaseAmount
    }
}

const connectProviders = connect(mapStateToProps)(ProductPurchaseAmount);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
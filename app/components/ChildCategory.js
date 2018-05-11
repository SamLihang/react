import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {BCImage, BCText, BCTouchable, px2dp} from "../BaseComponent";
import gs from "../styles/MainStyles";

import Calculate from './Calculate';

export default class ChildCategory extends Component {
    static defaultProps = {
        categoryArray: [],
    };
    static propTypes = {
        categoryArray: React.PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            categoryArray: props.categoryArray
        }
    }

    //购物车列表
    renderCartList(e, index) {
        return (
            <View style={[styles.cartItem]} key={index}>
                <BCText style={[gs.fts_15, gs.c_3a3838]}>{e.ProductName}</BCText>
                <View style={[styles.cartItemRight]}>
                    <BCText style={[styles.cartItemPrice, gs.fts_13, gs.c_fd0319]}>￥{e.Price}</BCText>
                    <Calculate
                        /*ref={(c) => {
                         this._Products[e.ProductId] = c;
                         }}*/
                        ProductId={e.ProductId}
                        Quantity={e.Quantity}
                        OnChange={(type) => {
                            const product = this.props._products[e.ProductId];
                            if (type == 'add') {
                                product.onAdd()
                            }
                            else if (type == 'reduce') {
                                product.onReduce()
                            }
                        }}
                        key={e.ProductId}/>
                </View>
            </View>
        )
    }

    //点击二级分类
    onClickSecondCategory(i, ParentCategoryId, CategoryId) {
        const {dispatch} = this.props;
        let GlobalDatas = this.GlobalDatas;
        GlobalDatas.ParentCategoryId = ParentCategoryId;
        GlobalDatas.CategoryId = CategoryId;

        let childCategorys = GlobalDatas.ChildCategorys;
        if (!childCategorys[i].IsSelect) {
            dispatch(ActionProducts({
                bCompanyId: GlobalDatas.bCompanyId,
                sCompanyId: GlobalDatas.sCompanyId,
                priceGroupId: GlobalDatas.Provider.PriceGroupId,
                parentCategoryId: ParentCategoryId,
                categoryId: CategoryId
            }));
            childCategorys.map((e, index) => {
                if (i == index) {
                    childCategorys[index].IsSelect = 1;
                }
                else {
                    childCategorys[index].IsSelect = 0;
                }
            })
        }
    }

    render() {
        return (
            <View style={[styles.secondCategory, gs.bgc_f2f1ef]}>
                {
                    this.state.categoryArray.map((e, i) => {
                        return (
                            <BCTouchable key={i}
                                         style={[styles.secondCategoryItem, e.IsSelect ? gs.bgc_fff : gs.bgc_f2f1ef]}
                                         onPress={() => {
                                             this.onClickSecondCategory(i, e.ParentCategoryId, e.CategoryId)
                                         }}>
                                <BCText
                                    style={[gs.fts_15, e.IsSelect ? (gs.bold, gs.c_00C164) : gs.c_888]}>{e.CategoryName}</BCText>
                            </BCTouchable>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    secondCategory: {
        width: '26%',
    },
    secondCategoryItem: {
        width: px2dp(100),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
});
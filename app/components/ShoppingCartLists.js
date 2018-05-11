import React, {Component} from "react";
import {StyleSheet, View, ScrollView} from "react-native";
import {BCImage, BCText, BCTouchable, px2dp} from "../BaseComponent";
import gs from "../styles/MainStyles";

import Calculate from './Calculate';

export default class ShoppingCartLists extends Component {
    static defaultProps = {
        listsItems: [],
        _products: {}
    };
    static propTypes = {
        listsItems: React.PropTypes.array,
        OnClearData: React.PropTypes.func,
        _products: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            listsItems: props.listsItems
        }
    }

    //items
    SetListsData(items) {
        this.setState({
            listsData: items
        })
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

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={[styles.cartContent, gs.bgc_fff]}>
                {this.state.listsItems.map((e, i) => {
                    return this.renderCartList(e, i)
                })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    cartContent: {
        paddingLeft: px2dp(9),
        paddingRight: px2dp(14),
    },
    cartItem: {
        height: px2dp(45),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8'
    },
    cartItemRight: {
        flexDirection: "row",
        alignItems: 'center',
    },
    cartItemPrice: {
        marginRight: px2dp(25)
    },
});
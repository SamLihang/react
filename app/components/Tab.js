/**
 * RenderData:{name,id}:需要渲染的数据(一个name,一个id)
 * Items:数组,每一个元素中必须有IsSelect
 * Type:类型*/

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TextInput,
    Alert,
    InteractionManager,
    ScrollView
} from 'react-native';
import BaseComponent, {deviceWidth, deviceHeight, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {toastLong} from '../utils/ToastUtil'

export default class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Items: props.Items,
            RenderData: props.RenderData,
            Style: props.Style,
            ParentCategoryId:props.ParentCategoryId,
        }
    }

    static defaultProps = {
        Items: [],
        RenderData: {name: 'CategoryName', id: 'CategoryId'},
        Style: 0,
        ParentCategoryId:0
    };
    static propTypes = {
        Items: React.PropTypes.array,
        OnPress: React.PropTypes.func,
        RenderData: React.PropTypes.object,
        Style: React.PropTypes.number,
        ParentCategoryId:React.PropTypes.number,
    };

    //reLoad 重新加载此组件,可以将选中在在状态重置为第一个
    reLoad() {
        let Items = this.state.Items
        Items.map((item, index) => {
            if (index == 0) {
                Items[index].IsSelect = 1;
            }
            else {
                Items[index].IsSelect = 0;
            }
        })
        this.setState({
            Items: Items
        })
    }
    Load(){
        if (this.state.ParentCategoryId){
            let Items = this.state.Items
            Items.map((item, index) => {
                if (item.categoryId=this.state.ParentCategoryId) {
                    Items[index].IsSelect = 1;
                }
                else {
                    Items[index].IsSelect = 0;
                }
            })
            this.setState({
                Items: Items
            })
        }else{
            reLoad()
        }



    }

    _onPress(i, categoryId, pid) {
        let Items = this.state.Items
        this.state.ParentCategoryId=categoryId
        if (Items[i].IsSelect) {
            return false
        }
        Items.map((item, index) => {
            if (i == index) {
                Items[index].IsSelect = 1;
            }
            else {
                Items[index].IsSelect = 0;
            }
        })
        this.setState({
            Items: Items
        }, () => {
            this.props.OnPress(i, categoryId, pid)
        })
    }

    render() {
        if (this.state.ParentCategoryId){
         let Items = this.state.Items
         Items.map((item, index) => {
             if (item.CategoryId==this.state.ParentCategoryId) {
                 Items[index].IsSelect = 1;
            }
             else {
                 Items[index].IsSelect = 0;
             }
         })
         this.state.Items=Items
        }
        let renderData = this.state.RenderData;
        let styles = this.state.Style ? styles1 : styles0
        return (
            <View style={[styles.Category, gs.bgc_fff]}>
                <ScrollView contentContainerStyle={[{paddingLeft: px2dp(28)}]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                    {
                        this.state.Items.map((item, index) => {
                            return (
                                <BCTouchable key={'p' + index}
                                             style={[styles.CategoryItem, item.IsSelect ? gs.bdc_00C164 : gs.bdc_fff]}
                                             onPress={() => {
                                                 this._onPress(index, item[renderData.id])
                                             }}>
                                    <BCText
                                        style={[gs.fts_15, item.IsSelect ? gs.c_00C164 : gs.c_3a3838]}>{item[renderData.name]}</BCText>
                                </BCTouchable>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

export class VerticalTab extends Tab {
    constructor(props) {
        super(props);
        this.state = {
            Items: props.Items,
            RenderData: props.RenderData,
            childCategory:props.childCategory
        }
    }

    static defaultProps = {
        Items: [],
        RenderData: {name: 'CategoryName', id: 'CategoryId', pid: 'ParentCategoryId'},
        childCategory:0
    };
    static propTypes = {
        RenderData: React.PropTypes.object,
        childCategory:React.PropTypes.number
    };

    //reLoad 重新加载此组件,可以将选中在在状态重置为第一个
    reLoad() {
        let Items = this.state.Items
        Items.map((item, index) => {
            if (index == 0) {
                Items[index].IsSelect = 1;
            }
            else {
                Items[index].IsSelect = 0;
            }
        })
        this.setState({
            Items: Items
        })
    }

    render() {
        if (this.state.childCategory){
            let Items = this.state.Items
            Items.map((item, index) => {
                if (item.CategoryId==this.state.childCategory) {
                    Items[index].IsSelect = 1;
                }
                else {
                    Items[index].IsSelect = 0;
                }
            })
            this.state.Items=Items
        }
        let renderData = this.state.RenderData;
        let styles = styles0
        this.state.childCategory=undefined
        return (
            <View style={[styles.secondCategory, gs.bgc_f2f1ef]}>
                <View style={[{height: this.props.Height ? null : px2dp(350)}]}>
                    <ScrollView contentContainerStyle={[]}
                                showsVerticalScrollIndicator={false}>
                        {
                            this.state.Items.map((item, index) => {
                                return (
                                    <BCTouchable key={'c' + index}
                                                 style={[styles.secondCategoryItem, item.IsSelect ? gs.bgc_fff : gs.bgc_f2f1ef]}
                                                 onPress={() => {
                                                     this._onPress(index, item[renderData.id], item[renderData.pid])
                                                 }}>
                                        <BCText
                                            style={[gs.fts_15, item.IsSelect ? (gs.bold, gs.c_00C164) : gs.c_888]}>{item[renderData.name]}</BCText>
                                    </BCTouchable>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        )

    }
}

export class HorizontalTab extends Tab {
    constructor(props) {
        super(props);
        this.state = {
            Items: props.Items,
            RenderData: props.RenderData
        }
    }

    static defaultProps = {
        Items: [],
        RenderData: {name: 'CategoryName', id: 'CategoryId', pid: 'ParentCategoryId'},
    };
    static propTypes = {
        RenderData: React.PropTypes.object,
    };

    //reLoad 重新加载此组件,可以将选中在在状态重置为第一个
    reLoad() {
        let Items = this.state.Items
        Items.map((item, index) => {
            if (index == 0) {
                Items[index].IsSelect = 1;
            }
            else {
                Items[index].IsSelect = 0;
            }
        })
        this.setState({
            Items: Items
        })
    }

    render() {
        let renderData = this.state.RenderData;
        let styles = styles2
        return (
            <View style={[styles.secondCategory, gs.bgc_f2f1ef]}>
                <ScrollView contentContainerStyle={[]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                    {
                        this.state.Items.map((item, index) => {
                            return (
                                <BCTouchable key={'h' + index}
                                             style={[styles.secondCategoryItem, gs.bgc_f2f1ef]}
                                             onPress={() => {
                                                 this._onPress(index, item[renderData.id], item[renderData.pid])
                                             }}>
                                    <BCText
                                        style={[gs.fts_15, item.IsSelect ? (gs.bold, gs.c_00C164) : gs.c_888]}>{item[renderData.name]}</BCText>
                                </BCTouchable>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles0 = StyleSheet.create({
    Category: {
        flexWrap: 'nowrap',
    },
    CategoryItem: {
        height: px2dp(28),
        borderBottomWidth: 2,
        alignItems: 'center',
        paddingTop: px2dp(2),
        marginRight: px2dp(24)
    },

    secondCategory: {
        width: '26%',
        height: deviceHeight,
        paddingBottom: px2dp(66)
    },
    secondCategoryItem: {
        width: px2dp(100),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center'
    },
});

const styles1 = StyleSheet.create({
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
    }
});

const styles2 = StyleSheet.create({
    secondCategory: {
        width: deviceWidth,
        height: px2dp(40),
        paddingLeft: px2dp(20)
    },
    secondCategoryItem: {
        //width: px2dp(100),
        height: px2dp(40),
        paddingHorizontal: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center'
    },
});

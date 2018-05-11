/**
 * RenderData:{name,id}:需要渲染的数据(一个name,一个id)
 * Items:数组,每一个元素中必须有IsSelect*/

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
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {toastLong} from '../utils/ToastUtil'

export default class Tab extends Component {
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
        Items: React.PropTypes.array,
        OnPress: React.PropTypes.func,
        RenderData: React.PropTypes.object,
    };

    _onPress(i, categoryId, pid) {
        let Items = this.state.Items
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
        let renderData = this.state.RenderData;
        return (
            <View style={[styles.secondCategory, gs.bgc_f2f1ef]}>
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
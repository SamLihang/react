/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    Keyboard
} from 'react-native';
import {PullViewComponent} from '../../PageComponent';
import {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    BCHostImage
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import SearchInputBar from '../../../components/SearchInputBar';
import {toastShort} from '../../../utils/ToastUtil';
import {Calculate} from '../../../components/Calculate';

import {fetchProducts} from '../../../services/SellerProductServices';

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
        this.props.OnClick(ProductGlobalId)
    }

    changeSelectState(IsSelect) {
        this.setState({
            IsSelect: IsSelect
        })
    }

    render() {
        let item = this.props.Item;
        return (
            <BCTouchable style={styles.listItem} onPress={() => {
                this._onPress(item.ProductGlobalId)
            }}>
                <BCText style={[gs.fts_14, gs.c_3a3838]}>{item.ProductName}</BCText>
            </BCTouchable>
        )
    }
}

export default class AddProduct1Search extends PullViewComponent {
    _ListItems = {};

    static defaultProps = {};
    static propTypes = {
        backCallBack: React.PropTypes.func,
        goSearch: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    renderTop() {
        return (
            <SearchInputBar
                onChangeText={(text) => {
                    if (text) {
                        fetchProducts({
                            searchKey: text
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
                    if (this.params.callBack) {
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
                        return <ListItem key={index}
                                         Item={product}
                                         OnClick={(productGlobalId) => {
                                             Keyboard.dismiss();
                                             this.push('AddProduct2', {productGlobalId});
                                         }}/>
                    })
                }
            </ScrollView>
        )
    }

    render() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderTop()}
                {this.renderList()}
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {productType, sCompanyId, priceGroupId} = this.params;
        this.GlobalData = {productType, sCompanyId, priceGroupId};
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
        paddingLeft: px2dp(30),
        paddingRight: px2dp(24),
        height: px2dp(40),
        flexDirection: "row",
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

});
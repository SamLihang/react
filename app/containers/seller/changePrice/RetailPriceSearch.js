/**
 * Created by Administrator on 2017/4/6.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Keyboard,
    ScrollView,
    TextInput
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
import {toDecimal2} from '../../../utils/FormatUtil';
import {fetchUpdateRetailPrice, fetchRetailPrice} from '../../../services/RetailPriceServices'

//输入框
class TextInputItem extends Component {
    static defaultProps = {
        List: {}
    };
    static propTypes = {};

    constructor(props) {
        super(props);
        this.state = {
            ifZero: false,
            List: props.List,
            price: props.List.SpecPrices.Price,
        };
    }

    render() {
        let p = this.props.List;
        let productGlobalId = p.ProductGlobalId;
        let SpecId = p.SpecPrices.SpecId;

        return (
            <View>
                <TextInput
                    style={[gs.fts_14, gs.c_3a3838, {
                        padding: 0,
                        margin: 0,
                        width: px2dp(60),
                        height: px2dp(40),
                        textAlign: "right",
                        marginTop:px2dp(3),
                        marginRight:px2dp(8),
                        paddingRight:px2dp(8),
                        // borderBottomStyle:'solid',
                        // borderBottomWidth:px2dp(1),
                        // borderBottomColor:'#000',
                    }]}
                    underlineColorAndroid='transparent'
                    keyboardType='numeric'
                    maxLength={6}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    onEndEditing={(text) => {
                        let price = text.nativeEvent.text;
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (price != "") {
                            if (!re.test(price)) {
                                if (Platform.OS === "ios") {
                                    toastShort("请输入正确的数字")
                                } else {
                                    toastShort("请输入正确的数字");
                                }
                                price = "";
                                this.setState({
                                    price: 0
                                });
                            }
                            else if (parseFloat(price) > 9999) {
                                this.setState({
                                    price: 9999
                                });
                                price = 9999;
                                this.props._UpdateRetailPrice(productGlobalId, SpecId, price);
                            }
                            else {
                                this.props._UpdateRetailPrice(productGlobalId, SpecId, price);
                            }
                        }
                    }}
                    onChangeText={(text) => {
                    }}
                    defaultValue={p.SpecPrices.Price + ''}
                />
                <View style={{width:px2dp(60),height:px2dp(1),backgroundColor:'#000',position:'absolute',bottom:px2dp(8)}}/>
            </View>
        )
    }
}

export default class RetailPriceSearch extends PullViewComponent {

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
                        fetchRetailPrice({
                            searchKey: text
                        }).then((ret) => {
                            if (ret.data) {
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
                    if (this.params && this.params.callBack) {
                        this.params.callBack();
                    }

                    this.pop();
                }}
            />
        )
    }

    renderList() {
        return (

            <ScrollView  ref="scrollView"
            >
                {
                    this.state.dataSource.map((product, index) => {
                        //const {dispatch} = this.props;
                        let p = product;
                        let productGlobalId = p.ProductGlobalId;
                        let refid=index+"ref";
                        return (
                            <View key={index}
                                  style={[styles.ItemStyle, index % 2 === 0 ? gs.bgc_fff : gs.bgc_f2f1ef]}>
                                <View style={styles.itemLeft}>
                                    {(p.ProductName.length+p.SpecPrices.SpecName.length)<=16?
                                        <View style={{flex: 1, flexDirection: 'row',alignItems: 'center',marginLeft:px2dp(18)}}>
                                            <BCText style={[gs.fts_14, gs.c_3a3838]}>{p.ProductName}</BCText>
                                            <BCText style={[gs.fts_12, gs.c_3a3838]}>({p.SpecPrices.SpecName})</BCText>
                                        </View>:
                                        <View style={{marginLeft:px2dp(18)}}>
                                            <BCText style={[gs.fts_14, gs.c_3a3838]}>{p.ProductName}</BCText>
                                            <BCText style={[gs.fts_12, gs.c_3a3838]}>({p.SpecPrices.SpecName})</BCText>
                                        </View>
                                    }
                                    {/*{p.SpecPrices.DisplayUnitTypeId==2?*/}
                                        {/*<View>*/}
                                            {/*<BCText style={[gs.fts_12, gs.c_3a3838]}>({p.SpecPrices.SpecName})</BCText>*/}
                                        {/*</View> :null*/}
                                    {/*}*/}
                                </View>
                                <View style={[styles.itemRight,{paddingRight:px2dp(30)}]}>
                                    <View style={{marginRight:px2dp(10)}}>
                                    <TextInputItem List={p}
                                                   ref={refid}
                                                   style={{width:px2dp(60),height:px2dp(40),textDecorationLine:'underline',textDecorationStyle:'solid',textDecorationColor:'#3a3838',}}
                                                   onBlur={this._reset.bind(this)}
                                                   onFocus={Platform.OS === 'ios'?this._onFocus.bind(this,refid):()=>{}}
                                                   _UpdateRetailPrice={(productGlobalId, SpecId, price) => {
                                                       fetchUpdateRetailPrice({
                                                           productGlobalId,
                                                           SpecId,
                                                           price
                                                       }).then((ret) => {
                                                           if (ret.data) {
                                                               toastShort(ret.error.message)
                                                           }
                                                           else {
                                                               // toastShort('修改成功')
                                                           }

                                                       }).catch((e) => {
                                                           toastShort('请重试')
                                                       });
                                                   }}
                                    />
                                    </View>
                                    <BCText style={{position:'absolute',top:px2dp(10),right:px2dp(6),color:'#565454'}} >
                                        元/{p.SpecPrices.Unit}</BCText>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        )
    }
    _reset() {

        //this.refs.scrollView.scrollTo({y: 0,animated: true});

    }

    _onFocus(refName) {
        let scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            ReactNative.findNodeHandle(this.refs[refName]),120, true);
    }

    renderContent() {
        return (
            <View style={[styles.outView]}>
                <View style={styles.TitleStyle}>
                    <View style={styles.itemLeft}><BCText
                        style={[gs.fts_14, gs.c_fff,{marginLeft:px2dp(18)}]}>商品</BCText></View>
                    <View style={styles.itemRight}><BCText
                        style={[gs.fts_14, gs.c_fff]}>零售价</BCText></View>
                </View>
                {this.renderList()}
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderTop()}
                {this.renderContent()}
            </View>
        )
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
    outView: {
        // width: px2dp(330),
        // marginLeft: px2dp(23),
        // marginRight: px2dp(23),
        // borderRadius: px2dp(8),
        backgroundColor: '#fff',
        marginTop: px2dp(20),
        marginBottom:px2dp(120),
        minHeight: px2dp(300)
    },
    TitleStyle: {
        width: '100%',
        height: px2dp(36),
        backgroundColor: '#31CA96',
        // borderTopLeftRadius: px2dp(4),
        // borderTopRightRadius: px2dp(4),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    ItemStyle: {
        width: '100%',
        height: px2dp(35),
        //backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    LastStyle: {
        width: '100%',
        height: px2dp(35),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomLeftRadius: px2dp(4),
        // borderBottomRightRadius: px2dp(4),
    },
    item: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLeft: {
        width: '70%',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    itemRight: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },

});
/**
 * Created by Administrator on 2017/5/24. 卖家版商品详情
 */
import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {
    BCHostImage,
    BCImage,
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionProductDetail} from "../../../actions/SellerSalesOrderAction";
import {toDecimal2} from "../../../utils/FormatUtil";

//整个按钮组组件
class SpecItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false,
            Text: "",
            _Remark: props._Remark,
            remark: [],
        }
    }

    CheckButton = [];
    static propTypes = {
        Text: React.PropTypes.string,
        PurchaseOrderId: React.PropTypes.number,
        PurchaseOrderLineId: React.PropTypes.number,
        _Remark: React.PropTypes.func,
        BCompanyId: React.PropTypes.number,
        ActualQuantity: React.PropTypes.number,
        data: React.PropTypes.array

    };
    static defaultProps = {
        Text: '',
        PurchaseOrderId: 0,
        PurchaseOrderLineId: 0,
        BCompanyId: 0,
        ActualQuantity: 0,
        data: [],
    };

    renderbtnItem() {
        return (
            <View style={Styles.rowStyle}>
                <View style={{
                    flexDirection: 'row',
                    height: px2dp(43),
                    alignItems: 'center',
                    paddingLeft: px2dp(12),
                }}>
                    <BCText>选择规格</BCText>
                    <BCImage source={require('../../../imgs/right1.png')} style={{marginLeft: px2dp(10)}}/>
                </View>
                <View style={Styles.btnItem}>
                    {
                        this.props.data.map((Spec, index) => {
                            return (
                                <CheckButton
                                    ref={(c) => {
                                        this.CheckButton.push(c);
                                    }}
                                    Key={Spec.SpecId}
                                    IsSelect={index == 0 ? true : false}
                                    OnChange={(isSelect, Price) => {
                                        this.CheckButton.map((btn, index) => {
                                            if (btn.props.Key != Spec.SpecId) {
                                                btn.OnChange(false);
                                            }
                                            else {
                                                this.props.OnChange(isSelect, Price)
                                            }
                                        })
                                    }}
                                    Title={Spec}
                                    key={index}/>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    render() {
        return this.renderbtnItem()
    }
}

// 单个按钮组件
class CheckButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsSelect: props.IsSelect,
            OnShow: props.OnShow,
        }
    }

    static propTypes = {
        IsSelect: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        Title: React.PropTypes.object,
        OnShow: React.PropTypes.func,
    };
    static defaultProps = {
        IsSelect: false,
    };

    OnChange(isSelect) {
        this.setState({IsSelect: isSelect})
    }

    OnShow() {
        this.props.OnShow()
    };

    _onPress(Price) {
        this.setState({IsSelect: !this.state.IsSelect}, () => {
            this.props.OnChange(this.state.IsSelect, Price);
        })
    }

    render() {
        let borderColor1 = {borderColor: '#DCDCDC'};
        let borderColor2 = {borderColor: '#00C164'};
        let Color1 = {color: "#3a3838"};
        let Color2 = {color: "#00C164"};
        return (
            <View style={{paddingLeft: px2dp(12), paddingTop: px2dp(12)}}>
                <BCTouchable style={[Styles.btnStyle, this.state.IsSelect ? borderColor2 : borderColor1]}
                             onPress={() => {
                                 this._onPress(this.props.Title.Price)
                             }}>
                    {/*<BCText*/}
                        {/*style={[gs.fts_14, this.state.IsSelect ? Color2 : Color1]}>{this.props.Title.Price}/{ this.props.Title.SpecName}</BCText>*/}
                    <BCText
                        style={[gs.fts_14, this.state.IsSelect ? Color2 : Color1]}>{ this.props.Title.SpecName}</BCText>
                </BCTouchable>
            </View>
        )
    }
}

//价格组件
class Price extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Text: "",
            price: props.data.price,
            PriceChangeReason:props.data.PriceChangeReason,
            PromotionPrice:props.data.PromotionPrice,
        }
    }

    changePrice(price) {
        this.setState({
            price: price
        })
    }

    renderPrice() {
        let groups = this.props.data.groups;
        return (
            <View>
                <View style={[{marginTop:px2dp(8),flexDirection:'row',marginLeft:px2dp(28)}]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838]}>零售价</BCText>
                    <BCText style={[gs.fts_15, {color: '#fd0319', marginLeft: px2dp(25)}]}>{this.state.price}</BCText>
                    {
                        this.state.PriceChangeReason==1?
                            <View style={[{flexDirection:'row',marginLeft:px2dp(82)}]}>
                                <BCText style={[gs.fts_14, gs.c_3a3838,{color:'#fd0016'}]}>促销价</BCText>
                                <BCText style={[gs.fts_15, {color: '#fd0319', marginLeft: px2dp(25)}]}>{this.state.PromotionPrice}</BCText>
                            </View>
                         :null
                    }

                </View>

                <View style={Styles.priceStyle}>
                    {
                        groups.map((group, index) => {
                            return (
                                <View key={index}
                                      style={{
                                          width: px2dp(120),
                                          flexDirection: 'row',
                                          paddingTop: px2dp(10),
                                          paddingBottom: px2dp(10)
                                      }}>
                                    <BCText style={[gs.fts_14, gs.c_3a3838]}>{group.PriceGroupName}</BCText>
                                    <BCText
                                        style={[gs.fts_15, {
                                            color: '#fd0319',
                                            paddingLeft: px2dp(24)
                                        }]}>{toDecimal2((group.Discount / 100) * (this.state.price))}</BCText>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    render() {
        return this.renderPrice()
    }
}

class ProductDetails extends PullViewComponent {
    _PriceView = {}

    constructor(props) {
        super(props)
        this.state = {}
    }

    //设置页面标题
    setTitle() {
        return "商品详情"
    }

    content() {
        const reduceSellerProductDetail = this.props.ReduceSellerProductDetail;
        let datas = reduceSellerProductDetail.datas;
        let product = datas.Product;
        let groups = datas.Groups;
        let specs = datas.Specs;
        return (
            <View style={[Styles.mainStyle, gs.bgc_f2f1ef]}>
                <View style={Styles.productImage}>
                    <BCHostImage source={{uri: product.Image}}
                                 style={{width: deviceWidth, height: px2dp(280)}}/>
                </View>
                <View style={[Styles.productName, gs.bgc_fff]}>
                    <BCText style={[gs.fts_16, gs.c_3a3838]}>{product.ProductName}</BCText>
                   {/* <BCText style={[gs.fts_13, gs.c_888, {paddingTop: px2dp(5)}]}>{product.Description}</BCText>*/}
                </View>
                <View style={[Styles.specStyle, gs.bgc_fff]}>
                    {/*选规格*/}
                    <SpecItem data={datas.Specs}
                              OnChange={(isSelect, Price) => {
                                  this._PriceView.changePrice(Price)
                              }}/>

                    {/*<Price data={{groups, price: specs[0].Price}}*/}
                           {/*ref={(p) => {*/}
                               {/*this._PriceView = p*/}
                           {/*}}/>*/}
                    {/*//价格组*/}
                    {
                        specs[0]?
                            <Price data={{groups, price: specs[0]?specs[0].Price:0,PromotionPrice:specs[0].PromotionPrice,PriceChangeReason:specs[0].PriceChangeReason}}
                                   ref={(p) => {this._PriceView = p}}
                            />
                            :
                            <Price data={{groups, price: 0}}
                                   ref={(p) => {this._PriceView = p}}
                            />
                    }

                </View>
            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {ProductId} = this.params;
        dispatch(ActionProductDetail(ProductId))
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerProductDetail.datas != null && nextProps.ReduceSellerProductDetail.datas != this.props.ReduceSellerProductDetail.datas) {
            const {ReduceSellerProductDetail} = nextProps;
            this.setState({
                IsReceived: true
            });
        }

    }
}

const Styles = StyleSheet.create({
    mainStyle: {
        height: deviceHeight,
    },
    productImage: {
        width: deviceWidth,
        height: px2dp(280),
    },
    productName: {
        paddingLeft: px2dp(12),
        height: px2dp(47),
        justifyContent: 'center',
    },
    specStyle: {
        marginTop: px2dp(10),
    },
    rowStyle: {
        //borderStyle: 'dashed',
        borderBottomWidth: 1,
        borderColor: '#e8e8e8',
    },
    btnItem: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: deviceWidth,
        paddingBottom: px2dp(10)
    },
    btnStyle: {
        width: px2dp(80),
        height: px2dp(29),
        borderRadius: px2dp(2.5),
        borderWidth: 1,
        borderColor: '#00C164',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        //height: px2dp(48),
        width: deviceWidth,
        paddingHorizontal: px2dp(28),
        justifyContent: 'space-between'
    },
})
function mapStateToProps(store) {
    return {
        ReduceSellerProductDetail: store.ReduceSellerProductDetail
    }
}
const connectProductDetails = connect(mapStateToProps)(ProductDetails);
connectProductDetails.navigationOptions = NavigationOptions;
export default connectProductDetails;
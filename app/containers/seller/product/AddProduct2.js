//添加商品信息
import React, {Component} from "react";
import {StyleSheet, View, TextInput, Keyboard,ScrollView} from "react-native";
import {BCText, BCTouchable, deviceHeight, deviceWidth, NavigationOptions, px2dp, substr} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from "../../../components/CheckBox";
import {connect} from "react-redux";
import {toastShort} from '../../../utils/ToastUtil';
import {ActionProductSpecPrices} from '../../../actions/SellerProductAction';
import {fetchPublishProduct} from '../../../services/SellerProductServices';
import {toDecimal2} from '../../../utils/FormatUtil';

//显示整条规格组件
class SpecShow extends Component {
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
        OnShow: React.PropTypes.func,
        data: React.PropTypes.object
    };
    static defaultProps = {
        IsSelect: false,
        data: {}
    };

    OnChange(isSelect) {
        this.setState({IsSelect: isSelect})
    }

    OnShow() {
        this.props.OnShow()
    };

    _onPress(isSelect) {
        this.setState({IsSelect: isSelect}, () => {
            this.props.OnChange(isSelect);
        })
    }

    render() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox IsSelect={this.state.IsSelect}
                          Checked={require('../../../imgs/Selected.png')}
                          OnChange={(isSelect) => {
                              this._onPress(isSelect)
                          }}/>
                <BCText style={[gs.fts_14, gs.c_3a3838]}>规格: {this.props.data.SpeceName}</BCText>
            </View>
        )
    }
}

//显示价格组件
class PriceShow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        OnShow: React.PropTypes.func,
        data: React.PropTypes.object
    };
    static defaultProps = {
        data: {}
    };

    OnShow(isSelect, SpecId) {
        this.setState({
            IsShow: !this.state.IsShow
        }, () => {
            this.props.OnSelected(isSelect, SpecId)
        })
    }

    renderShowPrice() {
        let data = this.props.data;
        return (
                <View style={[Styles.showPrice]}>
                    <BCText style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(46)}]}>价格: ￥</BCText>
                    <TextInput
                        underlineColorAndroid='transparent'
                        keyboardType='numeric'
                        maxLength={5}
                        style={[Styles.input, gs.fts_14]}
                        placeholder={'请输入价格'}
                        onChangeText={(text) => {
                            this.props.OnChangeText(text, data.ProductGlobalId, data.SpecId, data.CompanyId)
                        }}
                    />
                </View>
        )
    }

    render() {
        return (
            <View style={[Styles.colStyle,{backgroundColor:this.props.index%2?'#fff':'#f6f6f6'}]}>
                <SpecShow data={this.props.data}
                          OnChange={(isSelect) => {
                              this.OnShow(isSelect, this.props.data.SpecId)
                          }}/>
                {this.renderShowPrice()}
            </View>
        )
    }
}

class AddProduct2 extends PullViewComponent {
    Items: [];
    SelectedItems: [];
    ErrorText: false;
    init: 0;

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
        this.IsReplenish = false
    }

    //设置页面标题
    setTitle() {
        return "添加商品信息"
    }

    onSubmit() {
        const {dispatch} = this.props;
        const {productGlobalId} = this.params;

        if (this.ErrorText) {
            toastShort('请输入正确的数字');
            return false
        }

        if (this.Items.length > 0) {
            if (this.Items.length != this.SelectedItems.length) {
                toastShort('请先修改价格');
                return false;
            }

            let objStr = {
                IsReplenish: this.IsReplenish,
                productGlobalId: productGlobalId,
                productSpecPriceStrs: JSON.stringify({Items: this.Items})
            };
            fetchPublishProduct(objStr).then((ret) => {
                if (ret.data === null) {
                    this.push('AddProduct3', {ProductId: productGlobalId})
                }
                else if (ret.error) {
                    toastShort(ret.data)
                }
                Keyboard.dismiss();
            }).catch((error) => {

            })
        }
        else {
            this.init++;
            if (this.init == 1) {
                toastShort('请先填写价格');
            }
            else if (this.init % 3 == 0) {
                toastShort('请先填写价格');
            }
        }
    }

    Bottom() {
        return (
            <View style={Styles.footerWrap}>
                {
                    this.props.ReduceEmployee.currentEmployee.IsReplenish ?
                        <View style={[Styles.replenish]}>
                            <CheckBox
                                Checked={require('../../../imgs/Selected.png')}
                                OnChange={(isSelect) => {
                                    this.IsReplenish = isSelect;
                                }}/>
                            <BCText style={[gs.fts_14, gs.c_3a3838]}>是否参与补货?</BCText>
                        </View> : null
                }

                <BCTouchable onPress={() => {
                    this.onSubmit()
                }} style={[Styles.confirmBtn, gs.bgc_00c164]}>
                    <BCText style={[gs.fts_15, gs.c_fff]}>确定</BCText>
                </BCTouchable>
            </View>
        )
    }

    content() {
        return (
            <ScrollView style={[Styles.main, gs.bgc_fff]}>
                {
                    this.state.dataSource.map((data, index) => {
                        return <PriceShow key={data.SpecId}
                                          data={data}
                                          index={index}
                                          OnChangeText={(text, ProductGlobalId, SpecId, CompanyId) => {
                                              let Items = this.Items;
                                              let index = this.Items.findIndex(item => item.SpecId == SpecId);

                                              if (isNaN(text * 1)) {
                                                  toastShort('请输入正确的数字');
                                                  this.ErrorText = true;
                                                  return false;
                                              }

                                              if (text >= 0) {

                                                  //无则添加 有则寻找
                                                  if (Items.length <= 0) {
                                                      Items.push({
                                                          ProductGlobalId: ProductGlobalId,
                                                          CompanyId: CompanyId,
                                                          SpecId: SpecId,
                                                          Price: toDecimal2(text)
                                                      })
                                                  }
                                                  else {
                                                      if (index >= 0) {
                                                          Items[index].Price = toDecimal2(text);
                                                      }
                                                      else {
                                                          Items.push({
                                                              productGlobalId: ProductGlobalId,
                                                              CompanyId: CompanyId,
                                                              SpecId: SpecId,
                                                              Price: toDecimal2(text)
                                                          })
                                                      }
                                                  }
                                              }
                                              else {
                                                  Items.slice(index, 1)
                                              }
                                              this.ErrorText = false;

                                          }}
                                          OnSelected={(isSelect, SpecId) => {
                                              let SelectedItems = this.SelectedItems;
                                              let index = SelectedItems.findIndex(item => item == SpecId);
                                              if (index >= 0) {
                                                  if (!isSelect) {
                                                      this.SelectedItems.splice(index, 1)
                                                  }
                                              }
                                              else {
                                                  this.SelectedItems.push(SpecId);
                                              }
                                          }}/>
                    })
                }
            </ScrollView>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {productGlobalId} = this.params;
        dispatch(ActionProductSpecPrices(productGlobalId));
    }

    //初始化数据
    WillReceive(nextProps) {
        if (nextProps.ReduceSellerProductSpecPrices.datas != null && nextProps.ReduceSellerProductSpecPrices.datas != this.props.ReduceSellerProductSpecPrices.datas) {
            const {ReduceSellerProductSpecPrices} = nextProps;
            this.init = 0;
            this.Items = [];
            this.SelectedItems = [];
            this.setState({
                IsReceived: true,
                dataSource: ReduceSellerProductSpecPrices.datas
            });
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight,
    },
    colStyle: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent:  'center',
        paddingLeft: px2dp(24),
        height:px2dp(80)
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(101),
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmBtn: {
        width: px2dp(355),
        height: px2dp(45),
        borderRadius: px2dp(4),
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: px2dp(22),
        padding: 0,
        margin: 0
    },
    showPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    replenish: {
        height: px2dp(40),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function mapStateToProps(store) {
    return {
        ReduceSellerProductSpecPrices: store.ReduceSellerProductSpecPrices,
        ReduceEmployee: store.ReduceEmployee
    }
}

const connectProviders = connect(mapStateToProps)(AddProduct2);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
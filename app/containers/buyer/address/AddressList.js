import React from "react";
import {StyleSheet, View} from "react-native";
import {PullViewComponent} from "../../PageComponent";
import {BCText, BCTouchable, NavigationOptions, px2dp, substr,deviceHeight} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from "../../../components/CheckBox";
import {connect} from "react-redux";
import {ActionAddress} from "../../../actions/AddressAction";

class AddressList extends PullViewComponent {
    _CheckBoxs = [];
    AddressMsg = {};

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
        };
    }

    setTitle() {
        return "地址列表";
    }


    refeshView(msg) {
        const {dispatch} = this.props;
        dispatch(ActionAddress());
    }

    //底部
    Bottom() {
        return (
            <BCTouchable style={[gs.bgc_00dd97, styles.bottom]}
                         onPress={() => {
                             this.push('AddAddress', {
                                 callback: this.refeshView.bind(this)
                             })
                         }}>
                <BCText style={[gs.c_fff, gs.fts_15]}>新增收货地址</BCText>
            </BCTouchable>
        )
    }

    //内容
    renderContent(datas) {
        let items = datas.Items
        return (
            <View style={[styles.main, gs.bgc_fff]}>{
                items.length?this.renderAddress(items)
                    :this.noRecord('您还没有添加地址信息喔～')
            }
            </View>
        )
    }

    renderAddress(items) {
        let AddressId = null;
        let isShowCheckBox = false;
        if (this.params) {
            if (this.params.AddressId) {
                AddressId = this.params.AddressId
            }
            if (this.params.pageFrom == 'ConfirmOrder') {
                isShowCheckBox = true
            }
        }
        this._CheckBoxs=[];
        return (
            items.map((item, index) => {
                let isSelect = false;
                if (item.PurchaseOrderAddressId == AddressId) {
                    isSelect = true;
                    let callBack = this.navigation.state.params.callBack;
                    callBack(item);
                }
                return (
                    <View key={index} style={[styles.item]}>
                        <View style={[{height: px2dp(44), width: px2dp(46)}]}>
                            {
                                isShowCheckBox ?
                                    <CheckBox IsSelect={isSelect}
                                              Key={item.PurchaseOrderAddressId}
                                              ref={(c) => {
                                                  if(c!=null){
                                                      this._CheckBoxs.push(c);
                                                  }
                                              }}
                                              OnChange={(isSelect) => {
                                                  this._CheckBoxs.map((boxs, index) => {
                                                      if (boxs.props.Key != item.PurchaseOrderAddressId) {
                                                          boxs.OnChange(false);
                                                      }
                                                      else {
                                                          let callBack = this.navigation.state.params.callBack;
                                                          callBack(item);
                                                      }
                                                  })
                                              }}/> : null
                            }
                        </View>
                        <View style={[styles.message]}>
                            <BCText style={[gs.c_3a3838, gs.fts_14]}>{item.ContactName}</BCText>
                            <BCText style={[gs.c_3a3838, gs.fts_14]}>{item.Phone}</BCText>
                            <BCText
                                style={[gs.c_3a3838, gs.fts_14, styles.address]}>{substr((item.Address), 30)}</BCText>
                        </View>
                        <BCTouchable style={[styles.edits, gs.bdc_e3e3e3]}
                                     onPress={() => {
                                         this.push('EditAddress', {
                                             PurchaseOrderAddressId: item.PurchaseOrderAddressId,
                                             ContactName: item.ContactName,
                                             Phone: item.Phone,
                                             Address: item.Address,
                                             callback: this.refeshView.bind(this)
                                         })
                                     }}>
                            <BCText style={[gs.c_888, gs.fts_15]}>编辑</BCText>
                        </BCTouchable>
                    </View>
                )
            })
        )
    }

    content() {
        const {ReduceAddressManage} = this.props;
        if (ReduceAddressManage.datas) {
            let datas = ReduceAddressManage.datas
            return (
                <View style={[styles.main, gs.bgc_f2f1ef]}>
                    {this.renderContent(datas)}
                </View>
            )
        }

    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionAddress());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceAddressManage.datas && nextProps.ReduceAddressManage.datas !== this.props.ReduceAddressManage.datas) {
            this.setState({
                IsReceived: true,
            });
        }
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight+1,
        paddingBottom: '10%'
    },
    bottom: {
        width: '100%',
        height: px2dp(46),
        position: 'absolute',
        bottom: 0,
        left: 0,
        alignItems: 'center',
        zIndex: 10,
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        height: px2dp(84),
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingHorizontal: px2dp(12),
    },
    chooseBtn: {
        marginRight: px2dp(13),
    },
    chooseCIcle: {
        width: px2dp(22),
        height: px2dp(22),
    },
    message: {
        paddingVertical: px2dp(12),
        justifyContent: 'space-between',
        width: '73%',
    },
    edit: {
        height: px2dp(36),
        borderLeftWidth: 1,
        width: px2dp(54),
        borderLeftColor: '#e3e3e3',
        marginLeft: px2dp(15),
        paddingLeft: px2dp(12),
        justifyContent: 'center'
    },
    address: {
        flexWrap: 'wrap',
    },
    edits: {
        height: px2dp(36.5),
        width: px2dp(54),
        borderLeftWidth: px2dp(1),
        justifyContent: 'center',
        alignItems: 'center',
    }

});

function mapStateToProps(store) {
    return {
        ReducePurchaseOrderConfirm: store.ReducePurchaseOrderConfirm,
        ReduceAddressManage: store.ReduceAddressManage
    }
}
const connectAddressManage = connect(mapStateToProps)(AddressList);
connectAddressManage.navigationOptions = NavigationOptions;
export default connectAddressManage;

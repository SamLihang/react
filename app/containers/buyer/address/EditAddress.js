import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Alert, Button} from 'react-native';
import PageComponent, {PullViewComponent, PullListComponent} from '../../PageComponent'
import {
    px2dp,
    deviceWidth,
    deviceHeight,
    substr,
    BCText,
    BCImage,
    BCTouchable,
    NavigationOptions,
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import {toastLong, confirm} from '../../../utils/ToastUtil';

import {ActionUpdateAddress, ActionDeleteAddress} from '../../../actions/AddressAction';
import {connect} from 'react-redux';
import {fetchUpdateAddress, fetchDeleteAddress} from '../../../services/AddressUpdateServices';

//遮罩层
class ToPayMaks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    static propTypes = {
        Cancle: React.PropTypes.func,
    };

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ?
                <View style={[styles.popup,]}>
                    <View style={[{
                        width: px2dp(259),
                        height: px2dp(65),
                        borderBottomWidth: px2dp(0.5),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }, gs.bdc_bdbdbd]}>
                        <BCText style={[gs.fts_17, {color: '#000'}]}>确定要删除改地址吗?</BCText>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <BCTouchable onPress={() => this.props.Cancle()} style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: px2dp(129),
                            height: px2dp(43)
                        }}>
                            <BCText style={[gs.fts_16, {color: '#3b5df2'}]}>取消</BCText>
                        </BCTouchable>
                        <View style={[{width: px2dp(0.5), height: px2dp(35), backgroundColor: '#dbdbdb'}]}></View>
                        <BCTouchable onPress={() => this.props.Cancle('delete')} style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: px2dp(129),
                            height: px2dp(43)
                        }}>
                            <BCText style={[gs.fts_16, {color: '#3b5df2'}]}>确定</BCText>
                        </BCTouchable>
                    </View>
                </View> : null
        )
    }
}

class EditAddress extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            PurchaseOrderAddressId: this.params.PurchaseOrderAddressId,
            ContactName: this.params.ContactName,
            Phone: this.params.Phone,
            Address: this.params.Address,
        };
    }

    list = [];

    _ToPayMaks = null;

    setTitle() {
        return "编辑收货地址";
    }

    //内容
    renderContent() {
        let titleArray = [
            {title: '收件人:', value: this.state.ContactName},
            {title: '手机号码:', value: this.state.Phone},
           /* {title: '省市区:', value: '浙江省   杭州市   江干区 '},*/
            {title: '详细地址:', value: this.state.Address}];
        return (
            <View style={[styles.content, gs.bgc_fff]}>
                <View style={[styles.list]}>
                    {
                        titleArray.map((addData, i) => {
                            return (
                                this.renderItem(addData, i)
                            )
                        })
                    }
                </View>
                <View style={[gs.bgc_fff, styles.btnBox]}>
                    <BCTouchable style={[styles.btn, gs.bgc_00dd97]}
                                 onPress={() => this.onSave()}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>保存收货信息</BCText>
                    </BCTouchable>
                </View>
                <View style={[gs.bgc_fff, styles.btnBox]}>
                    <BCTouchable style={[styles.btn, gs.bgc_fd0319]} onPress={() => this.ToPay()}>
                        <BCText style={[gs.fts_15, gs.c_fff]}>删除收货信息</BCText>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    onSave() {
        let PurchaseOrderAddressId = this.state.PurchaseOrderAddressId;
        let ContactName = this.state.ContactName.trim();
        let Phone = this.state.Phone.trim();
        let Address = this.state.Address.trim();
        if (ContactName == '') {
            toastLong(JSON.stringify('收件人不能为空'));
            return false;
        }
        if (Phone == '') {
            toastLong(JSON.stringify('手机号码不能为空'));
            return false;
        }
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(Phone)) {
            toastLong(JSON.stringify('手机号码格式错误'));
            return false;
        }
        if (Address == '') {
            toastLong(JSON.stringify('详细地址不能为空'));
            return false;
        }
        fetchUpdateAddress({PurchaseOrderAddressId, ContactName, Phone, Address}).then((ret) => {
            toastLong(JSON.stringify('修改地址成功'));
            if(PurchaseOrderAddressId, ContactName, Phone, Address){
                let callBack = this.navigation.state.params.callback;
                callBack();
                this.pop()
            }

        }).catch((e) => {
        })
    }

    //item
    renderItem(addData, index) {
        return (
            <View style={[styles.item]} key={index}>
                <View style={[styles.title]}>
                    <BCText style={[gs.c_888, gs.fts_15]}>{addData.title}</BCText>
                </View>
                <TextInput
                    autoFocus={false}
                    underlineColorAndroid='transparent'
                    style={[styles.input, gs.fts_14]}
                    defaultValue={addData.value}
                    onChangeText={(text) => {
                        switch (index) {

                            case 0:
                                this.state.ContactName = text;
                                break;
                            case 1:
                                this.state.Phone = text;
                                break;
                           /* case 2:
                                this.state.ContactName = text;
                                break;*/
                            case 2:
                                this.state.Address = text;
                                break;
                        }

                    }}
                />
            </View>
        )
    }

    content() {
        return (
            <View style={[styles.main, gs.bgc_f2f1ef]}>
                {this.renderContent()}
            </View>
        )
    }

    //弹窗
    maksContent() {
        return (
            <ToPayMaks ref={(ref) => this._ToPayMaks = ref}
                       Cancle={(type) => {
                           if (type == 'delete') {
                               this.onDelete()
                           }
                           this._ToPayMaks.Trigger(false);
                           this._Maks.Trigger(false);
                       }}
            />
        )
    }

    ToPay() {
        this._Maks.Trigger(true);
        this._ToPayMaks.Trigger(true);
    }

    onDelete() {
        let AddressId = this.state.PurchaseOrderAddressId;
        fetchDeleteAddress({AddressId}).then((ret) => {
            toastLong(JSON.stringify('删除地址成功'))
            if(AddressId){
                let callBack = this.navigation.state.params.callback;
                callBack();
                this.pop()
            }
        }).catch((e) => {

        })
    }


    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionUpdateAddress());
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingTop: px2dp(10),
        height:deviceHeight
    },
    list: {
        paddingLeft: px2dp(24)
    },
    item: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        height: px2dp(60),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingHorizontal: px2dp(12),
    },
    title: {
        width: px2dp(70),
        alignItems: 'flex-end'
    },
    input: {
        flex: 1
    },
    btnBox: {
        width: '100%',
        alignItems: 'center',
        paddingTop: px2dp(12)
    },
    btn: {
        width: px2dp(316),
        height: px2dp(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2dp(4)
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
        width: '73%'
    },
    edit: {
        height: px2dp(36),
        borderLeftWidth: 1,
        borderLeftColor: '#e3e3e3',
        marginLeft: px2dp(15),
        paddingLeft: px2dp(12),
        justifyContent: 'center',
    },
    address: {
        flexWrap: 'wrap'
    },
    popup: {
        width: px2dp(259),
        height: px2dp(109),
        borderRadius: px2dp(10),
        backgroundColor: '#fff',
        position: 'absolute',
        top: (deviceHeight - px2dp(109)) / 2,
        left: (deviceWidth - px2dp(259)) / 2,
        zIndex: 3
    },
});

function mapStateToProps(store) {
    return {
        ReduceUpdateAddressManage: store.ReduceUpdateAddressManage,
        ReduceDeleteAddressManage: store.ReduceDeleteAddressManage,
    }
}
const connectUpdateAddressManage = connect(mapStateToProps)(EditAddress);
connectUpdateAddressManage.navigationOptions = NavigationOptions;
export default connectUpdateAddressManage;
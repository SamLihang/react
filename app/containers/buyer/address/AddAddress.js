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

import {ActionUpdateAddress} from '../../../actions/AddressAction';
import {connect} from 'react-redux';
import {fetchInsertAddress} from '../../../services/AddressUpdateServices';

class AddAddress extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                ContactName: '',
                Phone: '',
                Address: '',
                DetailAddress: ''
            }
        }
        ;
    }

    setTitle() {
        return "新增收货地址";
    }

    //底部
    Bottom() {

    }

    //内容
    renderContent() {
        let titleArray = ['收件人:', '手机号码:', '省市区:', '详细地址:',];
        return (
            <View style={[styles.content, gs.bgc_fff]}>
                <View style={[styles.list]}>
                    {
                        titleArray.map((e, i) => {
                            return (
                                this.renderItem(e, i)
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
            </View>
        )
    }

    onSave() {
        let item = this.state.item;
        if (item.ContactName == '') {
            toastLong(JSON.stringify('收件人不能为空'));
            return false;
        }
        if (item.Phone == '') {
            toastLong(JSON.stringify('手机号码不能为空'));
            return false;
        }
        if (!/^1[3|4|5|7|8][0-9]{9}$/.test(item.Phone)) {
            toastLong(JSON.stringify('手机号码格式错误'));
            return false;
        }
        if (item.Address == '') {
            toastLong(JSON.stringify('地址不能为空'));
            return false;
        }
        if (item.DetailAddress == '') {
            toastLong(JSON.stringify('详细地址不能为空'));
            return false;
        }


        fetchInsertAddress(
            {
                ContactName: item.ContactName,
                Phone: item.Phone,
                Address: item.Address + item.DetailAddress
            }
        ).then((ret) => {
            toastLong(JSON.stringify('新增地址成功'));
            //调用callback刷新前一个页面
            if (item) {
                let callBack = this.navigation.state.params.callback;
                callBack();
                this.pop()
            }
        }).catch((e) => {

        })
    }

    //item
    renderItem(title, index) {
        return (
            <View style={[styles.item]} key={index}>
                <View style={[styles.title]}>
                    <BCText style={[gs.c_888, gs.fts_15]}>{title}</BCText>
                </View>
                <TextInput
                    autoFocus={false}
                    underlineColorAndroid='transparent'
                    style={[styles.input, gs.fts_14]}
                    maxLength={11}
                    onChangeText={(text) => {
                        switch (index) {
                            case 0:
                                this.state.item.ContactName = text;
                                break;
                            case 1:
                                this.state.item.Phone = text;
                                break;
                            case 2:
                                this.state.item.Address = text;
                                break;
                            case 3:
                                this.state.item.DetailAddress = text;
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

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionUpdateAddress());
    }
}

const styles = StyleSheet.create({
    main: {
        height: deviceHeight,
    },
    content: {},
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

});

function mapStateToProps(store) {
    return {
        ReduceUpdateAddressManage: store.ReduceUpdateAddressManage
    }
}
const connectUpdateAddressManage = connect(mapStateToProps)(AddAddress);
connectUpdateAddressManage.navigationOptions = NavigationOptions;
export default connectUpdateAddressManage;
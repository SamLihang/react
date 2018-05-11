import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TextInput,
    Alert,
    InteractionManager
} from 'react-native';
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {toastShort} from '../utils/ToastUtil'
import Parabolic from 'react-native-parabolic';

export default class CarCalculate extends Component {
    static defaultProps = {
        Quantity: 0,
        isEdit: false,
        shoppingCartId: 0
    };
    static propTypes = {
        ProductId: React.PropTypes.number,
        Quantity: React.PropTypes.number,
        OnChange: React.PropTypes.func,
        isEdit: React.PropTypes.bool,
        ProductType: React.PropTypes.number,
        shoppingCartId: React.PropTypes.number,
        OnInit: React.PropTypes.func,
        SpecId: React.PropTypes.number,
        companyId: React.PropTypes.number,
        Price: React.PropTypes.number,
        DisplayUnitTypeId: React.PropTypes.number,
        UnitAmount: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.Quantity,
            isEdit: props.isEdit,
            shoppingCartId: props.shoppingCartId,
            ifZero: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isEdit: nextProps.isEdit,
            quantity: nextProps.Quantity,
            //quantity: nextProps.Quantity,
        })
    };

    //加btn
    renderAdd() {
        return (
            <BCTouchable
                         onPress={() => this.onAdd()}>
                <BCImage style={[styles.btn,{marginLeft:0}]}
                         resizeMode='contain'
                         source={require('../imgs/plus.png')}/>
            </BCTouchable>
        )
    }

    //加
    onAdd() {
        let self = this;
        if (this.state.quantity >= 999) {
            toastShort('最大购买数量999');
            return false
        }
        self.setState({
            quantity: ++this.state.quantity
        }, () => {
            setTimeout(function () {
                self.props.OnChange('add', self.state.quantity, self.state.shoppingCartId);
            }, 300)
        })
    }

    //减btn
    renderReduce() {
        return (
            <BCTouchable
                onPress={() => this.onReduce()}
            >
                <BCImage style={[styles.btn,{marginRight:0}]}
                         resizeMode='contain'
                         source={require('../imgs/reduce.png')}/>
            </BCTouchable>
        )
    }

    //减
    onReduce() {
        let self = this;
        if (this.state.quantity == 0) {
            return false;
            // toastShort("受不了，宝贝不能再减了哦")
        } else {
            self.setState({
                quantity: --this.state.quantity,
            }, () => {
                // setTimeout(function () {
                    self.props.OnChange('reduce', self.state.quantity, self.state.shoppingCartId);
                // }, 300)
            });
        }
    }

    //输入框
    renderInput() {
        return (
            <TextInput
                editable={false}
                underlineColorAndroid='transparent'
                keyboardType="numeric"
                maxLength={3}
                style={[styles.btnInput, gs.c_3a3838, gs.fts_15]}
                value={this.state.ifZero ? "1" : this.state.quantity + ''}
                onChangeText={(text) => {
                    let num = text * 1;
                    if (Number.isNaN(num) || num < 0 || num > 999) {
                        return false
                    }
                    else if (num == 0) {
                        this.setState({
                            ifZero: true
                        })
                        return false
                    }
                    else {
                        this.setState({
                            ifZero: false
                        })
                    }

                    this.onInput(num)
                }}
                onEndEditing={() => {
                    //当结束输入的时候,判断值是否为空或为0
                    if (this.state.ifZero) {
                        this.setState({
                            quantity: 1,
                            ifZero: false
                        }, () => {
                            this.props.OnChange('input', 1, this.state.shoppingCartId);
                        });
                    }
                }}
            />
        )
    }

    onInput(num) {
        if (num == this.state.quantity) {
            return false
        }
        else {
            this.setState({
                quantity: num
            }, () => {
                this._OnChange('input');
                //this.props.OnChange('input', num, this.state.shoppingCartId);
            });
        }
    }

    _OnChange(type) {
        let self = this;
        self.props.OnChange(type, self.state.quantity, self.state.shoppingCartId);
    }

    //改变状态
    onChangeEdit(isSelect) {
        this.setState({
            isEdit: !this.state.isEdit
        });
    }

    render() {
        let quantity = this.state.quantity;
        return (
            // this.state.isEdit ?
                <View style={styles.btnBox}>
                    {this.renderReduce()}
                    {this.renderInput()}
                    {this.renderAdd()}
                </View>
                // :
                // <View style={{marginLeft: px2dp(70), marginTop: px2dp(7)}}>
                //     <BCText style={[gs.fts_11, gs.c_3a3838]}>
                //         x{quantity}</BCText>
                // </View>


        )
    }
}

const styles = StyleSheet.create({
    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    btn: {
        width: px2dp(21),
        height: px2dp(21),
        padding: px2dp(10),
        marginHorizontal: px2dp(10),
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(21),
        padding: 0,
        margin: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});
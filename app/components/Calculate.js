import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TextInput,
    Alert,
    InteractionManager,
    KeyboardAvoidingView
} from 'react-native';
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {toastShort} from '../utils/ToastUtil'

import Parabolic from 'react-native-parabolic';


export  class Calculate extends Component {
    isOnClickAdd = false

    static defaultProps = {
        Quantity: 0,
        shoppingCartId: 0
    };
    static propTypes = {
        ProductId: React.PropTypes.number,
        Quantity: React.PropTypes.number,
        OnChange: React.PropTypes.func,
        onChangeQuantity: React.PropTypes.func,
        shoppingCartId: React.PropTypes.number,
        SpecId: React.PropTypes.number,
        PurchaseOrderLineId: React.PropTypes.number,
        Price: React.PropTypes.number,
        DisplayUnitTypeId: React.PropTypes.number,
        UnitAmount: React.PropTypes.number,
    };

    timer = null;

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.Quantity,
            shoppingCartId: props.shoppingCartId,
            ifZero: false
        }
    }

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
        //极限值
        if (this.state.quantity >= 999) {
            toastShort('最大购买数量999')
            return false
        }

        this.setState({
            quantity: ++this.state.quantity
        }, () => {
            this._OnChange('add');
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
        this.setState({
            quantity: --this.state.quantity
        }, () => {
            this._OnChange('reduce');
        });
    }

    //输入框
    renderInput() {
        return (
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    editable={false}
                    underlineColorAndroid='transparent'
                    keyboardType='numeric'
                    maxLength={3}
                    style={[styles.btnInput, gs.c_3a3838, gs.fts_15]}
                    value={this.state.ifZero ? '' : this.state.quantity + ''}
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
                                quantity: 0,
                                ifZero: false
                            }, () => {
                                this.props.OnChange('input', 0, this.state.shoppingCartId);
                            });
                        }
                    }}/>
            </KeyboardAvoidingView>
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

            });
        }
    }

    _OnChange(type) {
        let self = this;
        self.props.OnChange(type, self.state.quantity, self.state.shoppingCartId);

    }

    //改变数量
    onChangeQuantity(n) {
        this.setState({
            quantity: n
        });
    }

    render() {
        let quantity = this.state.quantity;
        return (
            <View style={styles.btnBox}>
                {quantity > 0 ? this.renderReduce() : (null)}
                {quantity > 0 ? this.renderInput() : (null)}
                {this.renderAdd()}
            </View>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            quantity: nextProps.Quantity,
            shoppingCartId: nextProps.shoppingCartId
        })
    }
}

export  class SearchPageCalculate extends Component {
    isOnClickAdd = false

    static defaultProps = {
        Quantity: 0
    };
    static propTypes = {
        Quantity: React.PropTypes.number,
        OnChange: React.PropTypes.func,
        onChangeQuantity: React.PropTypes.func,
    };

    timer = null;

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.Quantity,
            ShoppingCartId: props.ShoppingCartId,
            CompanyId:props.CompanyId,
            SpecId:props.SpecId,
            ProductId:props.ProductId,
            Price:props.Price,
            UnitAmount: props.UnitAmount,
            ifZero: false
        }
    }

    //加btn
    renderAdd() {
        return (
            <BCTouchable
                         onPress={() => this.onAdd()}>
                <BCImage style={[styles.btn2,{marginLeft:0}]}
                         resizeMode='contain'
                         source={require('../imgs/plus.png')}/>
            </BCTouchable>
        )
    }

    //加
    onAdd() {
        //极限值
        if (this.state.quantity >= 999) {
            toastShort('最大购买数量999')
            return false
        }

        this.setState({
            quantity: ++this.state.quantity
        }, () => {
            this._OnChange('add');
        })
    }

    //减btn
    renderReduce() {
        return (
            <BCTouchable
                onPress={() => this.onReduce()}
            >
                <BCImage style={[styles.btn2,{marginRight:0}]}
                         resizeMode='contain'
                         source={require('../imgs/reduce.png')}/>
            </BCTouchable>
        )
    }

    //减
    onReduce() {
        this.setState({
            quantity: --this.state.quantity
        }, () => {
            this._OnChange('reduce');
        });
    }

    //输入框
    renderInput() {

        return (
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    editable={false}
                    underlineColorAndroid='transparent'
                    keyboardType='numeric'
                    maxLength={3}
                    style={[styles.btnInput, gs.c_3a3838, gs.fts_15]}
                    value={this.state.ifZero ? '' : this.state.quantity + ''}
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
                                quantity: 0,
                                ifZero: false
                            }, () => {
                                this.props.OnChange('input', 0, this.props.ShoppingCartId,this.props.SpecId,this.props.CompanyId,this.props.ProductId);
                            });
                        }
                    }}/>
            </KeyboardAvoidingView>
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

        self.props.OnChange(type, self.state.quantity, self.props.ShoppingCartId,this.props.SpecId,this.props.CompanyId,this.props.ProductId,this.props.Price * this.props.UnitAmount);

    }

    //改变数量
    onChangeQuantity(n) {
        this.setState({
            quantity: n
        });
    }

    render() {

        let quantity = this.state.quantity;
        return (
            <View style={styles.btnBox}>
                { quantity > 0 ? this.renderReduce() : (null) }
                { quantity > 0 ? this.renderInput() : (null) }
                {this.renderAdd()}
            </View>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            shoppingCartId: nextProps.ShoppingCartId
        })
    }
}

const styles = StyleSheet.create({
    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    btn: {
        width: px2dp(21),
        height: px2dp(21),
        margin: px2dp(10),
    },
    btn2:{
        width: px2dp(21),
        height: px2dp(21),
        margin: px2dp(1)
    },
    btnInputWrap: {
        width: px2dp(32),
        height: px2dp(21)
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(21),
        padding: 0,
        //backgroundColor: 'red'
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});


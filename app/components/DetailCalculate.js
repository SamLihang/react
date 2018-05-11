import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TextInput,
    Alert,
    InteractionManager,
} from 'react-native';
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {toastShort} from '../utils/ToastUtil'
import {toDecimal2} from '../utils/FormatUtil';
import Parabolic from 'react-native-parabolic';

export default class DetailCalculate extends Component {
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
        Price:React.PropTypes.number,
        DisplayUnitTypeId:React.PropTypes.number,
        UnitAmount:React.PropTypes.number,
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
            <BCTouchable style={[{paddingHorizontal: px2dp(2),}]}
                         onPress={() => this.onAdd()}>
                <BCImage style={[styles.btn]}
                         resizeMode='contain'
                         source={require('../imgs/plus.png')}/>
            </BCTouchable>
        )
    }

    //加
    onAdd() {
        //极限值
        if (this.state.quantity >= 999) {
            toastShort('最大数量999')
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
                style={[{paddingHorizontal: px2dp(2),}]}
                onPress={() => this.onReduce()}
            >
                <BCImage style={[styles.btn]}
                         resizeMode='contain'
                         source={require('../imgs/reduce.png')}/>
            </BCTouchable>
        )
    }

    //减
    onReduce() {
       /* if (this.state.quantity == 1) {
            toastShort("验货数量不能再减了哦")
        }else{
            this.setState({
                quantity: --this.state.quantity
            }, () => {
                this._OnChange('reduce');
            });
        }*/
        this.setState({
            quantity: --this.state.quantity
        }, () => {
            this._OnChange('reduce');
        });
    }

    //输入框
    renderInput() {
        return (
            <TextInput
                editable={true}
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                maxLength={7}
                style={[styles.btnInput, gs.c_3a3838, gs.fts_15]}
                defaultValue={this.state.ifZero ? "0" :  toDecimal2(this.state.quantity) + ''}
                onChangeText={(text) => {
                    var re = /^[0-9]+.?[0-9]*$/;
                    if (text!= "") {
                        if (!re.test(text)) {
                            toastShort("请输入正确的数字");
                            text = this.state.quantity;
                        }
                    }
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
                    //toDecimal2(parseFloat(num));
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

const styles = StyleSheet.create({
    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    btn: {
        width: px2dp(21),
        height: px2dp(21)
    },
    btnInput: {
        width: px2dp(60),
        height: px2dp(21),
        padding: 0,
        //backgroundColor: 'red',
        textAlign: 'center',
        //textAlignVertical: 'center',
    },
});


/**
 * Created by sencha on 2017/5/4.
 */
import React, {Component} from "react";
import {StyleSheet} from "react-native";
import {BCImage, BCTouchable, px2dp} from "../BaseComponent";

export default class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsSelect: props.IsSelect
        };
    }

    static propTypes = {
        CompanyId: React.PropTypes.number,
        ProductId: React.PropTypes.number,
        ProductType: React.PropTypes.number,
        IsSelect: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        Price: React.PropTypes.number,
        Quantity: React.PropTypes.number,
        ShoppingCartId: React.PropTypes.number,
        _product: React.PropTypes.object,
        Checked: React.PropTypes.number,
        UnChecked: React.PropTypes.number,
        SalesOrderId: React.PropTypes.number,
        SCompanyId: React.PropTypes.number,
        Key: React.PropTypes.number,
        Amount: React.PropTypes.number,
        SpecId: React.PropTypes.number,
        CompanyName: React.PropTypes.string,
        DisplayUnitTypeId: React.PropTypes.number,
        UnitAmount: React.PropTypes.number,
    };
    static defaultProps = {
        IsSelect: false,
        _product: {},
        Checked: require('../imgs/onSelect.png'),
        UnChecked: require('../imgs/Select.png'),
        WillReceiveProps: true
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.WillReceiveProps) {
            this.setState({
                IsSelect: nextProps.IsSelect
            })
        }
    }

    OnChange(isSelect, obj, callback) {
        this.state.IsSelect = isSelect;
        this.setState({IsSelect: isSelect}, () => {
            callback && callback(obj)
        })
    }

    _onPress() {
        let val=!this.state.IsSelect;
        this.setState({IsSelect: val},()=>{
            this.props.OnChange(val);
        });
    }

    //获取Quantity
    getQuantity(type, ProductObj, product) {
        this._Products[ProductObj.ProductId] = product;
    }

    render() {
        return (
            <BCTouchable style={[styles.chooseBtn]}
                         onPress={() => this._onPress()}>
                <BCImage style={[styles.chooseCIcle]}
                         source={this.state.IsSelect ? this.props.Checked : this.props.UnChecked}/>
            </BCTouchable>
        )
    }
}

const styles = StyleSheet.create({
    chooseBtn: {
        height: px2dp(44),
        width: px2dp(46),
        justifyContent: 'center',
        alignItems: 'center'
    },
    chooseCIcle: {
        width: px2dp(20),
        height: px2dp(20),
    }
});
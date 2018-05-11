/**
 * Created by sencha on 2017/5/4.
 */
import React, {Component} from "react";
import {StyleSheet} from "react-native";
import {BCImage, BCTouchable, px2dp} from "../../../BaseComponent";

export default class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsSelect: props.IsSelect,
            isEdit: props.isEdit,
        };
    }

    static propTypes = {
        BCompanyId: React.PropTypes.number,
        ProductId: React.PropTypes.number,
        ProductType: React.PropTypes.number,
        IsSelect: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        Price: React.PropTypes.number,
        Quantity: React.PropTypes.number,
        ShoppingCartId: React.PropTypes.number,
        _product: React.PropTypes.object,
        Checked: React.PropTypes.number,
        UnChecked:React.PropTypes.number,
        SalesOrderId:React.PropTypes.number,
        SCompanyId:React.PropTypes.number,
        Key:React.PropTypes.number,
        Amount:React.PropTypes.number,
        isEdit: React.PropTypes.bool,
        Image:React.PropTypes.number,
        PriceGroupId:React.PropTypes.number,
    };
    static defaultProps = {
        IsSelect: false,
        isEdit:false,
        _product: {},
        Checked:require('../../../imgs/onSelect.png'),
        UnChecked:require('../../../imgs/Select.png'),
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            IsSelect: nextProps.IsSelect,
            isEdit:nextProps.isEdit,
        })
    }

    //改变状态
    onChangeEdit() {
        this.setState({
            isEdit: !this.state.isEdit
        });
    }

    OnChange(isSelect, obj, callback) {
        this.setState({IsSelect: isSelect}, () => {
            callback && callback(obj)
        })
    }

    _onPress() {
        this.setState({IsSelect: !this.state.IsSelect}, () => {
            this.props.OnChange(this.state.IsSelect);
        })
    }


    render() {
        return (
            this.state.isEdit?
            <BCTouchable style={[styles.chooseBtn]}
                         onPress={() => this._onPress()}>
                <BCImage style={[styles.chooseCIcle]} source={this.state.IsSelect ? this.props.Checked :this.props.UnChecked}/>
            </BCTouchable>:null

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
})
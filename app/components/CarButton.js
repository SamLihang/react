/**
 * Created by Administrator on 2017/5/8.
 */
import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {BCTouchable,BCImage,px2dp,BCText,NavigationOptions} from '../BaseComponent'
import gs from '../styles/MainStyles';
export default class CarButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: props.isEdit,
            _products:props. _products,
            _toPay:props._toPay,
            _deleteCell:props._deleteCell,
        };
    }
    static defaultProps={
        isEdit:false,
        _products: {}
    };
    static propTypes = {
        isEdit: React.PropTypes.bool,
        OnChange:React.PropTypes.func,
        _products: React.PropTypes.object,
        _toPay: React.PropTypes.func,
        _deleteCell: React.PropTypes.func,
    };
    componentWillReceiveProps(nextProps){
        this.setState({
            isEdit:nextProps.isEdit,
        })
    };
    //改变状态
    onChangeEdit() {
        this.setState({
            isEdit: !this.state.isEdit
        });
    }
    _deleteCell(){
        this.setState(() => {
            this.props._deleteCell()
        });
    };
    _toPay(one){
        this.setState(() => {
            this.props._toPay(one)
        });
    }
    render(){
        return(
                this.state.isEdit?
                    <BCTouchable style={[gs.bgc_fd0319, Styles.pay]} onPress={() => {
                        this._deleteCell(false)
                    }}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>删除</BCText>
                    </BCTouchable> :
                    <BCTouchable style={[gs.bgc_fd0319, Styles.pay]} onPress={() => {
                        this._toPay(true)
                    }}>
                        <BCText style={[gs.c_fff, gs.fts_17]}>去结算</BCText>
                    </BCTouchable>
        )
    }
}
const Styles = StyleSheet.create({
    rigthButton: {
        width: '20%',
        alignItems: 'center'
    },
    pay: {
        width: '25%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
});

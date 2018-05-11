/**
 * Created by Administrator on 2017/5/10.
 */
import React,{Component} from 'react';
import {Text,StyleSheet} from 'react-native';
import {BCTouchable,BCImage,px2dp} from '../BaseComponent'

export default class CheckBox extends  Component{
    constructor(props){
        super(props);
        this.state={
            IsSelect:props.IsSelect
        };
    }

    static propTypes = {
        OnChange:React.PropTypes.func,
        _product: React.PropTypes.object,
    };
    static defaultProps={
        IsSelect:false,
        _product: {}
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            IsSelect:nextProps.IsSelect
        })
    }
    OnChange(isSelect,obj,callback){
        this.setState({IsSelect:isSelect},()=>{
            callback && callback(obj)
        })
    }
    _onPress(){
        this.setState({IsSelect:!this.state.IsSelect},()=>{
            this.props.OnChange(this.state.IsSelect);
        })
    }

    //获取Quantity
    getQuantity(type,ProductObj,product){
        this._Products[ProductObj.ProductId] = product;
    }

    render(){
        let uri1 = require('../imgs/closeeye.png');
        let uri2 = require('../imgs/open.png');
        return(
            <BCTouchable style={[styles.chooseBtn]}
                         onPress={() => this._onPress()}>
                <BCImage style={[styles.chooseEye]} source={this.state.IsSelect ? uri2 : uri1}/>
            </BCTouchable>
        )
    }
}
const  styles=StyleSheet.create({
    chooseBtn: {
        height:px2dp(44),
        width:px2dp(46),
        justifyContent:'center',
        alignItems:'center',
        marginRight: px2dp(32)
    },
    chooseEye: {
        width: px2dp(20),
        height: px2dp(20),
    }
})
/**
 * Created by Administrator on 2017/5/8.
 */
import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {BCTouchable,BCImage,px2dp,BCText,NavigationOptions} from '../../../BaseComponent'
import gs from '../../../styles/MainStyles';
export default class CarButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: props.isEdit,
            _products:props. _products,
            _toAdd:props._toAdd,
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
        _toAdd: React.PropTypes.func,
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
    _toAdd(){
        this.setState(() => {
            this.props._toAdd()
        });
    }
    render(){
        return(
                this.state.isEdit?
                    <BCTouchable style={[gs.bgc_fd0319, Styles.add]} onPress={() => {this._deleteCell()}}>
                        <View >
                            <BCText style={[gs.c_fff, gs.fts_15]}>删除价格组</BCText>
                        </View>
                    </BCTouchable>:
                    <BCTouchable style={[gs.bgc_BaseColor, Styles.add]} onPress={() => {this._toAdd()}}>
                        <View >
                            <BCText style={[gs.c_fff, gs.fts_15]}>添加价格组</BCText>
                        </View>
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
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    add: {
        //width: '100%',
        height: px2dp(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2dp(8),
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    },
});

/**
 * Created by Administrator on 2017/5/6.
 */
import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {BCTouchable, BCImage, px2dp, BCText} from '../BaseComponent'
import gs from '../styles/MainStyles';

export default class EditButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: props.isEdit,
        };
    }

    static defaultProps = {
        isEdit: false
    };

    static propTypes = {
        CompanyId: React.PropTypes.number,
        ProductId: React.PropTypes.number,
        isEdit: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        Price: React.PropTypes.number,
        Quantity: React.PropTypes.number,
        textStyle: React.PropTypes.array,
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            isEdit: nextProps.isEdit,
        })
    };

    OnChange(isEdit, obj, callback) {
        this.setState({
            isEdit: isEdit
        })
    };

    _onPress() {
        this.setState({isEdit: !this.state.isEdit}, () => {
            this.props.OnChange(this.state.isEdit);
        })
    };

    render() {
        return (
            <BCTouchable activeOpacity={0.3} style={Styles.rigthButton}
                         onPress={() => this._onPress()}>
                {this.state.isEdit ?
                    <BCText style={[Styles.buttonText, this.props.textStyle]}>完成</BCText> :
                    <BCText style={[Styles.buttonText, this.props.textStyle]}>编辑</BCText>
                }
            </BCTouchable>
        )
    }
}

const Styles = StyleSheet.create({
    rigthButton: {
        width: '20%',
        alignItems: 'center'
    },
});
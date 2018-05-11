/**
 * Created by sencha on 2017/5/4.
 */
import React, {Component} from 'react';
import {BCText} from '../BaseComponent';
import {toDecimal2} from '../utils/FormatUtil'

export default class TextChange extends Component {
    static defaultProps = {
        edit: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            Text: props.Text,
            edit: props.edit
        };
    }

    static propTypes = {
        Text: React.PropTypes.string,
        edit: React.PropTypes.bool
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            Text: nextProps.Text
        })
    }

    OnChange(text) {
        this.setState({Text: text})
    }

    //改变状态
    onChangeEdit() {
        this.setState({
            edit: !this.state.edit
        });
    }

    render() {
        return (
            <BCText {...this.props}>￥{toDecimal2(this.state.Text)}元</BCText>
        )
    }
}
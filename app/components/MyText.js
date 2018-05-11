/**
 * Created by sencha on 2017/5/4.
 */
import React,{Component} from 'react';
import {Text} from 'react-native';

export default class MyText extends  Component{
    constructor(props){
        super(props);
        this.state={};
    }

    static propTypes = {
        TextContent: React.PropTypes.object,
    };

    shouldComponentUpdate(nextProps,nextState){
        return nextProps!==this.props;
    }

    render(){
        return(
            <Text {...this.props}>{this.props.TextContent}</Text>
        )
    }
}
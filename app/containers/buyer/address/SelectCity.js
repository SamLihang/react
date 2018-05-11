import React, {Component} from 'react';
import PageComponent,{PullListComponent} from '../../PageComponent'
import {connect} from "react-redux";
import {toastShort} from '../../../utils/ToastUtil';
import {ActionCities} from "../../../actions/BuyerIndexAction";
import {StyleSheet, View, TextInput, Platform, ScrollView,FlatList} from 'react-native';
import {px2dp,px2dpH, deviceWidth, BCText, BCTouchable, BCImage, BCHostImage,substr,NavigationOptions} from '../../../BaseComponent';

class SelectCity extends PageComponent{

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
            <View/>
        )
    }







    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionCities());
    }
    WillReceive(nextProps){
        if (nextProps.ReduceCities.datas !== null && nextProps.ReduceCities.datas !== this.props.ReduceCities.datas) {
            const {ReduceCities} = nextProps;
            let Cities = ReduceCities.datas;
            this.setState({
                Data: Cities,
            });
        }
    }

}

const styles = StyleSheet.create({





})

function mapStateToProps(store) {
    return {
        ReduceCities: store.ReduceCities,
    }
}
const connectSelectCity = connect(mapStateToProps)(SelectCity);
connectSelectCity.navigationOptions = NavigationOptions;
export default connectSelectCity;
















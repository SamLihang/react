/**
 * Created by sencha on 2017/3/25.
 */
import React,{Component} from 'react'
import {View,Text,ScrollView} from 'react-native'
import Cat from '../pages/Cat'
export default class Test extends Component{
    render(){
        return(
            <View style={{flex:1}}>
                <ScrollView stickyHeaderIndices={[4]}>
                    <Cat/>
                </ScrollView>
            </View>
        )
    }
}
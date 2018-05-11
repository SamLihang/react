import React, { Component } from 'react';
import { WebView, View, StyleSheet,Platform } from 'react-native';
import renderChart from './renderChart';
import echarts from './echarts.min';

export default class App extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.option !== this.props.option) {
      this.refs.chart.reload();
    }
  }

  render() {
    return (
      <View style={{flex: 1, height: this.props.height || 400,}}>
        <WebView
          ref="chart"
          scrollEnabled = {false}
          injectedJavaScript = {renderChart(this.props)}
          style={{
            height: this.props.height || 400,
          }}

          //source={require('./tpl.html')}
            ///// 百度提供解决方案 解决安卓真机白屏问题
            //source={{uri: 'file:///android_asset/tpl.html'}}

            //韩桂光 2017-08-29
          source={ Platform.OS === 'ios' ? require('./tpl.html'): {uri: 'file:///android_asset/tpl.html'}}


        />
      </View>
    );
  }
}

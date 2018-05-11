import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    DatePickerIOS
} from 'react-native';

export class DateTimePickerIos extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datePickerModalVisible: false,  //选择器显隐标记
            chooseDate: new Date()  //选择的日期
        };
    }
    _showDatePicker () { //切换显隐标记
        this.setState({datePickerModalVisible: !this.state.datePickerModalVisible});
    };

    _onDateChange (date) {  //改变日期state
        alert(date);  //弹出提示框: 显示你选择日期
        this.setState({
            chooseDate: date
        });
    };

    render() {
        let datePickerModal = (   //日期选择器组件 (根据标记赋值为 选择器 或 空)
            this.state.datePickerModalVisible ?
                <View
                    modalVisible={this.state.datePickerModalVisible}  //显隐标记
                    onCancel={()=>this._showDatePicker()}>  //点击取消按钮 触发事件
                    <View style={styles.datePickerContainer}>
                        <DatePickerIOS
                            mode={"datetime"}   //选择器模式: 'date'(日期), 'time'(时间), 'datetime'(日期和时间)
                            minimumDate={new Date()}  //最小时间 (这里设置的是当前的时间)
                            minuteInterval={30} //最小时间间隔 (这里设置的是30分钟)
                            date={this.state.chooseDate}  //默认的时间
                            onDateChange={this._onDateChange.bind(this)}  //日期被修改时回调此函数
                        />
                    </View>
                </View> : null
        );

        return (
            <View style={styles.container}>
                <TouchableHighlight
                    style={{backgroundColor:'cyan', padding:5}}
                    onPress={()=>this._showDatePicker()}  //按钮: 点击触发方法
                    underlayColor='gray'
                >
                    <Text >show DatePick</Text>
                </TouchableHighlight>
                {datePickerModal}  //日期选择组件
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    datePickerContainer: {
        flex: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 10,
    },
});

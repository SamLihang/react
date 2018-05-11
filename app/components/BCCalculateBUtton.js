import React, {
    Component,
} from 'react'
import {
    StyleSheet,
    Alert,
    View,
    Text,
    Image,
    Dimensions,
    Platform,
    Button
} from 'react-native'

import Parabola from './Parabola'
import image_cart from '../imgs/right.png'

let {width: deviceWidth, height: deviceHeight} = Dimensions.get('window')
let contentTop = Platform.OS == 'ios' ? 64 : 56

export default class BCCalculateBUtton extends Component {

    // 构造
    constructor(props) {
        super(props)
        // 初始状态
        this.state = {
            isTrigger: false,
            start: null,
            end: null,
        }
        this._startPositions = {}
        this._endPositions = {}
    }

    render() {
        return (
            //to get the page origin (0, 0), container need not to be set margin, padding and border
            <View style={{flex: 1,}}>
                <View style={{marginTop: contentTop, flex: 1,}}>
                    <Button
                        onLayout={ this._onLayout1.bind(this, 'key-1') }
                        onPress={this._onPressHandler_1.bind(this, 'key-1')}
                        touchableType={'blur'}
                        style={{position: 'absolute', left: 10, top: 10, justifyContent: 'center', width: 20, height: 20, backgroundColor: 'red', borderRadius: 10, justifyContent: 'center',}}
                        textStyle={{position: 'relative', bottom: 1, fontSize: 17, color: 'white'}}

                    >
                        +
                    </Button>


                </View>

                <View onLayout={this._onLayoutCart1}
                      style={{opacity: 1, backgroundColor: 'red', borderRadius: 15, position: 'absolute', width: 30, height: 30, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',}}>
                    <Image source={image_cart}
                           style={{width: 15, height: 15,}}/>
                </View>
                <View onLayout={this._onLayoutCart2} style={{
                    opacity: 1,
                    backgroundColor: '#00AAEF',
                    borderRadius: 15,
                    position: 'absolute',
                    width: 30,
                    height: 30,
                    left: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image source={image_cart}
                           style={{width: 15, height: 15,}}/>
                </View>

                <Parabola
                    isTrigger={this.state.isTrigger}
                    rate={0.9}
                    start={this.state.start}
                    end={this.state.end}
                    renderParabola={this._renderParabola}
                />
            </View>
            //Parabola need to be contained by root container
        )
    }

    _onLayout1 = (key, e) => {
        let {x, y} = e.nativeEvent.layout
        //console.log(`x: ${x}, y: ${y}, dw: ${deviceWidth}, dh: ${deviceHeight}, contentTop: ${contentTop}`)
        this._startPositions[key] = {
            start: {
                x,
                y: y + contentTop,
            },
            //end: {
            //    x: deviceWidth - 5,
            //    y: deviceHeight - 20 - 5
            //},
        }
    }

    _onLayout2 = (key, e) => {
        let {x, y} = e.nativeEvent.layout
        //console.log(`x: ${x}, y: ${y}, dw: ${deviceWidth}, dh: ${deviceHeight}, contentTop: ${contentTop}`)
        this._startPositions[key] = {
            start: {
                x,
                y: y + contentTop,
            },
            //end: {
            //    x: 5,
            //    y: deviceHeight - 20 - 5
            //},
        }
    }

    _onLayoutCart1 = (e) => {
        let {x, y} = e.nativeEvent.layout
        this._endPositions['cart-1'] = {
            x: x + 5,
            y: y + 5,
        }
    }

    _onLayoutCart2 = (e) => {
        let {x, y} = e.nativeEvent.layout
        this._endPositions['cart-2'] = {
            x: x + 5,
            y: y + 5,
        }
    }

    _onPressHandler_1(key, e) {
        let startPositions = this._startPositions[key]

        startPositions.end = this._endPositions['cart-1']

        let {start, end} = startPositions

        this.setState({
            isTrigger: true,
            start,
            end,
        })
    }

    _onPressHandler_2(key, e) {
        let startPositions = this._startPositions[key]

        startPositions.end = this._endPositions['cart-2']

        let {start, end} = startPositions

        this.setState({
            isTrigger: true,
            start,
            end,
        })
    }

    _renderParabola = ({index, translateX, translateY}) => {
        return (
            <View
                key={`'parabola-ball-'${index}`}
                style={[
                    {position: 'absolute',},    //Don't forget to set this
                    {width: 20, height: 20, borderRadius: 10, backgroundColor: 'red',},
                    {transform: [{translateX}, {translateY}]},
                ]}
            />
        )
    }

}
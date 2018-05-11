/**
 * Created by Administrator on 2017/5/24.
 */
import React, {Component} from 'react';
import {ScrollView, StyleSheet, View, FlatList,TextInput,PanResponder,Platform} from "react-native";
import {PullListComponent, PullViewComponent} from '../../PageComponent'
import { deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr, deviceHeight, NavigationOptions, BCHostImage,}
from "../../../BaseComponent";
import gs from '../../../styles/MainStyles';

var _previousLeft=0;
var _previousTop=-4;
var lastLeft=0;
var lastTop=0;
var barWidth=px2dp(256);
const CIRCLE_SIZE=px2dp(30);
export default class Progress extends Component{
    constructor(props){
        super(props);
        this.state={
            style:{
                left:0,
            },
            image:[
                require('../../../imgs/round2.png'),
                require('../../../imgs/greenBg.png')
            ],
        };
        this.onStartShouldSetPanResponder=this.onStartShouldSetPanResponder.bind(this);
        this.onMoveShouldSetPanResponder=this.onMoveShouldSetPanResponder.bind(this);
        this.onPanResponderGrant=this.onPanResponderGrant.bind(this);
        this.onPanResponderMove=this.onPanResponderMove.bind(this);
        this.onPanResponderEnd=this.onPanResponderEnd.bind(this);
    }
    static propTypes = {
        Discount: React.PropTypes.number,
    };
    static defaultProps = {
    //Discount:parseInt(((leftW)/(barWidth-CIRCLE_SIZE-px2dp(72))*100)+80),
    }
    //用户开始触摸屏幕的时候，是否愿意成为响应者；
    onStartShouldSetPanResponder(evt, gestureState){
        return true;
    }
    //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
    onMoveShouldSetPanResponder(evt, gestureState){
        return true ;
    }
    // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
    onPanResponderGrant(evt, gestureState){
        //console.log('onPanResponderGrant...');
        this.setState({
            style:{
                left:_previousLeft,
                top:_previousTop,
            }
        });
    }
    // 最近一次的移动距离为gestureState.move{X,Y}
    onPanResponderMove(evt, gestureState){
        _previousLeft=lastLeft+gestureState.dx;

        if(_previousLeft<=1){
            _previousLeft=px2dp(1);
        }
        if(_previousLeft>=barWidth-CIRCLE_SIZE-px2dp(36)){
            _previousLeft=barWidth-CIRCLE_SIZE-px2dp(36);
        }
        //宽度加10，判断
        if(_previousLeft>0&&_previousLeft<=(barWidth-px2dp(62))/3){
            this.setState({
                style:{
                },
                image:[
                    require('../../../imgs/round2.png'),
                    require('../../../imgs/greenBg.png')
                ]
            });
        }
        if(_previousLeft>(barWidth-px2dp(61))/3&&_previousLeft<=(barWidth-px2dp(64))*2/3){
            this.setState({
                style:{
                },
                image:[
                    require('../../../imgs/round2.png'),
                    require('../../../imgs/greenBg.png')
                ]
            });
        }
        if(_previousLeft>(barWidth-px2dp(64))*2/3&&_previousLeft<=(barWidth-px2dp(64))){
            this.setState({
                style:{
                },
                image:[
                    require('../../../imgs/round2.png'),
                    require('../../../imgs/greenBg.png')
                ]
            });
        }


        //实时更新
        this.setState({
            style:{
                left:_previousLeft,
                top:_previousTop,
            }
        });
    }
    // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
    // 一般来说这意味着一个手势操作已经成功完成。
    onPanResponderEnd(evt, gestureState){

        lastLeft=_previousLeft;
        lastTop=_previousTop;

        this.changePosition();
    }

    /**
     根据位置做出相应处理
     **/
    changePosition(){
        this.setState({
            style:{
                left:_previousLeft,
            }
        });
    }

    componentWillMount(evt, gestureState){
        this._panResponder=PanResponder.create({
            onStartShouldSetPanResponder:this.onStartShouldSetPanResponder,
            onMoveShouldSetPanResponder:this.onMoveShouldSetPanResponder,
            onPanResponderGrant:this.onPanResponderGrant,
            onPanResponderMove:this.onPanResponderMove,
            onPanResponderRelease:this.onPanResponderEnd,
            onPanResponderTerminate:this.onPanResponderEnd,
        });
    }

    //因为宽度加了10，所有都加10 判断条件由52到62
    leftView(leftWidth){
        if(leftWidth>0&&leftWidth<=(barWidth-px2dp(62))/3){
            return(
                <View style={[styles.scrollView,{alignItems:"center",  marginLeft:px2dp(10),height:px2dp(22)}]}>
                    <View style={{height:px2dp(4),width:leftWidth+CIRCLE_SIZE/2, backgroundColor: "#00C164",
                        borderTopLeftRadius: CIRCLE_SIZE/2,
                        borderBottomLeftRadius: CIRCLE_SIZE/2,
                    }}>
                    </View>
                    <View style={{height:px2dp(4),width:barWidth-leftWidth-CIRCLE_SIZE/2-px2dp(45), backgroundColor: "#00C164",
                        opacity:0.2,
                        borderTopRightRadius: CIRCLE_SIZE/2, borderBottomRightRadius: CIRCLE_SIZE/2
                    }}>
                    </View>
                    <View style={{height:px2dp(22),
                        justifyContent:"center",
                        paddingRight:px2dp(10),
                        position: 'absolute',
                        right:0,
                    }}>
                        <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                            {
                                leftWidth===undefined?"100%":
                                    parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                            }
                        </BCText>
                    </View>
                </View>
            )
        }
        if(leftWidth>(leftWidth-px2dp(61))/3&&leftWidth<=(barWidth-px2dp(64))*2/3){
            return(
                <View style={[styles.scrollView,{alignItems:"center", marginLeft:px2dp(10)}]}>
                    <View style={{height:px2dp(4),width:leftWidth+CIRCLE_SIZE/2, backgroundColor: "#00C164",
                        borderTopLeftRadius: CIRCLE_SIZE/2,
                        borderBottomLeftRadius: CIRCLE_SIZE/2
                    }}>
                    </View>
                    <View style={{height:px2dp(4),width:barWidth-leftWidth-CIRCLE_SIZE/2-px2dp(45), backgroundColor: "#00C164",
                        borderTopRightRadius: CIRCLE_SIZE/2, borderBottomRightRadius: CIRCLE_SIZE/2,
                        opacity:0.2,
                    }}>
                    </View>
                    <View style={{height:px2dp(22),
                        justifyContent:"center",
                        paddingRight:px2dp(10),
                        position: 'absolute',
                        right:0,
                    }}>
                        <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                            {
                                leftWidth===undefined?"100%":
                                    parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                            }
                        </BCText>
                    </View>
                </View>

            )
        }
        if(leftWidth>(barWidth-px2dp(64))*2/3&&leftWidth<=(barWidth-px2dp(64))){
            return(
                <View style={[styles.scrollView,{alignItems:"center", marginLeft:px2dp(10)}]}>
                    <View style={{height:px2dp(4),width:leftWidth+CIRCLE_SIZE/2, backgroundColor: "#00C164",
                        borderTopLeftRadius: CIRCLE_SIZE/2,
                        borderBottomLeftRadius: CIRCLE_SIZE/2
                    }}>
                    </View>
                    <View style={{height:px2dp(4),width:barWidth-leftWidth-CIRCLE_SIZE/2-px2dp(45), backgroundColor: "#00C164",
                        borderTopRightRadius: CIRCLE_SIZE/2, borderBottomRightRadius: CIRCLE_SIZE/2,
                        opacity:0.2,
                    }}>
                    </View>
                    <View style={{height:px2dp(22),
                        justifyContent:"center",
                        paddingRight:px2dp(10),
                        position: 'absolute',
                        right:0,
                    }}>
                        <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                            {
                                leftWidth===undefined?"100%":
                                    parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                            }
                        </BCText>
                    </View>
                </View>
            )
        }
    }


   rightText(leftWidth){
       if(leftWidth>0&&leftWidth<=(barWidth-px2dp(52))/3){
           return(
               <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                   {
                       leftWidth===undefined?"100%":
                           parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                   }
               </BCText>
           )
       }
       if(leftWidth>(leftWidth-px2dp(51))/3&&leftWidth<=(barWidth-px2dp(54))*2/3){
           return(
               <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                   {
                       leftWidth===undefined?"100%":
                           parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                   }
               </BCText>
           )
       }
       if(leftWidth>(barWidth-px2dp(54))*2/3&&leftWidth<=(barWidth-px2dp(54))){
           return(
               <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                   {
                       leftWidth===undefined?"100%":
                           parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                   }
               </BCText>
           )
       }

   }

    render(){
        const {TextReduce,dispatch} =this.props;
        let leftWidth=this.state.style.left;

        return(
            <View  style={[styles.con]} Discount={this.props.Discount}>

                <BCImage
                    {...this._panResponder.panHandlers}
                    style={[styles.circle,this.state.style]}
                    source={
                        this.state.image[0]
                    }
                >
                    <BCText style={[styles.value, { color: "#fff" }]}>
                        {
                            leftWidth===undefined?0:
                                parseInt(
                                    ((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                        }
                    </BCText>
                </BCImage>

                {
                    ( leftWidth===undefined||leftWidth===0)?
                        <BCImage style={{alignItems:"center", height:px2dp(22),flexDirection:"row",}}
                                 source={this.state.image[1]}
                        >
                            <View style={[styles.scrollView1, {
                                height:px2dp(4),
                                width:barWidth-px2dp(20),
                                backgroundColor:"#00C164",
                                opacity:0.2,
                            }]}>
                            </View>
                        </BCImage>
                        :
                            <View style={{height:px2dp(22),width:barWidth,flexDirection:"row",}}>
                             {this.leftView((leftWidth))}
                             </View>
                }
                <View style={{height:px2dp(22),
                    justifyContent:"center",
                    paddingRight:px2dp(10),
                    position: 'absolute',
                    right:0,
                }}>


                    <BCText style={[{ color: "#00C164",fontSize:px2dp(10)}]}>
                                {
                                    Platform.OS==="ios"?null:
                                    leftWidth===undefined?"200%":
                                        parseInt(((leftWidth)/(barWidth-CIRCLE_SIZE-px2dp(36))*100)+100)+"%"
                                }
                    </BCText>
                </View>
            </View>
        )
    }
    componentDidMount(){
        this.setState({
            style:{
                left:this.props.left,
            },
        })
    }
}

const styles = StyleSheet.create({
    con: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollView:{
        width:barWidth-px2dp(3),
        height:px2dp(22),
        position: 'relative',
        borderRadius:10,
        top:0,
        flexDirection: 'row',
    },
    scrollView1:{
        height:px2dp(6),
        position: 'relative',
        borderRadius:10,
        top:0,
        flexDirection: 'row',
    },
    circle:{
        width:CIRCLE_SIZE,
        height:CIRCLE_SIZE,
        borderRadius:CIRCLE_SIZE/2,
        position: 'absolute',
        zIndex:20,
    },
    value: {
        fontSize: 11,
        width: CIRCLE_SIZE,
        textAlign: 'center',
        alignItems:"center",
        justifyContent:"center",
        marginTop:7
    }

});
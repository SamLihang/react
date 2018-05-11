/**
 * Created by Administrator on 2017/5/10.
 */
import React, {Component} from "react";
import {BCText, BCTouchable, px2dp} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";

export default class TimerButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            timerCount: this.props.timerCount || 60,
            timerTitle: this.props.timerTitle || '获取验证码',
            counting: false,
            selfEnable: true,
        };
    }

    static propTypes = {
        style: React.PropTypes.object,
        onClick: React.PropTypes.func,
        disableColor: React.PropTypes.string,
        timerTitle: React.PropTypes.string,
        Phone:React.PropTypes.string,
        enable: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.number])
    };

    _countDownAction() {
        const codeTime = this.state.timerCount;
        this.interval = setInterval(() => {
            const timer = this.state.timerCount - 1;
            if (timer === 0) {
                this.interval && clearInterval(this.interval);
                this.setState({
                    timerCount: codeTime,
                    timerTitle: this.props.timerTitle || '获取验证码',
                    counting: false,
                    selfEnable: true
                })
            } else {
                //console.log("---- timer ", timer);
                this.setState({
                    timerCount: timer,
                    timerTitle: `${timer}s后重发`,
                })
            }
        }, 1000)
    }

    _shouldStartCountting() {
        this._countDownAction()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        const {style, enable, disableColor} = this.props;
        const {counting, timerTitle, selfEnable} = this.state;
        return (
            <BCTouchable activeOpacity={counting ? 1 : 0.8}
                         style={{width: px2dp(99), height: px2dp(28), borderWidth: px2dp(0.5), borderColor: '#d2d2d2', borderRadius: px2dp(14.3), justifyContent: 'center', alignItems: 'center', marginRight: px2dp(25)
                         }}
                         onPress={() => {
                             if(!counting && selfEnable){
                                 this.setState({selfEnable:false},()=>{
                                     this.props.onClick()
                                 })
                                 this._shouldStartCountting()
                             }
                         }}>
                    <BCText style={[gs.c_888]}>
                        {timerTitle}
                    </BCText>
            </BCTouchable>
        )
    }
}
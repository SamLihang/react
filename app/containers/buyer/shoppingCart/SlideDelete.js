/**
 * Created by Administrator on 2017/5/5.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    PanResponder
} from 'react-native';
import BaseComponent, {deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr,BCHostImage} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import CheckBox from '../../../components/CheckBox';
import CarCalculate from '../../../components/CarCalculate';
var Data  = [
    {
        title : "狗 🐩",
        subTitle : "漂亮的狗 🐩",
        iconName : require('../../../imgs/notice.png'),
        cost : 6666.98,
        Unit:'斤',
    }
];

export default class SlideDelete extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            SelectStatus: false,
            left: 0,
            isEdit: props.isEdit,
            Quantity:props.Quantity,
            ProductName:props.ProductName,
            CompanyId:props.CompanyId,
            Unit:props.Unit,
            ProductId:props.ProductId,
            Price:props.Price,
        };
    }

    static defaultProps = {
        isEdit: false,
        title: '花',
        ProductName: '商品名称',
        Quantity: 0,
        CompanyId: 0,
        iconName: require('../../../imgs/notice.png'),
        Unit:"斤",
        ProductId:0,
    };
    static propTypes = {
        title: React.PropTypes.string,
        labelStyle: React.PropTypes.object,
        callAddClick: React.PropTypes.func,
        callDecreaseClick: React.PropTypes.func,
        callDeleteClick: React.PropTypes.func,
        isEdit: React.PropTypes.bool,
        Unit:React.PropTypes.string,
        OnChange: React.PropTypes.func,
        ProductId: React.PropTypes.number,
        ProductType:React.PropTypes.number,
        ProductName:React.PropTypes.string,
        CompanyId:React.PropTypes.number,
        Quantity:React.PropTypes.number,
        Price:React.PropTypes.number,
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            isEdit: nextProps.isEdit,
        })
    };

    //改变状态
    onChangeEdit() {
        if (this.state.left == -46) {
            this.setState({
                left: 0
            });
        } else {
            this.setState({
                isEdit: !this.state.isEdit
            });
        }

    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < 0) {
                    if (gestureState.dx < -46) {
                        this.setState({
                            left: -46
                        })
                    } else if (gestureState.dx >= -46) {
                        this.setState({
                            left: gestureState.dx
                        })
                    }
                } else {
                    if (gestureState.dx > 46 && this.state.left < 0) {
                        this.setState({
                            left: 0
                        })
                    } else if (gestureState.dx < 46 && this.state.left < 0) {
                        this.setState({
                            left: gestureState.dx - 46
                        })
                    }
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                var dx = gestureState.dx < 0 ? -46 : 0
                this.setState({
                    left: dx
                })
            }
        })
    }

    render() {
        const {dispatch} = this.props;
        return (
            <View style={{
                width: deviceWidth + 46,
                height: px2dp(83),
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: this.state.left
            }}

                  {...this._panResponder.panHandlers}
            >
                <CheckBox />
                {/*  <Image source= {this.props.iconName} style={{width: 90, height: 90, marginLeft: 15}}/>*/}

                {/* 下部分 */}
                {this.bottomView()}
                <BCTouchable style={[gs.bgc_fd0319, {
                    width: 46,
                    height: px2dp(83),
                    alignItems: 'center',
                    justifyContent: 'center'
                }]}
                             onPress={() => this.deleteClick()}>
                    <BCText style={{fontSize: 16, textAlign: 'center', color: 'white'}}>
                        删除
                    </BCText>
                </BCTouchable>
            </View>
        )
    }

    bottomView() {
        return (
            <View style={styles.bottomViewStyle}>
                <BCHostImage style={styles.productImg}
                             source={{uri: this.props.iconName}}/>
               {/* <BCImage style={styles.productImg}
                             source={ this.props.iconName}/>*/}
                <View style={styles.productView}>

                    <Text numberOfLines={1} style={[gs.fts_14, gs.c_3a3838, gs.bold]}>{substr(this.props.ProductName, 11)}</Text>
                    <BCText style={[gs.c_3a3838]}>
                        <BCText style={[gs.fts_11]}>￥</BCText>
                        <BCText style={[gs.fts_13]} numberOfLines={1}>{this.props.Price}</BCText>
                        <BCText style={[gs.fts_10]}>/{this.props.Unit}</BCText>
                    </BCText>
                    <Text style={{color: '#FD696B', fontSize: 16, position: 'absolute', bottom: 20}}>
                    </Text>
                    <View style={[styles.listDetailRight]}>
                        <BCText style={[gs.c_fd0319]}>
                            <BCText style={[gs.fts_11]}>￥</BCText>
                            <BCText style={[gs.fts_13]}>7.76</BCText>
                            <BCText style={[gs.fts_10]}>/斤</BCText>
                        </BCText>
                        <BCImage style={[styles.actIcon]} source={require('../../../imgs/drop.png')}/>
                    </View>
                </View>

                <View style={{
                    width: 65,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    borderColor: 'red',
                    borderRadius: 3,
                    position: 'absolute',
                    right: 10,
                    bottom: 6
                }}>
                    <Text style={{fontSize: 12, textAlign: 'center', color: 'red'}}>失效</Text>
                </View>

               {/* <View>
                    <SlideDelete
                        ref={(c) => {
                            this._SlideDelete = c
                        }}
                        callDeleteClick={()=> alert('删除')}
                        title={Data[0].title}
                        subTitle = {Data[0].subTitle}
                        iconName = {Data[0].iconName}
                    />
                </View>*/}
            </View>
        )

    }

    deleteClick() {
        this.props.callDeleteClick('删除');
    }

}
const styles = StyleSheet.create({
    bottomViewStyle: {
        width: deviceWidth - 46+8,
        height: px2dp(73),
        flexDirection: 'row',
    },

    dl: {
        marginBottom: px2dp(10),
        //paddingBottom:px2dp(13)
    },

    dt: {
        height: px2dp(44),
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingVertical: px2dp(7),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    chooseBtn: {
        marginRight: px2dp(13),
        marginLeft: px2dp(12),
    },
    chooseCIcle: {
        width: px2dp(20),
        height: px2dp(20),
    },
    comapnyImg: {
        width: px2dp(29),
        height: px2dp(29),
    },
    companyName: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },

    dd: {
        height: px2dp(73),
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: px2dp(12),
    },
    productImg: {
        width: px2dp(60),
        height: px2dp(60),
        marginRight: px2dp(9),
        marginTop: px2dp(7)
    },
    productView:{
        justifyContent:'space-around',
        height:px2dp(73),
        paddingTop:px2dp(7),
        paddingBottom:px2dp(7)
    },
    itemRight: {
        height: '100%',
        flex: 1,

    },
    listDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    listDetailRight: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: px2dp(1),
    },
    handleProduct: {},
    actIcon: {
        width: px2dp(15),
        height: px2dp(15),
        marginLeft: px2dp(7),
    },

    btnBox: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    btnInput: {
        width: px2dp(32),
        height: px2dp(22),
        padding: 0,
        textAlign: 'center',
        alignItems: 'center',
    },

    footerWrap: {
        width: '100%',
        height: px2dp(46),
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 1,
        paddingLeft: px2dp(12),
        backgroundColor: '#202020',
        opacity: 0.8
    },
    selectAll: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginRight: px2dp(13)
    },
    pay: {
        width: px2dp(94),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },

});
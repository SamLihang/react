/**
 * Created by Administrator on 2017/5/23.
 */
import React, {Component}from "react";
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, FlatList,TextInput,Platform} from "react-native";
import {PullListComponent, PullViewComponent} from '../../PageComponent'
import { deviceWidth, px2dp, BCText, BCImage, BCTouchable, substr, deviceHeight, NavigationOptions, BCHostImage,} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from '../../../components/CheckBox';
import {toastLong} from '../../../utils/ToastUtil'
import {ActionEditPriceGroup,EditArr,ActionPriceGroup} from './../../../actions/PriceGroupAction'
import ProgressBar from './ProgressBar'

var barWidth=px2dp(256);
//const CIRCLE_SIZE=px2dp(20);
const CIRCLE_SIZE=px2dp(30);
class PriceGroupEdit extends PullViewComponent{
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            item: {
                id:this.params.id,
                priceGroupName:this.params.PriceGroupName?this.params.PriceGroupName:'',
                discount:'',
            },
            Discount:100,
        }
    }
    Discount=null;
    //设置页面标题
    setTitle() {
        return "编辑价格组"
    }
    _ProgressBar=null;


    Bottom() {
        return (
            this.renderBottom()
        )
    }

    renderBottom() {
    }

    content() {
        const {dispatch} = this.props;
        const priceGroupName=this.params.PriceGroupName;
        return(
            <View style={[Styles.main]}>
                <View style={[Styles.TopView,gs.bgc_fff]}>
                    <View style={[Styles.groupView]}>
                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(13)}]}>价格组名称</BCText>
                        <TextInput
                            autoFocus={false}
                            underlineColorAndroid='transparent'
                            style={[Styles.input, gs.fts_14]}
                            placeholder={"最多输入5个字简称"}
                            placeholderTextColor={"#b7b7b7"}
                            defaultValue={priceGroupName}
                            maxLength={5}
                            onChangeText={(text) => {
                                this.state.item.priceGroupName = text;
                            }}
                        />
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center",marginTop:px2dp(10),height:px2dp(40)}}>
                        <BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(29)}]}>优惠折扣</BCText>
                        <View style={{marginLeft:px2dp(10)}}>
                            <ProgressBar
                                ref={(c) => {
                                    if (c != null) {
                                        this._ProgressBar=(c);
                                    }
                                }}
                            />

                        </View>

                     {/*   <View style={{backgroundColor:"#10bd9c",width:px2dp(257),height:px2dp(22),borderRadius:px2dp(5),opacity:0.2,marginLeft:px2dp(10)}}>
                        </View>*/}
                    </View>
                    <View style={{alignItems:"center",justifyContent:"center",marginTop:px2dp(40)}}>
                        <BCTouchable style={[gs.bgc_BaseColor, Styles.edit]} onPress={()=>{
                            const {dispatch} = this.props;

                            var leftW= this._ProgressBar.state.style.left;
                            if(leftW===0){
                                var discount=80;
                            }else{
                                //本来是宽度+10,70改到68
                                var discount=parseInt(((leftW)/(barWidth-CIRCLE_SIZE-px2dp(68))*100)+80);
                            }
                            let item = this.state.item;
                            let priceGroupName=item.priceGroupName;
                            if (priceGroupName == '') {
                                toastLong(JSON.stringify('价格组不能为空'));
                                return false;
                            }else{
                                if(item.id!==0){
                                    dispatch(ActionEditPriceGroup({id:item.id,priceGroupName:priceGroupName,discount:discount}));
                                    dispatch(EditArr({id:item.id,priceGroupName:priceGroupName,discount:discount}));
                                    const {navigation} = this.props;
                                    if (navigator) {
                                        navigation.goBack();
                                    }
                                }else{
                                    //this._Loading.Trigger(true);
                                    dispatch(ActionEditPriceGroup({id:0,priceGroupName:priceGroupName,discount:discount}));
                                    dispatch(ActionPriceGroup());
                                    dispatch(EditArr({id:0,priceGroupName:priceGroupName,discount:discount}));
                                    const {navigation} = this.props;
                                    if (navigator) {
                                        navigation.goBack();
                                        //重新渲染页面
                                        //dispatch(ActionPriceGroup());
                                    }
                                }

                            }
                        }}>
                            <View >
                                <BCText style={[gs.c_fff, gs.fts_17]}>保存</BCText>
                            </View>
                        </BCTouchable>
                    </View>

                </View>

            </View>
        )
    }

    WillMount() {
        this.setState({
            IsReceived: true
        });
    }
    WillReceive(nextProps) {
       /* if (nextProps.ReduceKeepPriceGroup.datas != null && nextProps.ReduceKeepPriceGroup.datas !== this.props.ReduceKeepPriceGroup.datas) {
            var lists =ReduceKeepPriceGroup.datas;
            this._Loading.Trigger(false);
        }*/
        if (nextProps.ReduceKeepPriceGroup.error != null && nextProps.ReduceKeepPriceGroup.error !== this.props.ReduceKeepPriceGroup.error) {
            this._Loading.Trigger(false);
        }
       /* if (nextProps.ReduceKeepPriceGroup.datas != null && nextProps.ReduceKeepPriceGroup.datas !== this.props.ReduceKeepPriceGroup.datas) {
            this._Loading.Trigger(false);
            const {dispatch,navigation} = this.props;
            if (navigator) {
                navigation.goBack();
                //重新渲染页面

            }
        }*/
    }

}
const Styles = StyleSheet.create({
    main: {
        flex: 1,
        minHeight: px2dp(deviceHeight+1)
    },
    TopView:{
      marginTop:px2dp(10),
        height:px2dp(195),
        width:"100%",
    },
    groupView:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:(Platform.OS==='ios')?px2dp(20):0,
    },
    input:{
        marginLeft:px2dp(10),
        width:px2dp(deviceWidth/2),

    },
    edit: {
        width: px2dp(265),
        height: px2dp(45),
        justifyContent: 'center',
        alignItems: 'center',
        padding:px2dp(10),
        borderRadius:px2dp(8),
    },
    //进度

});

function mapStateToProps(store) {
    return {
        ReduceKeepPriceGroup: store.ReduceKeepPriceGroup,
    }

}
const connectPriceGroupEdit = connect(mapStateToProps)(PriceGroupEdit);
connectPriceGroupEdit.navigationOptions = NavigationOptions;
export default connectPriceGroupEdit;
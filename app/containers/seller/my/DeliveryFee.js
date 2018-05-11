/**
 * Created by Administrator on 2017/4/24.
 */
import React from "react";
import {StyleSheet, TextInput, View ,Platform} from "react-native";
import {
    BCImage, BCText, BCTouchable, deviceHeight, deviceWidth, NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from "../../../components/CheckBox";
import {connect} from "react-redux";
import {toastShort} from "../../../utils/ToastUtil";
import {ActionSetDeliver, ActionDelivery} from "../../../actions/MyAction";
import {fetchSetDeliver} from '../../../services/MyServices';
import ProgressBars from './ProgressBars'

var barWidth = px2dp(256);
const CIRCLE_SIZE = px2dp(30);
class DeliveryFee extends PullViewComponent {

    //设置页面标题
    setTitle() {
        return "采购运费"
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowBottom: true,
            // this.StartPrice=0; //起送价
            // this.StartQuantity=0; //起送量
            // this.DeliveryAmount=0; //运费
            // this.ReplenishStartPrice = 0; //补货起送价
            // this.ReplenishDeliveryAmount = 0; // 补货配送费
            // this.ReplenishStartQuantity = 0;  //补货起送量
            // this.ReplenishDistance = 0;  //补货配送范围
            // this.ReplenishAddRate = 0;  //补货加价比
            FreeDistance: 0,
            StartPrice: 0,
            StartQuantity: 0,
            DeliveryAmount: 0,
            ReplenishStartPrice: 0,
            ReplenishDeliveryAmount: 0,
            ReplenishStartQuantity: 0,
            ReplenishDistance: 0,
            ReplenishAddRate: 0,
            errText: false,
            errMsg: '',
            errMsg1: ''
        }
    }

    _ProgressBar = null;

    check1(){
        if(isNaN(this.state.ReplenishDistance*1) || this.state.ReplenishDistance<0){
            this.setState({errText1: true,errMsg1:'请输入正确的补货配送范围哦～'})
        }else if(isNaN(this.state.ReplenishDeliveryAmount*1)|| this.state.ReplenishDeliveryAmount<0){
            this.setState({errText: true,errMsg1:'请输入正确的补货运费哦～'})
        }else if(isNaN(this.state.ReplenishStartPrice*1) || this.state.ReplenishStartPrice<0){
            this.setState({errText: true,errMsg1:'请输入正确的补货起送价哦～'})
        }else if(isNaN(this.state.ReplenishStartQuantity*1) || this.state.ReplenishStartQuantity<0){
            this.setState({errText: true,errMsg1:'请输入正确的补货起送量哦～'})
        }else{
            this.setState({errText: false,
                errMsg1:`补货配送范围${this.state.ReplenishDistance}km，补货运费${this.state.ReplenishDeliveryAmount}元
当订单达到${this.state.ReplenishStartQuantity}件且金额满足${this.state.ReplenishStartPrice}元时，不收取运费。`})
        }
    }
    check(){
        if(isNaN(this.state.FreeDistance*1) || this.state.FreeDistance<0){
            this.setState({errText: true,errMsg:'请输入正确的配送范围哦～'})
        }else if(isNaN(this.state.DeliveryAmount*1)|| this.state.DeliveryAmount<0){
            this.setState({errText: true,errMsg:'请输入正确的运费哦～'})
        }else if(isNaN(this.state.StartPrice*1) || this.state.StartPrice<0){
            this.setState({errText: true,errMsg:'请输入正确的起送价哦～'})
        }else if(isNaN(this.state.StartQuantity*1) || this.state.StartQuantity<0){
            this.setState({errText: true,errMsg:'请输入正确的起送量哦～'})
        }else{
            this.setState({errText: false,
                errMsg:`配送范围${this.state.FreeDistance}km，运费${this.state.DeliveryAmount}元
当订单达到${this.state.StartQuantity}件且金额满足${this.state.StartPrice}元时，不收取运费。`})
        }
    }

            renderItems(){
        return (
            <View style={{backgroundColor: '#f2f1ef'}}>
                <View style={{backgroundColor: '#fff'}}>
                    <View style={{flexDirection:'row',marginLeft:px2dp(10),marginTop:px2dp(12),paddingBottom:px2dp(12),borderBottomColor:'#eee',borderBottomWidth:1}}><BCImage source={require('../../../imgs/caigou.png')}/><BCText style={{marginLeft:px2dp(5)}}>采购运费规则</BCText></View>
                    <View>
                        <View style={{position:'absolute',top:px2dp(12),left:px2dp(15)}}><BCText style={[gs.c_fd3547]}>*</BCText></View>
                        <View style={Styles.deliveryFee}>
                        <BCText style={[gs.fts_15, gs.c_3a3838]}>配送范围</BCText>
                        <View style={Styles.startingLoad}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput style={Styles.amount2}
                                           placeholder={this.state.FreeDistance+''}
                                           keyboardType='numeric'
                                           placeholderTextColor='#fd3546'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {
                                                   this.state.FreeDistance = text*1;
                                                   this.check();
                                           }}
                                />
                            </View>
                        </View>
                        <BCText>(km)</BCText>
                    </View>
                    </View>
                    <View style={Styles.deliveryFee}>
                        <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>运费</BCText>
                        <View style={Styles.startingLoad}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput style={Styles.amount2}
                                           placeholder={this.state.DeliveryAmount+''}
                                           keyboardType='numeric'
                                           placeholderTextColor='#fd3546'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {
                                               this.state.DeliveryAmount = text*1;
                                               this.check();

                                           }}
                                />
                            </View>
                        </View>
                        <BCText>(元)</BCText>
                    </View>
                    <View style={[Styles.deliveryFee]}>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>起送价</BCText>
                            <View style={Styles.startingLoad}>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput style={Styles.amount2}
                                               placeholder={this.state.StartPrice+''}
                                               keyboardType='numeric'
                                               placeholderTextColor='#fd3546'
                                               underlineColorAndroid='transparent'
                                               onChangeText={(text) => {
                                                   this.state.StartPrice = text*1;
                                                   this.check();

                                               }}
                                    />
                                </View>
                            </View>
                            <BCText>(元)</BCText>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:px2dp(50)}}>
                            <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>起送量</BCText>
                            <View style={Styles.startingLoad}>
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput style={Styles.amount2}
                                               placeholder={this.state.StartQuantity+''}
                                               keyboardType='numeric'
                                               placeholderTextColor='#fd3546'
                                               underlineColorAndroid='transparent'
                                               onChangeText={(text) => {
                                                   this.state.StartQuantity = text*1;
                                                   this.check();

                                               }}
                                    />
                                </View>
                            </View>
                            <BCText>(件)</BCText>
                        </View>
                    </View>
                    <View>
                        <BCText style={[gs.c_fd3547,gs.fts_13,{marginLeft:px2dp(35)}]}>{this.state.errMsg}</BCText>
                    </View>
                </View>
                <View style={{marginTop:px2dp(10),backgroundColor: '#fff'}}>
                    <View style={{flexDirection:'row',marginLeft:px2dp(10),marginTop:px2dp(12),paddingBottom:px2dp(12),borderBottomColor:'#eee',borderBottomWidth:1}}><BCImage source={require('../../../imgs/buhuo.png')}/><BCText style={{marginLeft:px2dp(5)}}>补货规则</BCText></View>
                    <View>
                    <View style={{position:'absolute',top:px2dp(12),left:px2dp(15)}}><BCText style={[gs.c_fd3547]}>*</BCText></View>
                    <View style={Styles.deliveryFee}>
                        <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>补货范围</BCText>
                        <View style={Styles.startingLoad}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput style={Styles.amount2}
                                           placeholder={this.state.ReplenishDistance+''}
                                           keyboardType='numeric'
                                           placeholderTextColor='#fd3546'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {
                                               this.state.ReplenishDistance = text*1;
                                               this.check1();

                                           }}
                                />
                            </View>
                        </View>
                        <BCText>(km)</BCText>
                    </View>
                    </View>
                    <View style={Styles.deliveryFee}>
                        <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>补货运费</BCText>
                        <View style={Styles.startingLoad}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput style={Styles.amount2}
                                           placeholder={this.state.ReplenishDeliveryAmount+''}
                                           keyboardType='numeric'
                                           placeholderTextColor='#fd3546'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {
                                               this.state.ReplenishDeliveryAmount = text*1;
                                               this.check1();

                                           }}
                                />
                            </View>
                        </View>
                        <BCText>(元)</BCText>
                    </View>
                    <View style={Styles.deliveryFee}>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>起送价</BCText>
                        <View style={Styles.startingLoad}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput style={Styles.amount2}
                                           placeholder={this.state.ReplenishStartPrice+''}
                                           keyboardType='numeric'
                                           placeholderTextColor='#fd3546'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {
                                               this.state.ReplenishStartPrice = text*1;
                                               this.check1();

                                           }}
                                />
                            </View>
                        </View>
                        <BCText>(元)</BCText>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:px2dp(20)}}>
                        <BCText style={[gs.fts_15, gs.c_3a3838,Styles.text]}>起送量</BCText>
                        <View style={Styles.startingLoad}>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput style={Styles.amount2}
                                           placeholder={this.state.ReplenishStartQuantity+''}
                                           keyboardType='numeric'
                                           placeholderTextColor='#fd3546'
                                           underlineColorAndroid='transparent'
                                           onChangeText={(text) => {
                                               this.state.ReplenishStartQuantity = text*1;
                                               this.check1();

                                           }}
                                />
                            </View>
                        </View>
                        <BCText>(件)</BCText>
                    </View>
                    </View>
                    <BCText style={[gs.c_fd3547,gs.fts_13,{marginLeft:px2dp(35)}]}>{this.state.errMsg1}</BCText>
                    <View style={[Styles.TopView]}>
                        <View style={{position:'absolute',top:px2dp(12),left:px2dp(15)}}><BCText style={[gs.c_fd3547]}>*</BCText></View>
                        <View style={[Styles.groupView]}>
                                <BCText style={[gs.fts_15, gs.c_3a3838]}>补货加价比 :</BCText>
                                <BCText style={[gs.fts_15, gs.c_00C164]}>{this.state.ReplenishAddRate}</BCText>
                                <BCText style={[gs.fts_15, gs.c_00C164]}>%</BCText>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: px2dp(10),
                            height: px2dp(40),
                            justifyContent: 'space-around'
                        }}>
                            <BCText style={[gs.fts_15, gs.c_00C164]}>100%</BCText>
                            <View>
                                <ProgressBars
                                    ref={(c) => {
                                        if (c != null) {
                                            this._ProgressBar = (c);
                                        }
                                    }}
                                left  = {(this.state.ReplenishAddRate - 100)*(barWidth - CIRCLE_SIZE - px2dp(36)) / 100}
                            />
                            </View>
                            <BCText style={[gs.fts_15, gs.c_00C164]}>200%</BCText>
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    content() {
        return (
            <View style={[Styles.main, gs.bgc_fff,]}>
                {this.renderItems()}
            </View>
        )
    }
            // {/*<View style={[Styles.main, gs.bgc_fff,]}>*/}
            //     {/*<View style={Styles.deliveryFee}>*/}
            //         {/*<BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(20)}]}>起送量:</BCText>*/}
            //         {/*<View style={Styles.startingLoad}>*/}
            //             {/*<View style={{flexDirection: 'row'}}>*/}
            //                 {/*<TextInput style={Styles.amount2}*/}
            //                            {/*placeholder={''+this.StartQuantity}*/}
            //                            {/*keyboardType='numeric'*/}
            //                            {/*placeholderTextColor='#3a3838'*/}
            //                            {/*underlineColorAndroid='transparent'*/}
            //                            {/*onChangeText={(text) => {*/}
            //                                {/*if (isNaN(text * 1)) {*/}
            //                                    {/*toastShort('请输入正确的数字');*/}
            //                                    {/*this.ErrorText = true;*/}
            //                                    {/*return false;*/}
            //                                {/*}else {*/}
            //                                    {/*this.setState({isShowBottom:true});*/}
            //                                    {/*this.StartQuantity = text * 1;*/}
            //                                    {/*this.ErrorText=false;*/}
            //                                {/*}*/}
            //                            {/*}}*/}
            //                 {/*/>*/}
            //             {/*</View>*/}
            //         {/*</View>*/}
            //     {/*</View>*/}
            //     {/*<View style={Styles.deliveryFee}>*/}
            //         {/*<BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(20)}]}>起送价:</BCText>*/}
            //         {/*<View style={Styles.startingLoad}>*/}
            //             {/*<View style={{flexDirection: 'row'}}>*/}
            //                 {/*<TextInput style={Styles.amount3}*/}
            //                            {/*placeholder={''+this.StartPrice}*/}
            //                            {/*placeholderTextColor='#3a3838'*/}
            //                            {/*keyboardType='numeric'*/}
            //                            {/*underlineColorAndroid='transparent'*/}
            //                            {/*onChangeText={(text) => {*/}
            //                                {/*if (isNaN(text * 1)) {*/}
            //                                    {/*toastShort('请输入正确的数字');*/}
            //                                    {/*this.ErrorText = true;*/}
            //                                    {/*return false;*/}
            //                                {/*}else{*/}
            //                                    {/*this.setState({isShowBottom:true});*/}
            //                                    {/*this.StartPrice = text * 1;*/}
            //                                    {/*this.ErrorText=false;*/}
            //                                {/*}*/}
            //                            {/*}}/>*/}
            //                 {/*<View style={Styles.textBackground}>*/}
            //                     {/*<BCText style={[gs.fts_13, gs.c_3a3838]}>元</BCText>*/}
            //                 {/*</View>*/}
            //             {/*</View>*/}
            //         {/*</View>*/}
            //     {/*</View>*/}
            //     {/*<View style={Styles.deliveryFee}>*/}
            //         {/*<BCText style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(35)}]}>运费:</BCText>*/}
            //         {/*<View style={Styles.startingLoad}>*/}
            //             {/*<View style={{flexDirection: 'row'}}>*/}
            //                 {/*<TextInput style={Styles.amount3}*/}
            //                            {/*placeholder={''+this.DeliveryAmount}*/}
            //                            {/*placeholderTextColor='#3a3838'*/}
            //                            {/*keyboardType='numeric'*/}
            //                            {/*underlineColorAndroid='transparent'*/}
            //                            {/*onChangeText={(text) => {*/}
            //                                {/*if (isNaN(text * 1)) {*/}
            //                                    {/*toastShort('请输入正确的数字');*/}
            //                                    {/*this.ErrorText = true;*/}
            //                                    {/*return false;*/}
            //                                {/*}else {*/}
            //                                    {/*this.setState({isShowBottom:true});*/}
            //                                    {/*this.DeliveryAmount = text * 1;*/}
            //                                    {/*this.ErrorText=false;*/}
            //                                {/*}*/}
            //                            {/*}}*/}
            //                 {/*/>*/}
            //                 {/*<View style={Styles.textBackground}>*/}
            //                     {/*<BCText style={[gs.fts_13, gs.c_3a3838]}>元</BCText>*/}
            //                 {/*</View>*/}
            //             {/*</View>*/}
            //         {/*</View>*/}
            //     {/*</View>*/}
            // {/*</View>*/}

    Bottom() {
        return (
            this.state.isShowBottom ? this.renderBottom() : null
        )
    }

    onSave() {
        let CompanyId = this.props.currentEmployee.CompanyId;
        let verify = true;
      if (verify) {
          var leftW = this._ProgressBar.state.style.left;
              if (leftW === 0) {
                  var ReplenishAddRate = 100;
              } else {
                  var ReplenishAddRate = parseInt(((leftW) / (barWidth - CIRCLE_SIZE - px2dp(36)) * 100) + 100);
              }
              if (ReplenishAddRate == '') {
                  toastShort('请设置补货加价比')
                  return false;
              } else {
                  fetchSetDeliver({
                      CompanyID: CompanyId,
                      StartPrice: this.state.StartPrice,
                      FreeDistance: this.state.FreeDistance*1000,
                      StartQuantity: this.state.StartQuantity,
                      DeliveryAmount: this.state.DeliveryAmount,
                      ReplenishStartPrice: this.state.ReplenishStartPrice,  //补货起送价
                      ReplenishDeliveryAmount: this.state.ReplenishDeliveryAmount,  //补货配送费
                      ReplenishStartQuantity: this.state.ReplenishStartQuantity,  //补货起送量
                      ReplenishDistance: this.state.ReplenishDistance*1000,  //补货配送范围
                      ReplenishAddRate: ReplenishAddRate  //补货加价比
                  }).then((ret) => {
                      if (ret.error) {
                          //toastShort('')
                      }
                      else {
                          toastShort('设置成功');
                          this.pop();
                      }
                  }).catch((e) => {

                  });
          }
      }
    }

    renderBottom() {
        return (
            <View style={Styles.footerWrap}>
                <BCTouchable
                    disabled = {this.state.errText}
                    onPress={() => this.onSave()
                } style={[Styles.confirmBtn,this.state.errText?gs.bgc_eee:gs.bgc_31ca96]}>
                    <BCText style={[gs.fts_15, gs.c_fff]}>保存</BCText>
                </BCTouchable>
            </View>
        )
    }

    WillMount() {
        let companyId = this.props.currentEmployee.CompanyId;
        const {dispatch} = this.props;
        dispatch(ActionDelivery(companyId));
        this.GlobalData = {};
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceDelivery.datas && nextProps.ReduceDelivery.datas !== this.props.ReduceDelivery.datas) {
            const {ReduceDelivery} = nextProps;
            let datas = ReduceDelivery.datas;
            this.setState({
            StartPrice : datas.StartPrice||0,
            StartQuantity : datas.StartQuantity||0,
            FreeDistance : datas.FreeDistance/1000||0,
            DeliveryAmount : datas.DeliveryAmount||0,
            ReplenishStartPrice : datas.ReplenishStartPrice||0, //补货起送价
            ReplenishDeliveryAmount : datas.ReplenishDeliveryAmount||0,// 补货配送费
            ReplenishStartQuantity : datas.ReplenishStartQuantity||0,  //补货起送量
            ReplenishDistance : datas.ReplenishDistance/1000||0, //补货配送范围
            ReplenishAddRate : datas.ReplenishAddRate||100,  //补货加价比
            IsReceived: true
            });
        }
    }

}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height: deviceHeight
    },
    groupView: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: px2dp(35),
        height: px2dp(36),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(25),
        paddingTop: px2dp(15),
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(90)
    },
    inputStyle: {
        margin: 0,
        padding: 0,
        width: px2dp(50),
        fontSize: px2dp(14)
    },
    startingLoad: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        width: px2dp(160),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        fontSize: px2dp(14),
        margin: 0,
        padding: 0,
        textAlign: 'center'
    },
    amount2: {
        color: '#fd3546',
        width: px2dp(160),
        height: px2dp(16),
        fontSize: px2dp(14),
        width: px2dp(50),
        borderBottomColor: '#fd3546',
        borderBottomWidth: 1,
        textAlign:'center',
        margin: 0,
        padding: 0,
        textAlign: 'center'
    },
    amount3: {
        width: px2dp(80),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        fontSize: px2dp(14),
        margin: 0,
        padding: 0,
        textAlign: 'right'
    },
    plenishWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textBackground: {
        width: px2dp(80),
        height: px2dp(23),
        backgroundColor: "#f5f5f5",
        justifyContent: 'center',
        paddingLeft: px2dp(10)
    },
    deliveryFee: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height:px2dp(36),
        borderBottomWidth: px2dp(1),
        borderBottomColor: '#f2f1ef',
        marginLeft:px2dp(35),
    },
    footerWrap: {
        width: deviceWidth,
        height: px2dp(61),
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmBtn: {
        width: px2dp(355),
        height: px2dp(45),
        borderRadius: px2dp(4),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2ad191'
    },
    showStyles: {
        width: deviceWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: px2dp(12),
        paddingHorizontal: px2dp(12)
    },
});

function mapStateToProps(store) {
    return {
        ReduceSetDeliver: store.ReduceSetDeliver,
        currentEmployee: store.ReduceEmployee.currentEmployee,
        ReduceDelivery: store.ReduceDelivery,
    }
}

const connectDeliveryFee = connect(mapStateToProps)(DeliveryFee);
connectDeliveryFee.navigationOptions = NavigationOptions;
export default connectDeliveryFee;
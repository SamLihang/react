/**
 * Created by Administrator on 2017/5/24. 卖家版商品详情
 */
import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    TimePickerAndroid,
    DatePickerAndroid,
    ToastAndroid,
    Button,
    Platform,
    DatePickerIOS,
    Modal,
} from "react-native";
import {
    BCText,
    BCTouchable,
    deviceHeight,
    deviceWidth,
    NavigationOptions,
    px2dp
} from "../../../BaseComponent";
import {PullViewComponent} from "../../PageComponent";
import gs from "../../../styles/MainStyles";
import {connect} from "react-redux";
import {ActionPromotionDetail} from "../../../actions/SellerPromotionAction";
import {toastShort} from '../../../utils/ToastUtil';
import {fetchAddPromotionProduct} from '../../../services/SellerPromotionServices';
import {toDecimal2} from '../../../utils/FormatUtil';


class DateTimePicker extends Component {

    static propTypes = {
        tempSelectedDate: React.PropTypes.string,
        index: React.PropTypes.number,
        onDateTimeChanged:React.PropTypes.func
    }


    constructor(props) {
        super(props);
        this.state = {
            tempSelectedDate: new Date(),
            selectedDateTime: this.props.dateTime?new Date(parseInt(this.props.dateTime.replace("/Date(", "").replace(")/", ""), 10)):new Date(),
            index: props.index,
            onDateTimeChanged: null,
            newDateTime: this.props.dateTime? true:false,
        };
    }
    async showDateTimePicker() {
        try {
            let openDatePickerOptions= {
                year: this.state.selectedDateTime.getFullYear(),
                month: this.state.selectedDateTime.getMonth(),
                day: this.state.selectedDateTime.getDay(),
                minDate: new Date(),
            }
            const {action, year, month, day} = await DatePickerAndroid.open(openDatePickerOptions);
            if (action === DatePickerAndroid.dismissedAction) {
                toastShort('选择器关闭取消')
            } else {
                let tempDate=this.state.tempSelectedDate ? this.state.tempSelectedDate: new Date();
                tempDate.setYear(year);
                tempDate.setMonth(month);
                tempDate.setDate(day);
                //暂存选择的日期
                this.setState({tempSelectedDate:tempDate})
                try {
                    let openTimePickerOptions={
                        hour: this.state.selectedDateTime.getHours(),
                        minute: this.state.selectedDateTime.getMinutes(),
                        is24Hour:true,
                    };
                    var newTime = {};
                    let tempDateTime=this.state.tempSelectedDate;
                    const {action, minute, hour} = await TimePickerAndroid.open(openTimePickerOptions);
                    if (newTime === TimePickerAndroid.dismissedAction) {
                        newTime['chooseTime'] = '选择时间';
                        toastShort('选择器关闭取消');
                    } else if (action === TimePickerAndroid.timeSetAction) {
                        tempDateTime.setHours(hour);
                        tempDateTime.setMinutes(minute);
                        this.setState({selectedDateTime : tempDateTime,newDateTime:true});
                        this.props.onDateTimeChanged(tempDateTime,this.state.index);
                        if(this.formatDateTime(this.state.selectedDateTime)){
                            toastShort('选择的日期为'+this.formatDateTime(this.state.selectedDateTime));
                        }
                    }
                } catch ({code, message}) {
                    toastShort('发生错误了！')
                }
            }
        } catch ({code, message}) {
            toastShort('发生错误啦！')
            //console.log(message)
        };
    }

    formatDateTime=(val)=> {
        if (val != null) {
           return `${val.getFullYear()}-${val.getMonth()+1}-${val.getDate()} ${val.getHours()>9?val.getHours():'0'+val.getHours()}:${val.getMinutes()>9?val.getMinutes():'0'+val.getMinutes()}`;
        }else{
            return "请选择时间";
        }
    }
    render() {
        return (
            <View>
                <TouchableHighlight
                    underlayColor="#a5a5a5"
                    onPress={this.showDateTimePicker.bind(this)}>
                    <Text style={!this.state.newDateTime ? [gs.c_666]:[gs.c_31ca96]}>
                        {this.state.newDateTime ? this.formatDateTime(this.state.selectedDateTime) : '请选择时间'}</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

class PromotionDetails extends PullViewComponent {
    _Product=[];
    constructor(props) {
        super(props)
        this.state={
            LimitCount:null,
            PromotionPrice:null,
            changeOver:false,
            DatePickerIosShow:false,
            DateTime: new Date(),
            isModal:false,
        }
    }
    onRequestClose() {
        this.setState({
            isModal:false
        });
    }
    //设置页面标题
    setTitle() {
        return "编辑促销详情"
    }
    dropLine(product){
        let Specs=product.Specs;
        return (
            <View>
                {Specs.map((item,index)=>this.renderDrawSpecs(item,index,Specs))}
            </View>
        )
    };
    change(){
        this.setState({
            changeOver:false,
        })
    }

    renderDrawSpecs(item,index,specs){
        item.LimitCount = item.LimitCount === 0 ? null : item.LimitCount;
        item.PromotionPrice = item.PromotionPrice === 0 ? null : item.PromotionPrice;
        if(this._Product.length<specs.length){
            this._Product.push({SpecId:specs[index].SpecId,LimitCount:item.LimitCount,PromotionPrice:item.PromotionPrice})
        }
        return(
            <View key={index} style={[Styles.lineWhole]}>
                <View style={[Styles.lineLeft]}>
                    <View style={[gs.bgc_31ca96,Styles.down]}>
                        <BCText style={[gs.fts_10,gs.c_fff]}>促</BCText>
                    </View>
                    <View style={[Styles.rowContent]}>
                        <BCText style={{width:px2dp(140),fontSize:px2dp(16),color:'#666'}}>{'规格：'+item.SpecName}</BCText>
                        <View style={[Styles.rowLine]}>
                            <BCText style={[gs.fts_16,gs.c_666]}>限购：</BCText>
                            <View style={[Styles.inputOutLeft,this._Product[index].LimitCount == null ? gs.bgc_ccc : gs.bgc_31ca96]}>
                                <TextInput
                                    padding={0}
                                    maxLength={3}
                                    placeholder=""
                                    selectTextOnFocus={true}
                                    underlineColorAndroid='transparent'
                                    defaultValue={item.LimitCount?(item.LimitCount).toString():null}
                                    keyboardType="numeric"
                                    placeholderTextColor="#fff"
                                    style={{textAlign:'center', width: px2dp(30), color:'#fff'}}
                                    onChangeText={(text) => {
                                        if(text.length===0){
                                            this.state.LimitCount=null;
                                        }else {
                                            this.state.LimitCount=text;
                                            if(isNaN(text*1)){
                                                toastShort('请输入正确的数字哦~');
                                            }
                                        }
                                        this._Product[index].LimitCount=this.state.LimitCount;
                                        this.change();
                                    }}
                                    onEndEditing={(text)=>{
                                        if(this.state.LimitCount == 0 ){
                                            toastShort('限购数量不能为 0 哦~');
                                        }else if(this.state.LimitCount <0){
                                            toastShort('限购数量不能小于 0 哦~')
                                        }
                                    }}
                                />
                                <BCText style={[gs.c_fff,gs.fts_16]}>{item.DisplayUnit}</BCText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[Styles.rowContent,Styles.rowRight]}>
                    <BCText style={{fontSize:px2dp(16),color:'#666'}}>{'零售价：'+item.Price+'元/'+item.Unit}</BCText>
                    <View style={[Styles.rowLine]}>
                        <BCText style={[gs.fts_16,gs.c_666]}>促销价：</BCText>
                        <View style={[Styles.inputOutRight,this._Product[index].PromotionPrice == null ? gs.bgc_ccc : gs.bgc_31ca96]}>
                            <TextInput
                                maxLength={6}
                                padding={0}
                                selectTextOnFocus={true}
                                placeholder=""
                                underlineColorAndroid='transparent'
                                defaultValue={item.PromotionPrice?(item.PromotionPrice).toString():null}
                                keyboardType="numeric"
                                placeholderTextColor="#fff"
                                style={{textAlign:'center', width: px2dp(30), color:'#fff'}}
                                onChangeText={(text) => {
                                    if(text.length===0){
                                        this.state.PromotionPrice=null;
                                    }else {
                                        this.state.PromotionPrice=text;
                                        if(isNaN(text*1)){
                                            toastShort('请输入正确的数字哦~');
                                        }
                                    }
                                    this._Product[index].PromotionPrice=this.state.PromotionPrice;
                                    this.change();
                                }}
                                onEndEditing={()=>{
                                    if(this.state.PromotionPrice>item.Price){
                                        this.setState({overPrice:true});
                                        toastShort('促销价不能高于零售价哦~');
                                    }else if(this.state.PromotionPrice == 0){
                                        toastShort('促销价不能为 0 哦~');
                                    }else if(this.state.PromotionPrice <0){
                                        toastShort('促销价不能小于 0 哦~');
                                    }
                                }}
                            />
                            <BCText style={[,gs.fts_16,gs.c_fff]}>{'元/'+item.Unit}</BCText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    onPromotionTimeChanged =(text,index)=> {
       if(index==0){
           this.setState({PromotionBegin:text});
       }else{
           this.setState({PromotionEnd:text});
       }
    }

    renderDatetimePickerAndriod(index,dateTime) {
        return (
            <View style={[Styles.rowleft]}>
                <DateTimePicker
                    dateTime={dateTime}
                    onDateTimeChanged={this.onPromotionTimeChanged}
                    index={index}
                    selectedDateTime={index == 0 ? this.state.PromotionBegin : this.state.PromotionEnd}></DateTimePicker>
            </View>
        )
    }

    formatDateTime=(val)=> {
        if (val != null) {
            return `${val.getFullYear()}-${val.getMonth()+1}-${val.getDate()} ${val.getHours()>9?val.getHours():'0'+val.getHours()}:${val.getMinutes()>9?val.getMinutes():'0'+val.getMinutes()}`;
        }else{
            return "请选择时间";
        }
    }

    datepickerIos(index,dateTime){
        if(typeof dateTime == 'string'){
            dateTime =new Date(parseInt(dateTime.replace('/Date(','').replace(')/','')));
        }else if(!dateTime){
            dateTime = new Date();
        }
        return(
            <BCTouchable onPress={()=>{this.setState({DatePickerIosShow:index,DateTime:dateTime,isModal:true})}}>
                <Text style={this.formatDateTime(dateTime) == this.formatDateTime(new Date()) ? [gs.c_666]:[gs.c_31ca96]}>
                    {this.formatDateTime(dateTime) == this.formatDateTime(new Date()) ? '请选择时间' : this.formatDateTime(dateTime)}</Text>
            </BCTouchable>
        )
    }

    _timeChange(Datetime){
        this.setState({
            DatePickerIosShow:false,
            isModal:false
        })
    }

    changeTime(DateTime){
        this.setState({
            DateTime:DateTime,
        })
        if(this.state.DatePickerIosShow == 1){
            this.setState({
                PromotionBegin:DateTime
            })
        }else if(this.state.DatePickerIosShow == 2){
            this.setState({
                PromotionEnd:DateTime
            })
        }
    }

    content() {
        const ReduceSellerPromotionDetail = this.props.ReduceSellerPromotionDetail;
        let datas = ReduceSellerPromotionDetail.datas;
        let product = datas[0];
        return (
            <View style={[Styles.mainStyle, gs.bgc_f2f1ef]}>
                <View style={[Styles.productName]}>
                    <View style={[Styles.headHalf]}>
                        <BCText style={[gs.fts_16,gs.c_3a3838]}>商品名称:</BCText>
                    </View>
                    <View style={[Styles.headHalf,gs.bgc_fff]}>
                        <BCText style={[gs.c_3a3838,gs.fts_16]}>{product.ProductName}</BCText>
                    </View>
                </View>
                <View style={[Styles.time, gs.bgc_fff]}>
                    <View style={[Styles.rowCenter]}>
                        <BCText style={[]}>开始时间：</BCText>
                        <View style={{width:px2dp(130)}}>
                            {Platform.OS === 'android' ? this.renderDatetimePickerAndriod(0,this.state.PromotionBegin):this.datepickerIos(1,this.state.PromotionBegin)}
                        </View>
                    </View>
                    <View style={[Styles.rowCenter]}>
                        <BCText style={[]}>结束时间：</BCText>
                        <View style={{width:px2dp(130)}}>
                            {Platform.OS === 'android'? this.renderDatetimePickerAndriod(1,this.state.PromotionEnd):this.datepickerIos(2,this.state.PromotionEnd)}
                        </View>
                    </View>
                </View>
                <View style={[gs.bgc_fff]}>
                    {this.dropLine(product)}
                </View>
                <Modal
                    animationType='fade'           // 淡入
                    transparent={true}             // 不透明
                    visible={this.state.isModal}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestClose()}}  // android必须实现
                >
                    <View style={[Styles.modalBack]}>
                                <DatePickerIOS
                                    mode={"datetime"}
                                    minimumDate={new Date()}
                                    date={this.state.DateTime}
                                    onDateChange={(DateTime)=>{this.changeTime(DateTime)}}
                                    style={Styles.datepickerIos}
                                />
                                <BCTouchable
                                    style={[Styles.rowCenter,Styles.checkTime]}
                                    onPress={()=>{this._timeChange(this.state.DateTime)}}>
                                    <BCText style={[gs.fts_16]}>确认时间</BCText>
                                </BCTouchable>
                    </View>
                </Modal>
            </View>

        )
    }
    onpress(ProducGlobalId,Specs){
        let PromotionBegin,PromotionEnd;
        this.state.PromotionBegin == null?this.state.PromotionBegin:new Date();
        this.state.PromotionEnd == null?this.state.PromotionEnd:new Date();
        if(typeof this.state.PromotionBegin == 'string'){
            PromotionBegin = this.state.PromotionBegin.replace('/Date(', '').replace(')/', '');
        }else {
            PromotionBegin = this.state.PromotionBegin ? this.state.PromotionBegin.getTime() : new Date().getTime();
        }
        if(typeof  this.state.PromotionEnd == 'string'){
            PromotionEnd = this.state.PromotionEnd.replace('/Date(', '').replace(')/', '');
        }else {
            PromotionEnd = this.state.PromotionEnd ? this.state.PromotionEnd.getTime() : new Date().getTime();
        }
        if(this.state.PromotionBegin == null || this.state.PromotionEnd == null){
            if(this.state.PromotionBegin == null){
                toastShort('请添加开始时间哦~');
                return;
            }else if(this.state.PromotionEnd == null){
                toastShort('请添加结束时间哦');
                return;
            }
        }else if(PromotionEnd<=PromotionBegin){
            toastShort('结束时间必须大于开始时间哦~');
            return;
        }
        for(var i=0;i<this._Product.length;i++) {
            if (this._Product[i].LimitCount == null && this._Product[i].PromotionPrice !== null) {
                toastShort('请完善限购数量哦 ~');
                return;
            } else if (this._Product[i].LimitCount !== null && this._Product[i].PromotionPrice == null) {
                toastShort('请完善促销价哦 ~');
                return;
            } else if (isNaN(this._Product[i].LimitCount*1)){
                toastShort('请输入正确的数字哦~');
                return;
            } else if (this._Product[i].LimitCount%1!==0){
                toastShort('限购数量必须为整数哦~');
                return;
            } else if (isNaN(this._Product[i].PromotionPrice*1)){
                toastShort('请输入正确的数字哦~');
                return;
            } else if (this._Product[i].PromotionPrice >= Specs[i].Price){
                toastShort('促销价必须小于零售价哦~');
                return;
            }else if (this._Product[i].LimitCount !== null && this._Product[i].PromotionPrice !== null){
                this.state.changeOver=true;
            }
        }
        if(!this.state.changeOver){
            toastShort('请完善信息哦~');
            return;
        }

        PromotionBegin=new Date(parseInt(PromotionBegin,10));
        PromotionEnd=new Date(parseInt(PromotionEnd,10));
        fetchAddPromotionProduct({
            ProductGlobalId: ProducGlobalId,
            PromotionBegin: PromotionBegin,
            PromotionEnd: PromotionEnd,
            Specs: this._Product
        }).then(() => {

            this.push('SalesPromotion',{ pageFrom:'PromotionDetail', isPromotion:true})
            this.params.finishEdit();
        }).catch((e) => {
            toastShort(JSON.stringify(e))
        })
    }
    Bottom(){
        const ReduceSellerPromotionDetail = this.props.ReduceSellerPromotionDetail;
        let datas = ReduceSellerPromotionDetail.datas;
        let product = datas[0];
        let ProducGlobalId = product.ProductGlobalId;
        return(
            <Bottom
                product={product}
                PromotionBegin={this.state.PromotionBegin}
                PromotionEnd={this.state.PromotionEnd}
                onPress={()=>{this.onpress(ProducGlobalId,product.Specs)}}
            >
            </Bottom>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const {ProductId} = this.params;
        dispatch(ActionPromotionDetail(ProductId))
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerPromotionDetail.datas != null && nextProps.ReduceSellerPromotionDetail.datas != this.props.ReduceSellerPromotionDetail.datas) {
           let PromotionDetail = nextProps.ReduceSellerPromotionDetail.datas;
            this.setState({
                IsReceived: true,
                PromotionBegin: PromotionDetail[0].PromotionBegin,
                PromotionEnd: PromotionDetail[0].PromotionEnd,
            });
        }

    }
}
class Bottom extends Component {
    render(){
        return(
            <View>
            <BCTouchable onPress={this.props.onPress} style={[Styles.footer,gs.bgc_31ca96]}>
                    <BCText style={[gs.fts_18, gs.c_fff]}>完成</BCText>
            </BCTouchable>
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    mainStyle: {
        height: deviceHeight-px2dp(65),
    },
    productName: {
        width: deviceWidth,
        flexDirection:'row',
        justifyContent: 'center',
        height: px2dp(36),
    },
    headHalf:{
        width:deviceWidth/2,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    time:{
        width:deviceWidth,
        height:px2dp(60),
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    rowLine:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:px2dp(10),
        marginBottom:px2dp(10),
    },
    lineWhole:{
        width:deviceWidth,
        height: px2dp(75),
        flexDirection:'row',
        flexWrap:'nowrap',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth: px2dp(1),
        borderColor: '#eee',
    },
    down:{
        width: px2dp(15),
        height: px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px2dp(3),
        marginLeft: px2dp(6.5),
        marginBottom: px2dp(35),
    },
    lineLeft:{
        marginLeft: px2dp(50),
        width:px2dp(100),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    rowContent:{
        marginTop:px2dp(10),
        marginLeft:px2dp(10),
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'flex-start',
    },
    rowRight:{
        marginRight:px2dp(30),
    },
    inputOutLeft:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:px2dp(50),
        borderRadius:px2dp(3),
    },
    inputOutRight:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:px2dp(80),
        borderRadius:px2dp(3),
    },
    inputStyle:{
        textAlign:'center',
        width: px2dp(30),
        color:'#fff',
    },
    rowCenter: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    rowStart:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginLeft:px2dp(50)
    },
    footer:{
        width: '100%',
        height: px2dp(45),
        position: 'absolute',
        bottom: 0,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    datePickerContainer:{
        borderRadius: px2dp(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: px2dp(10),
    },
    modalBack:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)',
        flexDirection:'column',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    datepickerIos:{
        width:'90%',
        borderRadius:px2dp(5),
        backgroundColor:'#fff'
    },
    checkTime:{
        width:'90%',
        borderRadius:px2dp(5),
        backgroundColor:'#fff',
        height:px2dp(45),
        marginTop:px2dp(10),
        marginBottom:px2dp(5)
    },
    rowleft:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    }
})

function mapStateToProps(store) {
    return {
        ReduceSellerPromotionDetail: store.ReduceSellerPromotionDetail
    }
}
const connectPromotionDetails = connect(mapStateToProps)(PromotionDetails);
connectPromotionDetails.navigationOptions = NavigationOptions;
export default connectPromotionDetails;
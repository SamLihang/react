/**
 * Created by Administrator on 2017/11/1.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
    TextInput,
    ScrollView,
    ListView,
} from 'react-native';

import BaseComponent, {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions
} from '../../../BaseComponent';
import PageComponent, {PullViewComponent, PullListComponent} from '../../PageComponent'
import {connect} from 'react-redux';
import {toastShort} from '../../../utils/ToastUtil';
import {ActionEditDetail} from '../../../actions/SellerProductAction';
import {fetchUpdateProductDetail} from '../../../services/SellerProductServices'
import gs from '../../../styles/MainStyles';
import {toDecimal2} from '../../../utils/FormatUtil';
import CheckBox from "../../../components/CheckBox";

class SpecItem extends  Component{
    constructor(props) {
        super(props)
        this.state = {
            IsSelect: props.IsSelect,
            index:props.index,
            item:props.item,
            Price:0,
        }
    }
    static propTypes = {
        IsSelect: React.PropTypes.bool,
        OnChange: React.PropTypes.func,
        item: React.PropTypes.object,
    };
    static defaultProps = {
        item: {},
    };

    OnChange(isSelect) {
        this.setState({IsSelect: isSelect})
    }
    _onPress(text,isSelect,SpecId) {
        this.setState({IsSelect: isSelect}, () => {
            this.props.OnChange(text,isSelect,SpecId);
        })
    }

    render(){
        let  item=this.state.item;
        this.state.Price=item.Price;
        // this.state.isSelect=item.IsSelect;
        return(
            <View
                key={this.state.index}
                style={[styles.listItem,{height:px2dp(78),flexDirection:'row',alignItems:'center',borderBottomColor:'#eee',borderBottomWidth:Platform.OS==='ios'?0:px2dp(1)},gs.bgc_fff,
                    this.state.index%2=== 0 ?  {backgroundColor:'#eee'}:gs.bgc_fff
                ]}>
                <CheckBox
                    IsSelect={this.state.IsSelect}
                    ref={(c) => {
                        this._CheckBox = c
                    }}
                    OnChange={(isSelect) => {
                        this._onPress(this.state.Price,isSelect,item.SpecId)
                    }}
                />
                <View style={{flexDirection:'column',paddingTop:px2dp(12),paddingBottom:px2dp(12)}}>
                    <BCText style={{fontSize:px2dp(16),color:'#666'}}>规格:{item.SpecName}</BCText>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:Platform.OS=='ios'?px2dp(10):0,}}>
                        <BCText style={{fontSize:px2dp(16),color:'#666',}}>单价:</BCText>
                        <TextInput
                                   style={{width:px2dp(58),textAlign:'center',paddingTop:0,paddingBottom:0,fontSize:px2dp(15),color:'#666',
                                            borderBottomColor:'#666',borderBottomWidth:px2dp(1)
                                   }}
                                   placeholderTextColor='#666'
                                   keyboardType='numeric'
                                   maxLength={6}
                                   underlineColorAndroid='transparent'
                                   onChangeText={(text) => {
                                       this.state.Price=text;
                                       this.props.OnChangeText(text, item.SpecId,this.state.IsSelect)
                                   }}
                                   onEndEditing={(text) => {
                                       this.props.OnEndEditing(text)
                                   }}
                                   defaultValue={toDecimal2(this.state.Price)}
                        />
                        {Platform.OS=='ios'?<View style={{width:px2dp(58),height:px2dp(1),backgroundColor:'#000',position:'absolute',bottom:0,left:px2dp(38)}}/>:<View/>}
                        <BCText style={{fontSize:px2dp(16),color:'#666',}}>元/{item.Unit}</BCText>
                    </View>
                </View>
                {Platform.OS=='ios'?<View style={{width:deviceHeight,height:px2dp(1),backgroundColor:'#eee',position:'absolute',bottom:0,left:0}}/>:<View/>}
            </View>
        )
    }
}


class EditProductInformation extends PageComponent {

    static propTypes = {
        product: React.PropTypes.object,
        OnSelect: React.PropTypes.func,
        Price:React.PropTypes.number,
    }

    constructor(props) {
        super(props);
        this.state = {
            isReplenish:false,
            IsSelect: false,
            Price:0,
            sendData:[],
            SpecId:0,
        };
    }


    //设置页面标题
    setTitle() {
        return "编辑商品信息"
    }
    onBack(){
        // if(this.params.pageForm){
        //     this.push("SellerIndex")
        // }
    }


    onSubmit(){
        let IsReplenish=this.state.isReplenish?1:0;
        let ProductGlobalId=this.state.product[0].ProductGlobalId;
        let sendData=[];
        this.state.sendData.map((item)=>{
            sendData.push({SpecId:item.SpecId,Price:toDecimal2(item.Price)});
        });
        let objStr = {
            IsReplenish: IsReplenish,
            productGlobalId: ProductGlobalId,
            productSpecPriceStrs: JSON.stringify({Items: sendData})
        };
        for (let i=0;i<sendData.length;i++){
            if(sendData[i].Price<0){
                toastShort("单价不能为负数")
                return false;
            }else if(sendData[i].Price>9999){
                toastShort("单价不能大于9999")
                return false;
            }else if(isNaN(sendData[i].Price)){
               toastShort("请输入正确的数字")
                return false;
            }
        }
        fetchUpdateProductDetail(objStr).then((ret)=>{
            if (ret.data==null){
                this.params.onBack();
                this.navigation.goBack();
                toastShort('保存成功')
            }
        }).catch((e)=>{
            // console.log(e);
        });

    }

    renderItem(){
        let Product=this.state.product[0]
        // this.state.isReplenish=Product.IsReplenish==0?true:false;
        return(
            <View style={{width:deviceWidth,height:deviceHeight,backgroundColor:'#fff',flex:1,}}>
                <View style={{width:'100%',height:px2dp(45),backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between',}}>
                    <View style={{width:'50%',height:'100%',backgroundColor:'#eee',justifyContent:'center',alignItems:'center',}}><BCText style={{textAlign :'center',textAlignVertical:'center',fontSize:px2dp(16),color:'#333',}}>商品名称:</BCText></View>
                    <View style={{width:'50%',height:'100%',justifyContent:'center',alignItems:'center',}}><BCText style={{textAlign :'center',textAlignVertical:'center',fontSize:px2dp(16),color:'#333'}}>{Product.ProductName}</BCText></View>
                </View>

                <View style={{height:px2dp(45),backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <CheckBox
                        IsSelect={this.state.isReplenish}
                        ref="buHuo"
                        OnChange={(isReplenish) => {
                            this.setState({
                                isReplenish: isReplenish
                            }, () => {
                                // this.props.OnSelect(isSelect, product.ProductId)
                            })
                        }}
                    />
                    <BCText style={{fontSize:px2dp(16),color:'#333'}}>参与补货?</BCText>
                </View>

                <ScrollView style={{flex:1,height:px2dp(180)}}>
                    {/*<ScrollView showsHorizontalScrollIndicator={false}>*/}
                        {Product.Spec.map((item,index)=>{
                            this.state.IsSelect=item.IsSelect;

                            this.state.sendData.length==Product.Spec.length?null:
                            this.state.sendData.push(
                                {IsSelect:item.IsSelect,
                                Price:item.Price,
                                SpecId:item.SpecId,}
                            )

                            return(
                                <SpecItem key={item.SpecId}
                                          item={item}
                                          IsSelect={this.state.IsSelect}
                                          index={index}
                                          OnChange={(text,IsSelect,SpecId)=>{
                                              for (let i=0;i<Product.Spec.length;i++){
                                                  if(SpecId==this.state.sendData[i].SpecId){
                                                      let index=i;
                                                      this.state.sendData[index].IsSelect=IsSelect;
                                                      this.state.sendData[index].Price=toDecimal2(IsSelect?text:0);
                                                  }
                                              }
                                          }}
                                          OnChangeText={(text,SpecId,IsSelect)=>{
                                              for (let i=0;i<Product.Spec.length;i++){
                                                  if(SpecId==this.state.sendData[i].SpecId){
                                                      let index=i;
                                                      this.state.sendData[index].IsSelect=IsSelect;
                                                      this.state.sendData[index].Price=IsSelect?text:0;
                                                  }
                                              }
                                          }}
                                          OnEndEditing={(text)=>{

                                          }}

                                />
                            )
                        })}
                        <View style={{width:'100%',height:px2dp(120)}}></View>
                    {/*</ScrollView>*/}
                </ScrollView>

            </View>
        )
    }
    renderBottom(){
        return(
            <View style={{width:deviceWidth,height:px2dp(45),backgroundColor:'#31ca96',position:'absolute',bottom:0,alignItems:'center',justifyContent:'center'}}>
                <BCTouchable style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                    onPress={()=>{
                        // this.props.refs.TextInput.onBlur()
                        this.onSubmit();
                        return false;
                    }}
                >
                    <BCText style={{fontSize:px2dp(18),color:'#fff',}}>保存</BCText>
                </BCTouchable>
            </View>
        )
    }
    content(){
        return(
            <View style={{flex:1,}}>
                {this.renderItem()}
                {this.renderBottom()}
            </View>
        )
    }


    WillMount() {
        const {dispatch} = this.props;
        const productGlobalId = this.params.productGlobalId;
        dispatch(ActionEditDetail(productGlobalId));
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceEditDetail.datas != null && nextProps.ReduceEditDetail.datas != this.props.ReduceEditDetail.datas) {
            const product = nextProps.ReduceEditDetail.datas;
            this.setState({
                product: product,
                isReplenish: product[0].IsReplenish==1?true:false,
                IsReceived: true,
            });
        }
    }
}

const styles = StyleSheet.create({
    listItem: {
        flex:1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingRight: px2dp(12),
        paddingTop: px2dp(12),
        paddingBottom: px2dp(12),
    },
    scrollViewContainer:{
        flex:1,
        // height:deviceHeight-px2dp(300),
        // paddingBottom:px2dp(500),
    }
})

function mapStateToProps(store) {
    return {
        ReduceEditDetail:store.ReduceEditDetail,
    }
}
const connectEditProductInformation = connect(mapStateToProps)(EditProductInformation);
connectEditProductInformation.navigationOptions = NavigationOptions;
export default connectEditProductInformation;
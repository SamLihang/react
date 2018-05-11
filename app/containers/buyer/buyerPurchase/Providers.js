/**
 * Created by sencha on 2017/3/31.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, Platform, ScrollView} from 'react-native';
import {PullViewComponent} from '../../PageComponent'
import {
    px2dp,
    deviceWidth,
    deviceHeight,
    substr,
    BCText,
    BCImage,
    BCTouchable,
    NavigationOptions,
    BCHostImage
} from '../../../BaseComponent';
import gs from '../../../styles/MainStyles';
import {toastLong} from '../../../utils/ToastUtil';
import {toDecimal2} from '../../../utils/FormatUtil';
import {ActionProviders} from '../../../actions/ProviderAction';

let searchText=null;
class Providers extends PullViewComponent {
    constructor(props) {
        super(props)
        this.state = {
            awayProviders: [],
            comProviders: [],
            inputKey:null
        }
    }

    setTitle() {
        return "供应商";
    }

    //设置页面标题
    setInputPlaceHolder() {
        return "请输入供应商名称";
    }

    //是否显示搜索框
    isShowSearchBar() {
        return true;
    }

    //是否使用新页面进行搜索
    setIsNewPageSearch() {
        return false;
    }

    //点击搜索
    goSearch() {
        // this.push('SearchPageProducts', {
        //     productType: -1,
        //     callBack: this.refeshView.bind(this)
        // })
        //直接在本页面 搜索

    }
    onBack(){
       this.pop();
       // this.push('BuyerIndex')
    }

    onChangeText(text)
    {
        this.state.inputKey=text;
       // alert(text);
        const {dispatch} = this.props;
        dispatch(ActionProviders(text));


    }


    //是否使用新页面进行搜索
    setIsNewPageSearch() {
        return false;
    }

    renderTitle(title) {
        return (
            <View style={[Scontent.title]}>
                <BCImage source={require('../../../imgs/strip.png')}></BCImage>
                <BCText style={[gs.fts_14, gs.c_BaseColor, {marginLeft: px2dp(12)}]}>{title}</BCText>
            </View>
        )
    }

    renderCompany(provider, key, isCommand) {
        return (
            <BCTouchable key={key} style={[SCompany.item, gs.bgc_fff]}
                         onPress={() => {
                             if (isCommand) {
                                 this.push('ProductList', {bCompanyId: 0, sCompanyId: provider.SCompanyId,fromWhere:1})  // fromWhere 从哪个页面去ProductList  1;首页采购-Provider 2首页分类图片 3:首页搜索
                             } else {
                                 this.push('ProductList', {
                                     bCompanyId: provider.BCompanyId,
                                     sCompanyId: provider.SCompanyId,
                                     fromWhere:1,
                                 })
                             }
                         }}>
                <View style={SCompany.companyName}>
                    <BCText style={[gs.bold, gs.c_3a3838, gs.fts_16]}>{substr(provider.CompanyName, 20)}</BCText>
                </View>
                <View style={[SCompany.images]}>
                    {provider.ProductImages.map((image, index) => {
                        return <BCHostImage style={{height: px2dp(75), width: px2dp(113)}} key={index}
                                            source={{uri: image}}/>
                    })}
                </View>
                <View style={SCompany.mainTypes}>
                    <BCText style={[gs.c_888, gs.fts_14]}>主营:<BCText
                        style={gs.fts_14}>{provider.MainType}</BCText></BCText>
                </View>
                <View style={[SCompany.replenish, gs.bdc_e8e8e8]}>
                    <BCText style={[gs.fts_14, gs.c_888]}>{/*3公里内免费配送*/}</BCText>
                    <BCText
                        style={[gs.fts_14, gs.c_888, {justifyContent: 'flex-end'}]}>{toDecimal2(provider.Distance/1000)}公里</BCText>
                </View>
            </BCTouchable>
        )
    }

    content() {
        const awayProviders = this.state.awayProviders;
        const comProviders = this.state.comProviders;
        if (awayProviders.length <= 0 && comProviders.length <= 0) {
            return (
                <View style={[Scontent.main, gs.bgc_f2f1ef]}>
                    {
                        this.noRecord('暂时没有供应商记录喔～')
                    }
                </View>
            )
        } else {
            return (
                <View style={[Scontent.main, gs.bgc_f2f1ef]}>
                    {
                        awayProviders.length > 0 ?
                            this.renderTitle('常用供货商')
                            : null
                    }
                    {
                        awayProviders.map((provider, index) => {
                            return this.renderCompany(provider, index, false)
                        })
                    }
                    {
                        comProviders.length > 0 ?
                            this.renderTitle('推荐供货商') : null
                    }
                    {
                        comProviders.map((provider, index) => {
                            return this.renderCompany(provider, index, true)
                        })
                    }
                </View>
            )
        }
    }

    onRefresh() {
        const {dispatch} = this.props;
        dispatch(ActionProviders(this.state.inputKey));


    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionProviders(this.state.inputKey));
    }

    WillReceive(nextProps) {
                if (nextProps.ReduceProviders.datas != null && nextProps.ReduceProviders.datas !== this.props.ReduceProviders.datas) {
                    const datas = nextProps.ReduceProviders.datas;
                    this.setState({
                        IsReceived: true,
                        awayProviders: datas.awayProviders,
                        comProviders: datas.comProviders
                    })
        }

        this.reSetHeight(); //加载属性后 重置高度
    }
}

var Scontent = StyleSheet.create({
    main: {
        flex: 1,
        paddingBottom: px2dp(40),
        minHeight: deviceHeight + 1,
    },
    title: {
        height: px2dp(30),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(10)
    }
})
var SCompany = StyleSheet.create({
    item: {
        height: px2dp(188),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        marginBottom: px2dp(10)
    },
    companyName: {
        height: px2dp(42),
        //alignItems: 'center',
        width: px2dp(350),
        justifyContent: 'center',
        overflow: 'hidden'
    },
    images: {
        height: px2dp(75),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    mainTypes: {
        height: px2dp(35),
        //alignItems: 'center',
        justifyContent: 'center'
    },
    replenish: {
        borderTopWidth: 1,
        height: px2dp(35),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
})

function mapStateToProps(store) {
    return {
        ReduceProviders: store.ReduceProviders
    }
}

const connectProviders = connect(mapStateToProps)(Providers);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
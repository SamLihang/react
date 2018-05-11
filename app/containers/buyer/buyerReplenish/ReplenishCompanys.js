import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Platform} from 'react-native';
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
import {ActionLoadReplenish, ActionReplenishCompanys} from '../../../actions/ReplenishAction';

import Tab from '../../../components/Tab'

class ReplenishCompanys extends PullViewComponent {
    GlobalDatas = {
        Categorys: []
    }

    constructor(props) {
        super(props)
        this.state = {
            providers: [],
        }
    }

    setTitle() {
        return "补货供应商";
    }

    Top() {
        let categorys = this.GlobalDatas.Categorys;
        if (categorys.length) {
            return <Tab
                ref={(t) => {
                    this._Tab = t
                }}
                Style={1}
                Items={categorys}
                OnPress={(i, categoryId) => {
                    const {dispatch} = this.props;
                    this.GlobalDatas.CategoryId = categoryId;
                    //发送请求
                    this._Loading.Trigger(true);
                    dispatch(ActionReplenishCompanys(categoryId));
                }}/>
        }
    }

    renderCompany(provider, key) {
        return (
            <BCTouchable key={key} style={[SCompany.item, gs.bgc_fff]}
                         onPress={() => {
                             this.push('ReplenishProducts', {
                                 sCompanyId: provider.SCompanyId,
                                 bCompanyId: provider.BCompanyId
                             })
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
                        style={[gs.fts_14, gs.c_888, {justifyContent: 'flex-end'}]}>{toDecimal2(provider.ReplenishDistance / 1000)}公里</BCText>
                </View>
            </BCTouchable>
        )
    }

    onRefresh() {
        const {dispatch} = this.props;
        dispatch(ActionReplenishCompanys(this.GlobalDatas.CategoryId));
    }

    content() {
        const providers = this.state.providers;
        if (providers.length <= 0) {
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
                        providers.map((provider, index) => {
                            return this.renderCompany(provider, index)
                        })
                    }
                </View>
            )
        }
    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionLoadReplenish());
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceLoadReplenish.datas != null && nextProps.ReduceLoadReplenish.datas !== this.props.ReduceLoadReplenish.datas) {
            // console.log(nextProps.ReduceLoadReplenish.datas)
            const datas = nextProps.ReduceLoadReplenish.datas;
            this.GlobalDatas.Categorys = datas.Categorys;
            this.GlobalDatas.CategoryId = datas.Categorys[0].CategoryId;
            this.setState({
                IsReceived: true,
                providers: datas.Provider
            });
        }
        if (nextProps.ReduceReplenishCompanys.datas != null && nextProps.ReduceReplenishCompanys.datas !== this.props.ReduceReplenishCompanys.datas) {
            const datas = nextProps.ReduceReplenishCompanys.datas;
            this.setState({
                providers: datas.Provider
            })
            this._Loading.Trigger(false);
        }
    }
}

const Scontent = StyleSheet.create({
    main: {
        flex: 1,
        minHeight: deviceHeight + 1
    },
    title: {
        height: px2dp(30),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(10)
    }
});
const SCompany = StyleSheet.create({
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
});

function mapStateToProps(store) {
    return {
        ReduceLoadReplenish: store.ReduceLoadReplenish,
        ReduceReplenishCompanys: store.ReduceReplenishCompanys
    }
}

const connectProviders = connect(mapStateToProps)(ReplenishCompanys);
connectProviders.navigationOptions = NavigationOptions;
export default connectProviders;
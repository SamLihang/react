/**
 * Created by sencha on 2017/3/27.
 */
import React, {Component} from 'react';
import {
    View, StyleSheet, Text, ListView,
    ScrollView, ActivityIndicator, Dimensions, Alert,
    FlatList, RefreshControl, InteractionManager,
    Platform, BackHandler,BackAndroid,NativeAppEventEmitter,DeviceEventEmitter,
} from 'react-native';
import {SwRefreshScrollView, SwRefreshListView} from '../components/refresh';
import BCNavigator from '../components/BCNavigator';
import BaseComponent, {
    deviceHeight, deviceWidth, BCText, px2dp,px2dpH,
    BCTouchable, BCImage, removeEventListener,
    checkNetworkState, addEventListener, NOT_NETWORK, TAG_NETWORK_CHANGE
} from '../BaseComponent';
import gs from '../styles/MainStyles';
import {toastLong, toastShort} from '../utils/ToastUtil';
import JPushModule from 'jpush-react-native';

//操作
class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsLoading: false
        }
    }

    Trigger(state) {
        this.setState({
            IsLoading: state
        })
    }

    render() {
        if (this.state.IsLoading) {
            return (
                <View
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: px2dp(20),
                        height: px2dp(20),
                        marginLeft: px2dp(-10),
                        marginTop: px2dp(-10),
                        backgroundColor: '#ffffff'
                    }}
                >
                    <ActivityIndicator animating color='#ff0000'/>
                </View>
            )
        }
        else {
            return null
        }
    }
}

//遮罩
class Maks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IsShow: false
        }
    }

    Trigger(v) {
        this.setState({
            IsShow: v
        })
    }

    render() {
        return (
            this.state.IsShow ? (
                <View>
                    <View style={[Styles.maks, gs.bgc_000]}></View>
                </View>
            ) : (null)
        )
    }
}

export default class PageComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;
        this.state = {
            IsReceived: false,
            IsNetWork: undefined,
        };

        this.params = this.props.navigation ? this.props.navigation.state.params : null;
        addEventListener(TAG_NETWORK_CHANGE, this.handleMethod);
    }

    navigation = undefined;

    /*#region 组件*/
    _Loading = null;
    _Maks = null;
    /*#endregion*/
    lastBackPressed = null

    //设置页面标题
    setTitle() {
    }

    //是否显示页面标题的图片
    isShowImage() {
    }

    //是否显示返回
    isShowBack() {
    }

    //设置页面标题右边为图片时的地址
    rightType() {
        return ''
    }

    //是否显示搜索框
    isShowSearchBar() {
    }

    //点击搜索
    goSearch() {
    }

    //返回回调
    onBack() {
    }

    onChangeText(text)
    {

    }

    //设置页面标题的背景字
    setInputPlaceHolder() {

    }

    //是否使用新页面进行搜索
    setIsNewPageSearch() {
    }



    push(name, params) {
        const {navigation, currentEmployee} = this.props;
        let needLogin = (params && params.needLogin) || false;
        if (navigation) {
            if (needLogin && !currentEmployee.isLoggedIn) {
                navigation.navigate("Login", {loginInRoute: {name, params}});
                //this.navigation.dispatch({type:'Logout'});
            } else {
                navigation.navigate(name, params)
            }
        }

    }

    pop(routerName) {
        if (this.navigation) {
            this.props.navigation.goBack(routerName)
        }
    }

    onClickNavigationRight(isEdit) {
    }

    rightTitle() {
    }

    renderNavigator() {
        return (
            <BCNavigator navigation={this.props.navigation} title={this.setTitle()}
                         inputPlaceHolder={ this.setInputPlaceHolder()}
                         isNewPageSearch={ this.setIsNewPageSearch()}
                         backCallBack={this.onBack.bind(this)}
                         isShowBack={this.isShowBack()} isShowSearchBar={this.isShowSearchBar()}
                         goSearch={this.goSearch.bind(this)}
                         onChangeText={this.onChangeText.bind(this)}
                         rightTitle={this.rightTitle()}
                         RightType={this.rightType()}
                         isShowImage={this.isShowImage()}
                         onPressRight={(isEdit) => this.onClickNavigationRight(isEdit)}/>
        )
    }

    _loadTop() {
        if (this.state.IsReceived) {
            return this.Top();
        }
    }

    Top() {
    }

    _loadBotttom() {
        if (this.state.IsReceived) {
            return this.Bottom();
        }
    }

    Bottom() {
    }

    content() {
    }

    checkNetWork() {
        let self = this;
        setTimeout(function () {
            checkNetworkState((isConnected) => {
                if (!isConnected) {
                    self.setState({IsNetWork: false});
                    //toastLong(NOT_NETWORK);
                } else {
                    self.setState({IsNetWork: true});
                }
            });
        }, 100);
    }

    noRecord(text, bgc) {
        let imgSource = require('../imgs/Ordermanagement.png');
        let goBuy = 0;
        if(text == '暂时没有供应商记录喔～'){
            imgSource = require('../imgs/nullSupplier.png');
        }else if(text == '暂时没有您的订单记录喔～'){
            imgSource = require('../imgs/nullOrder.png');
        }else if(text == '暂时还没有物流信息喔～'){
            imgSource = require('../imgs/nullLogistics.png');
        }else if(text == '您还没有添加地址信息喔～'){
            imgSource = require('../imgs/nullAddress.png');
        }else if(text == '暂无数据' || text == '暂无商品'){
            imgSource = require('../imgs/nullAlwayBuy.png');
        }else if(text == null || !text){
            text = '怎么空空如也呢～';
            imgSource = require('../imgs/nullAlwayBuy.png');
        }
        if(this.navigation.state.routeName == 'BuyerIndex'){
            goBuy = 1;
        }
        return (
            <View style={[Styles.noContent, bgc ? bgc : gs.bgc_fff,]}>
                <View style={{justifyContent: "center", alignItems: "center", marginTop: px2dp(100)}}>
                    <BCImage style={[{maxWidth: '40%',maxHeight:'40%'}]}
                             source={imgSource}/>
                    <BCText style={[gs.fts_14, gs.c_31ca96, {marginTop: px2dp(30)}]}>{text}</BCText>
                    {goBuy?<View>
                        <BCTouchable style={{width:px2dp(150),height:px2dp(30),borderRadius:px2dp(5),backgroundColor:'#fd3546',marginTop:px2dp(20),justifyContent:'center',alignItems:'center'}}
                            onPress={()=>{this.push('ClassifyList',{categoryId:1,})
                        }}>
                            <BCText style={[gs.fts_16,gs.c_fff]}>去购买</BCText>
                        </BCTouchable>
                    </View>:null}
                </View>
            </View>
        )
    }

    noNetWork() {
        return (
            <View style={Styles.main}>
                {this.renderNavigator()}
                <BCTouchable style={Styles.noNetWork} onPress={() => {
                    this.checkNetWork()
                }}>
                    <BCText>网络连接失败，请刷新重试试</BCText>
                </BCTouchable>
            </View>
        )
    }

    maksContent() {
    }

    _loader() {
        if (this.state.IsReceived) {
            return this.content();
        } else {
            return this._loading()
        }
    }

    _loading() {
        return (
            <View
                style={{
                    backgroundColor: '#ffffff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: deviceHeight
                }}
            >
                <ActivityIndicator animating color='#ff0000'/>
                <BCText>数据加载中...</BCText>
            </View>
        )
    }

    render() {
        if (this.state.IsNetWork == undefined) {
            return null;
        } else if (this.state.IsNetWork) {
            return (
                <View style={Styles.main} ref="Main">
                    {this.renderNavigator()}
                    {this._loadTop()}
                    {this._loader()}
                    <Maks ref={(ref) => this._Maks = ref}/>
                    {this.maksContent()}
                    {this._loadBotttom()}
                    <Loading ref={(ref) => {
                        this._Loading = ref
                    }}/>
                </View>
            )
        } else {
            return this.noNetWork()
        }
    }

    shouldComponentUpdate() {
        return true
    }

    interactionHandle = null;

    handleMethod(isConnected) {
        //console.log('test', (isConnected ? 'online' : 'offline'));
    }

    WillMount() {
    }

    WillReceive(nextProps) {
        this.setState({IsReceived: true})
    }

    DidMount() {
    }

    WillUnMount() {
    }

    componentWillMount() {
        this.WillMount();
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        this.checkNetWork()
    }

    componentWillReceiveProps(nextProps) {
        this.WillReceive(nextProps)
    }

    componentDidMount() {
        this.DidMount();

        // this.interactionHandle = InteractionManager.runAfterInteractions(() => {
        //     this.setState({interactionsComplete: true});
        // });




    }

    componentWillUnMount() {
        this.WillUnMount();
        if (this.interactionHandle) {
            this.interactionHandle.cancel();
        }
        removeEventListener(TAG_NETWORK_CHANGE, this.handleMethod);

        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }

       // JPushModule.removeReceiveOpenNotificationListener()





    }

    onBackAndroid = () => {
        const nav = this.navigation;
        if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();

        if (nav) {
            if (this.params && this.params.callBack) {
                this.params.callBack();
            }
            this.pop();
            return true;
        }
    };
}

//FlatList 下拉加载更多的时候
class RenderFooter extends Component {
    _isMounted = true

    constructor(props) {
        super(props);
        this.state = {
            isShow: true,
            staus: props.staus
        };
    }

    static propTypes = {
        staus: React.PropTypes.number
    };
    static defaultProps = {
        staus: 1
    }

    render() {
        switch (this.state.staus) {
            case 0://没有记录
                return (
                    <View
                        style={{
                            paddingVertical: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <BCText>我是有底线的</BCText>
                    </View>
                )
                break;
            case 1:
                return (
                    <View
                        style={{
                            paddingVertical: 20,
                        }}
                    >
                        <ActivityIndicator animating size="large"/>
                    </View>
                )
                break;
            case 2:
                return null;
                break
        }
    }

    componentDidMount() {
        let self = this;
        setTimeout(function () {
            if (self._isMounted) {
                self.setState({
                    staus: 0
                })
            }
        }, 3000)
    }

    componentWillMount() {
        let self = this;
        self._isMounted = true;

        setTimeout(function () {
            if (self._isMounted) {
                self.setState({
                    staus: 0
                })
            }
        }, 3000)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

}

export class PullListComponent extends PageComponent {
    _page = 1
    _FlatList = null
    _RenderFooter = null
    _RecordStaus = 1;
    _noMore = false;

    constructor(props) {
        super(props);
        //初始状态
        this.state = {
            dataSource: [],
            FlatListHeight: 0,
            noMoreText: '',
        };
    }

    // 重置高度
    reSetHeight()
    {
        this.setState({
            height: this.state.FlatListHeight ? px2dp(this.state.FlatListHeight) : deviceHeight
        });
    }

    noMoreData(t) {
        this.setState({
            noMoreTex:t
        });
        this._RecordStaus = 0;
        // if (t !== "" && t !== undefined) {
            // this.noRecord(t);
            // this._noMore = true;
        // }
    }

    keyExtractor() {
    }

    renderRow(rowData) {
        return (
            <View>
                <BCText>{'这是第' + rowData + '行'}</BCText>
            </View>)
    }

    onRefersh() {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            // this._page = 0
            // let data = []
            // for (let i = 0; i < 10; i++) {
            //     data.push(i)
            // }
            // this.setState({
            //     dataSource: this._dataSource.cloneWithRows(data)
            // })
            // this.refs.listView.resetStatus() //重置上拉加载的状态

            end()//刷新成功后需要调用end结束刷新
            // this.refs.listView.endRefresh() //建议使用end() 当然 这个可以在任何地方使用
        }, 1500)
    }

    //原作者可能写错了，这里纠正
    onRefresh() {
        let timer = setTimeout(() => {
            clearTimeout(timer)
            // this._page = 0
            // let data = []
            // for (let i = 0; i < 10; i++) {
            //     data.push(i)
            // }
            // this.setState({
            //     dataSource: this._dataSource.cloneWithRows(data)
            // })
            // this.refs.listView.resetStatus() //重置上拉加载的状态

            end()//刷新成功后需要调用end结束刷新
            // this.refs.listView.endRefresh() //建议使用end() 当然 这个可以在任何地方使用
        }, 1500)
    }

    onEndReached() {

    }

    renderFooter() {
        if (this._RenderFooter && this._RenderFooter.state.staus == 1) {
            return null
        }
        return (

                <RenderFooter ref={(ref) => this._RenderFooter = ref} staus={this._RecordStaus}/>

        )
    }

    renderHeader() {
        if (!this.state.IsReceived) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>)

    }

    _renderListview() {
        if (!this.state.IsReceived && this.state.dataSource.length <= 0) {
            return this._loading();
        } else {
            if (this.state.dataSource.length > 0) {
                return (
                    <View style={[{
                        width: deviceWidth,
                        height: this.state.FlatListHeight ? px2dp(this.state.FlatListHeight) : deviceHeight
                    }]}>
                        <FlatList
                            initialNumToRender={7}
                            ListFooterComponent={this.renderFooter.bind(this)}
                            data={this.state.dataSource}
                            renderItem={this.renderRow.bind(this)}
                            ref={(ref) => {
                                this._FlatList = ref;
                            }}
                            onEndReachedThreshold={0.2}
                            keyExtractor={this.keyExtractor.bind(this)}
                            onRefresh={this.onRefersh.bind(this)}
                            refreshing={false}
                            onEndReached={this.onEndReached.bind(this)}
                        />

                    </View>
                )
            } else {
                return (
                    <View style={[{
                        width: deviceWidth,
                        // height: this.state.FlatListHeight ? px2dp(this.state.FlatListHeight) : deviceHeight
                    }]}>
                        <ScrollView
                            onScroll={() => { this.onRefersh(); console.log('刷新',this)}}
                            scrollEventThrottle={px2dp(180)}
                            // showsVerticalScrollIndicator={false}
                        >
                            {/*{this._noMore ? this.noRecord("暂无商品") : this.noRecord('暂无数据')}*/}
                            {this.noRecord(this.state.noMoreText)}
                        </ScrollView>
                        {/*<ScrollView*/}
                            {/*refreshControl={*/}
                            {/*<RefreshControl*/}
                                {/*refreshing={false}*/}
                                {/*onRefresh={this.onRefresh()}*/}
                                {/*tintColor="#ff0000"*/}
                                {/*titleColor="#00ff00"*/}
                                {/*colors={['#ff0000', '#00ff00', '#0000ff']}*/}
                                {/*progressBackgroundColor="#ffff00"*/}
                            {/*/>}*/}
                        {/*>*/}

                        {/*</ScrollView>*/}
                    </View>
                )
            }
        }
    }

    render() {
        if (this.state.IsNetWork == undefined) {
            return null;
        } else if (this.state.IsNetWork) {
            if (!this.state.IsReceived) return null;
            return (
                <View style={Styles.main}>
                    {this.renderNavigator()}
                    {this._loadTop()}
                    {this._renderListview()}
                    <Maks ref={(ref) => this._Maks = ref}/>
                    {this.maksContent()}
                    {this._loadBotttom()}
                    <Loading ref={(ref) => {
                        this._Loading = ref
                    }}/>
                </View>
            )
        } else {
            return this.noNetWork();
        }
    }
}

export class PullViewComponent extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            PullViewHeight: deviceHeight - (Platform.OS === 'ios' ? px2dpH(65) : px2dpH(45))
        };
    }

    _onRefresh(end) {
        let timer = setTimeout(() => {
            this.onRefresh();
            clearTimeout(timer);
            end();

        }, 1000)
    }

    onRefresh() {

    }
    setIsRemoveClippedSubviews()
    {
        return false;
    }

    // 重置高度
    reSetHeight()
    {
        this.setState({
            PullViewHeight: deviceHeight - (Platform.OS === 'ios' ? px2dp(65) : px2dp(130))
        });
    }

    render() {
        if (this.state.IsNetWork == undefined) {
            return null;
        } else if (this.state.IsNetWork) {
            return (
                <View style={[Styles.main]} >

                    {this.renderNavigator()}
                    {this._loadTop()}
                    <SwRefreshScrollView
                        isRemoveClippedSubviews={this.setIsRemoveClippedSubviews()}
                        style={[{height: this.state.PullViewHeight}]}
                        ref={(s) => {
                            this._SwRefreshScrollView = s
                        }}
                        onRefresh={this._onRefresh.bind(this)}>
                        {
                            Platform.OS ?
                                this._loader() :
                                <View style={{flex: 1}}>
                                    {this._loader()}
                                </View>
                        }
                    </SwRefreshScrollView>
                    {this._loadBotttom()}
                    <Maks ref={(ref) => this._Maks = ref}/>
                    {this.maksContent()}
                    <Loading ref={(ref) => {
                        this._Loading = ref
                    }}/>
                </View>
            );
        } else {
            return this.noNetWork();
        }
    }
}

const Styles = StyleSheet.create({
    main: {
        flex: 1,
        height:deviceHeight

    },
    maks: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: deviceWidth,
        height: deviceHeight,
        opacity: 0.3,
        zIndex: 1
    },
    fillParent: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0
    },
    noNetWork: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    noRecord: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    noContent: {
        flex: 1,
        height: deviceHeight-px2dp(22),
    },
});
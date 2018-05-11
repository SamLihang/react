/**
 * Created by sencha on 2017/3/27.
 */
import React from "react";
import {Image, Platform, StyleSheet, TouchableOpacity, View,TextInput} from "react-native";
import BaseComponent, {BCImage, BCText, BCTouchable, px2dp} from "../BaseComponent";
import gs from "../styles/MainStyles";
import EditButton from "../../app/components/EditButton";

export default class BCNavigator extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            rightImage: {
                'pic': require('../imgs/screen.png'),
                'presentationnotes': require('../imgs/Presentationnotes.png'),
                'Telephone2': require('../imgs/Telephone2.png'),
            }
        };
    }

    _edit = null;

    static defaultProps = {
        title: "无标题文档",//标题
        isShowBack: true,//是否显示返回
        renderRight: null,
        isShowSearchBar: false,//是否显示searchBar
        RightType: true,
        rightTitle: "",//右边文字
        isShowImage: false,
        inputPlaceHolder: "请输入菜品名称",
        isNewPageSearch:true
    };

    renderLeft() {
        if (this.props.isShowBack) {
            return (
                <TouchableOpacity activeOpacity={0.3}
                                  style={this.props.isShowSearchBar ? Styles.withSearch : Styles.leftButton}
                                  onPress={() => this.onBack()}>
                    <Image source={require('../imgs/Return2.png')}></Image>
                </TouchableOpacity>
            )
        } else {
            if (this.props.isShowSearchBar) {
                return (
                    <TouchableOpacity activeOpacity={0.3} style={Styles.withSearchleftButton}></TouchableOpacity>)
            }
            else {
                return (
                    <TouchableOpacity activeOpacity={0.3} style={Styles.leftButton}></TouchableOpacity>)
            }

        }
    };

    renderRight() {
        let num = this.props.RightType;
        switch (this.props.RightType) {
            case 'Search':
                return (
                <TouchableOpacity activeOpacity={0.3} style={Styles.rigthButton}>
                    <BCText style={Styles.buttonText}>搜索</BCText>
                </TouchableOpacity>
            );
            case 'pic':
                return (
                    <TouchableOpacity activeOpacity={0.3} style={[Styles.rigthButton]} onPress={
                        () => this.onClickRight()
                    }>
                        <BCImage source={this.state.rightImage[num]}/>
                    </TouchableOpacity>
                );
            case 'presentationnotes':
                return (
                    <TouchableOpacity activeOpacity={0.3} style={[Styles.rigthButton]} onPress={
                        () => this.onClickRight()
                    }>
                        <BCImage source={this.state.rightImage[num]}/>
                    </TouchableOpacity>
                );
            case 'Telephone2':
                return (
                    <TouchableOpacity activeOpacity={0.3} style={[Styles.rigthButton]} onPress={
                        () => this.onClickRight()
                    }>
                        <BCImage source={this.state.rightImage[num]}/>
                    </TouchableOpacity>
                );
            case 'imgSearch':
                return (
                    <TouchableOpacity activeOpacity={0.3} style={[Styles.rigthButton]} onPress={
                        () => this.onSearch()
                    }>
                        <BCImage source={require('../imgs/search.png')}/>
                    </TouchableOpacity>
                );
            case "Edit":
                return (
                    <EditButton
                        ref={(c) => {
                            if (c != null) {
                                this._edit = (c)
                            }
                        }}
                        OnChange={(isEdit) => {
                            let edit = this._edit;
                            if (edit) {
                                edit.OnChange(isEdit);
                            }
                            this.onClickRight(isEdit)
                        }}
                    />
                );
            default:
                return (
                    <TouchableOpacity activeOpacity={0.3} style={Styles.rigthButton} onPress={
                        () => this.onClickRight()
                    }>
                        <BCText style={[Styles.buttonText, gs.c_fff]}>{this.props.rightTitle}</BCText>
                    </TouchableOpacity>
                )
        }
    };

    renderCenter() {
        if (this.props.isShowSearchBar) {
            if (this.props.isNewPageSearch) {
            return (
                <BCTouchable style={[Styles.searchbox, gs.bgc_ececec, {width: '80%'}]} onPress={() => this.onSearch()}>
                    <BCImage style={Styles.seacrhicon} source={require('../imgs/search.png')}/>
                    <BCText style={[Styles.searchbar, gs.fts_14,]}>{this.props.inputPlaceHolder}</BCText>

                </BCTouchable>
            )
        }
        else {
                return (

                    <BCTouchable style={[Styles.searchbox,gs.bgc_ececec, {width: '80%'}]} >
                        <BCImage style={Styles.searchIcon} source={require('../imgs/search.png')}/>
                        <TextInput
                            placeholder={''+this.props.inputPlaceHolder}
                            placeholderTextColor="#b7b7b7"
                            underlineColorAndroid='transparent'
                            style={[Styles.searchbar2, gs.fts_14,]}
                            onChangeText={(text) => {
                                this.props.onChangeText(text)
                            }}
                            onEndEditing={() => {
                                //this.props.onEndEditing(text)
                            }}
                        />

                    </BCTouchable>


                )
            }
        }
        else {
            return (
                <View style={Styles.title}>
                    {this.props.isShowImage ?
                        <BCImage style={Styles.seacrhicon} source={require('../imgs/calendar.png')}/> : null
                    }
                    {/*<BCText style={[gs.c_3a3838, gs.fts_17]}>{this.props.title}</BCText>*/}
                    <BCText style={[{color:'#fffefe'}, gs.fts_17]}>{this.props.title}</BCText>
                </View>
            )
        }
    };

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9,{backgroundColor:'#56d2a8'}]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

    onClickRight(isEdit) {
        let self = this;
        const {navigation} = this.props;
        this.props.onPressRight(isEdit);

    }

    onSearch() {
        const {navigation} = this.props;
        if (navigator) {
            this.props.goSearch()
        }
    }



    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack()
            /*navigator.push({
             name:'touch View',
             component:this.props.Pages,
             /!*params:{
             id:this.state.id,
             getSomething:function (flag) {
             self.setState({
             flag:flag
             })
             }
             }*!/
             })*/
        }
    }

}

export class NavigatorBar extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        title: "无标题文档",//标题
        isShowBack: true,//是否显示返回
        renderRight: null,
        rightTitle: "",//右边文字
    };

    renderLeft() {
        return (
            <TouchableOpacity activeOpacity={0.3}
                              style={Styles.leftButton}
                              onPress={() =>
                                  this.props.isShowBack ? this.onBack() : null
                              }>
                {
                    this.props.isShowBack ?
                        <Image source={require('../imgs/Return.png')}/> : null
                }
            </TouchableOpacity>
        )
    };

    renderRight() {
        switch (this.props.RightType) {
            case "Edit":
                return (
                    <EditButton
                        ref={(c) => {
                            if (c != null) {
                                this._edit = (c)
                            }
                        }}
                        OnChange={(isEdit) => {
                            let edit = this._edit;
                            if (edit) {
                                edit.OnChange(isEdit);
                            }
                            this.onClickRight(isEdit)
                        }}
                    />
                );
                break;
            default:
                return (
                    <TouchableOpacity activeOpacity={0.3} style={Styles.rigthButton} onPress={() =>
                        this.onClickRight()
                    }>
                        {
                            typeof (this.props.rightTitle) ?
                                <BCText style={[Styles.buttonText, gs.c_BaseColor]}>{this.props.rightTitle}</BCText>
                                : <BCImage source={require(this.props.rightTitle)}/>
                        }
                    </TouchableOpacity>
                );
                break;
        }
    };

    renderCenter() {
        return (
            <View style={Styles.title}>
                <BCText style={[gs.c_3a3838, gs.fts_17]}>{this.props.title}</BCText>
            </View>
        )
    };

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

    onClickRight(isEdit) {
        let self = this;
        const {navigation} = this.props;
        this.props.onPressRight(isEdit);

    }

    onSearch() {
        const {navigation} = this.props;
        if (navigator) {
            this.props.goSearch()
        }
    }

    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack();
        }
    }
}

//卖家上下架商品/参与补货 Navigator
export class BCDoNavigator extends BCNavigator {
    static defaultProps = {
        actionText: ['上架商品', '下架商品']
    };
    static propTypes = {
        OnChange: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            whichSelect: 'left'
        }
    }

    renderLeft() {
        return (
            <BCTouchable activeOpacity={0.3}
                         style={Styles.leftButton}
                         onPress={() => this.onBack()}>
                <BCImage source={require('../imgs/Return.png')}/>
            </BCTouchable>
        )
    }

    _onPress(type) {
        if (this.state.whichSelect == type) {
            return false
        }
        this.setState({
            whichSelect: type
        }, () => {
            this.props.OnChange(type)
        })
    }

    renderCenter() {
        return (
            <View style={Styles.title}>
                <View style={[Styles.doTitleBox, gs.bgc_fff]}>
                    <BCTouchable style={[Styles.doTitle, gs.bgc_fff]} onPress={() => {
                        this._onPress('left')
                    }}>
                        <View
                            style={[Styles.doTitleInner, this.state.whichSelect == 'left' ? Styles.doTitleInnerLeft : null]}>
                            <BCText
                                style={[Platform.OS==='ios'?gs.fts_13:gs.fts_15, this.state.whichSelect == 'left' ? gs.c_fff : gs.c_00C164, {textAlign: 'center'}]}>
                                {this.props.actionText[0]}
                            </BCText>
                        </View>
                    </BCTouchable>
                    <BCTouchable style={[Styles.doTitle]} onPress={() => {
                        this._onPress('right')
                    }}>
                        <View
                            style={[Styles.doTitleInner, this.state.whichSelect == 'right' ? Styles.doTitleInnerRigth : null]}>
                            <BCText
                                style={[Platform.OS==='ios'?gs.fts_13:gs.fts_15, this.state.whichSelect == 'right' ? gs.c_fff : gs.c_00C164, {textAlign: 'center'}]}>
                                {this.props.actionText[1]}
                            </BCText>
                        </View>
                    </BCTouchable>
                </View>
            </View>
        )
    }

    renderRight() {
        return (
            <BCTouchable activeOpacity={0.3} style={[Styles.rigthButton]} onPress={
                () => this.onClickRight()
            }>
                <BCImage source={require('../imgs/search.png')}/>
            </BCTouchable>
        );
    }

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }
}

//卖家账期列表Navigator
export class BCAccountNavigator extends BCNavigator {
    static defaultProps = {};
    static propTypes = {
        OnChange: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    renderLeft() {
        return (
            <BCTouchable activeOpacity={0.3}
                         style={Styles.leftButton}
                         onPress={() => this.onBack()}>
                <BCImage source={require('../imgs/Return.png')}/>
            </BCTouchable>
        )
    };

    _onClick(type) {
        this.setState({
            whichSelect: type
        }, () => {
            this.props.OnClick(type)
        })
    }

    renderCenter() {
        return (
            <View style={Styles.acountitle}>
                <BCText style={[gs.c_3a3838, gs.fts_17]}>{this.props.title}</BCText>
                <BCTouchable style={[{paddingLeft: px2dp(10)}]}
                             onPress={() => {
                                 this._onClick('left')
                             }}>
                    <View style={{width: px2dp(17), height: px2dp(17)}}>
                        <BCImage style={{width: px2dp(17), height: px2dp(17),}} source={require('../imgs/Open2.png')}/>
                    </View>
                </BCTouchable>
            </View>
        )
    };

    renderRight() {
        return (
            <BCTouchable activeOpacity={0.3} style={[Styles.rigthButton]} onPress={
                () => this.onClickRight()
            }>
                <BCImage source={require('../imgs/search.png')}/>
            </BCTouchable>
        );
    };

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                {this.renderLeft()}
                {this.renderCenter()}

            </View>
        )
    }
}

//购物车样式Navigator
export class BCShoppingNavigator extends BCNavigator {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static propTypes = {
        OnClick: React.PropTypes.func,
        OnBack: React.PropTypes.func,
    };

    _onClick(Edit) {
        this.props.OnClick(Edit)
    }

    _onBack() {
        this.props.OnBack()
    }

    renderLeft() {
        if (this.props.backCallBack) {
            return (
                <TouchableOpacity activeOpacity={0.3}
                                  style={Styles.leftButton}
                                  onPress={() => this._onBack()}>
                    <Image source={require('../imgs/Return2.png')}></Image>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity activeOpacity={0.3} style={Styles.leftButton}></TouchableOpacity>
            )
        }
    };

    renderRight() {
        if (this.props.renderRight === "Edit") {
            return (
                <EditButton
                    ref={(c) => {
                        if (c != null) {
                            this._edit = (c)
                        }
                    }}
                    OnChange={(isEdit) => {
                        let edit = this._edit;
                        if (edit) {
                            edit.OnChange(isEdit);
                        }
                        this._onClick(isEdit)
                    }}
                    textStyle={
                        [{color: '#fff'}]
                    }
                />
            );
        } else {
            return (
                <View>
                </View>
            )
        }
    };

    renderCenter() {
        return (
            <View style={Styles.title}>
                <BCText style={[gs.c_fff, gs.fts_17]}>{this.props.title}</BCText>
            </View>
        )
    };

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_BaseColor, gs.bdc_bdbdbd]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

    onClickRight(isEdit) {
        let self = this;
        const {navigation} = this.props;
        this.props.onPressRight(isEdit);

    }

    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack()
            /*navigator.push({
             name:'touch View',
             component:this.props.Pages,
             /!*params:{
             id:this.state.id,
             getSomething:function (flag) {
             self.setState({
             flag:flag
             })
             }
             }*!/
             })*/
        }
    }

}

//常购Navigator
export class BCAlwayNavigator extends BCNavigator {
    _EditButton = null;

    static defaultProps = {
        isShowBack: false,//是否显示返回
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    renderLeft() {
        if (this.props.isShowBack) {
            return (
                <BCTouchable style={Styles.withSearch}
                             onPress={() =>
                                 this.onBack()
                             }>
                    <Image source={require('../imgs/Return.png')}></Image>
                </BCTouchable>
            )
        }
    };

    renderRight() {
        return (
            <EditButton
                textStyle={[this.props.pageFrom ? null : gs.c_fff]}
                ref={(c) => {
                    this._EditButton = c
                }}
                isEdit={this.props.isEdit}
                OnChange={(isEdit) => {
                    this.props.onPressRight(isEdit);
                }}
            />
        )
    };

    renderCenter() {
        return (
            <BCTouchable onPress={() => this.onSearch()}
                         style={[Styles.searchbox, this.props.pageFrom ? gs.bgc_ececec : {backgroundColor:'#21bd88'},
                             this.props.isShowBack ? {width: '70%'} : {
                                 width: '75%',
                                 marginLeft: '4%'
                             }]}>
                <BCImage style={Styles.seacrhicon} source={require('../imgs/search.png')}/>
                <BCText style={[Styles.searchbar, gs.fts_14, this.props.pageFrom ? gs.c_b7b7b7:{color:'rgba(255, 255, 255, 0.6)'}]}>输入菜品名称</BCText>
                {/*<BCText style={[Styles.searchbar, gs.fts_14, this.props.pageFrom ? {color:'#fffefe'}:{color:'rgba(255, 255, 255, 0.6)'}]}>输入菜品名称</BCText>*/}
            </BCTouchable>
        )
    };

    render() {
        return (
            <View style={[Styles.navigator, this.props.pageFrom ? gs.bgc_f9f9f9 : gs.bgc_31ca96]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

}

//我的余额样式Navigator
export class BCMyAmountNavigator extends BCNavigator {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _onClick(Edit) {
        this.props.OnClick(Edit)
    }

    _onBack() {
        this.props.OnBack()
    }

    renderLeft() {
        return (
            <TouchableOpacity activeOpacity={0.3}
                              style={this.props.isShowSearchBar ? Styles.withSearch : Styles.leftButton2}
                              onPress={() => this._onBack()}>
                <Image source={require('../imgs/Return2.png')}></Image>
            </TouchableOpacity>
        )
    };

    renderRight() {
        return (
            <TouchableOpacity activeOpacity={0.3} style={Styles.rigthButton} onPress={
                () => this._onClick()
            }>
                <BCText style={[Styles.buttonText, gs.c_fff, gs.fts_14]}>账单</BCText>
            </TouchableOpacity>
        );
    };

    renderCenter() {
        return (
            <View style={Styles.titles}>
                <BCText style={[gs.c_fff, gs.fts_17]}>{this.props.title}</BCText>
            </View>
        )
    };

    render() {
        return (
            <View style={[Styles.navigators, {backgroundColor: '#ff9256'}]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

    onClickRight(isEdit) {
        let self = this;
        const {navigation} = this.props;
        this.props.onPressRight(isEdit);

    }

    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack()
        }
    }

}

//卖家售后管理Navigator
export class BCServiceNavigator extends BCNavigator {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _onClick(Edit) {
        this.props.OnClick(Edit)
    }

    _onBack() {
        this.props.OnBack()
    }

    renderLeft() {
        return (
            <TouchableOpacity activeOpacity={0.3}
                              style={this.props.isShowSearchBar ? Styles.withSearch : Styles.leftButton2}
                              onPress={() => this._onBack()}>
                <Image source={require('../imgs/Return.png')}></Image>
            </TouchableOpacity>
        )
    };

    renderRight() {
        return (
            <TouchableOpacity activeOpacity={0.3} style={Styles.rigthButton} onPress={
                () => this._onClick()
            }>
                <BCText style={[Styles.buttonText, gs.c_888, gs.fts_13]}>历史售后</BCText>
            </TouchableOpacity>
        );
    };

    renderCenter() {
        return (
            <View style={Styles.titles}>
                <BCText style={[gs.c_3a3838, gs.fts_17]}>{this.props.title}</BCText>
            </View>
        )
    };

    render() {
        return (
            <View style={[Styles.navigators, gs.bgc_f9f9f9]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

    onClickRight(isEdit) {
        let self = this;
        const {navigation} = this.props;
        this.props.onPressRight(isEdit);

    }

    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack()
        }
    }

}

//卖家历史售后Navigator
export class BCHServiceNavigator extends BCNavigator {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _onClick(Edit) {
        this.props.OnClick(Edit)
    }

    _onBack() {
        this.props.OnBack()
    }

    renderLeft() {
        return (
            <TouchableOpacity activeOpacity={0.3}
                              style={this.props.isShowSearchBar ? Styles.withSearch : Styles.leftButton2}
                              onPress={() => this._onBack()}>
                <Image source={require('../imgs/Return.png')}></Image>
            </TouchableOpacity>
        )
    };

    renderRight() {
        return (
            <TouchableOpacity activeOpacity={0.3} style={Styles.rigthButton} onPress={
                () => this._onClick()
            }>
                <BCText style={[Styles.buttonText, gs.c_888, gs.fts_13]}>售后管理</BCText>
            </TouchableOpacity>
        );
    };

    renderCenter() {
        return (
            <View style={Styles.titles}>
                <BCText style={[gs.c_3a3838, gs.fts_17]}>{this.props.title}</BCText>
            </View>
        )
    };

    render() {
        return (
            <View style={[Styles.navigators, gs.bgc_f9f9f9]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {this.renderRight()}
            </View>
        )
    }

    onClickRight(isEdit) {
        let self = this;
        const {navigation} = this.props;
        this.props.onPressRight(isEdit);

    }

    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack()
        }
    }

}

//买家版统计
export class BCPurchaseAmount extends BCNavigator {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _onClick(Edit) {
        this.props.OnClick(Edit)
    }

    _onBack() {
        this.props.OnBack()
    }

    renderLeft() {
        return (
            <TouchableOpacity activeOpacity={0.3}
                              style={this.props.isShowSearchBar ? Styles.withSearch : Styles.leftButton2}
                              onPress={() => this._onBack()}>
                <Image source={require('../imgs/Return2.png')}></Image>
            </TouchableOpacity>
        )
    };


    renderCenter() {
        return (
            <View style={[Styles.titles, {marginLeft: '25%'}]}>
                <BCText style={[gs.c_fff, gs.fts_17]}>{this.props.title}</BCText>
            </View>
        )
    };

    render() {
        return (
            <View style={[Styles.navigator2, {backgroundColor: '#5096f2'}]}>
                {this.renderLeft()}
                {this.renderCenter()}
            </View>
        )
    }

    onBack() {
        let self = this;
        const {navigation} = this.props;

        if (navigator) {
            navigation.goBack();
            this.props.backCallBack()
        }
    }

}

BCNavigator.prototypes = {
    title: React.PropTypes.string.isRequired,
    isShowBack: React.PropTypes.bool.isRequired,
    renderRight: React.PropTypes.string.isRequired,
    backCallBack: React.PropTypes.func.isRequired,
    isShowSearchBar: React.PropTypes.bool.isRequired,
    goSearch: React.PropTypes.func,
    rightTitle: React.PropTypes.string.isRequired,
    RightType: React.PropTypes.string.isRequired,
    onPressRight: React.PropTypes.func,
    isShowImage: React.PropTypes.bool.isRequired,
};

const Styles = StyleSheet.create({
    navigator: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        //justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        //borderBottomWidth: 1
    },
    navigators: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
        justifyContent: 'space-between'
    },
    navigator2: {
        height: Platform.OS === 'ios' ? px2dp(65) : px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? px2dp(28) : px2dp(8),
    },
    title: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftButton: {
        width: '20%',
        height: px2dp(36),
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: px2dp(10),
        //backgroundColor: 'red'
    },
    leftButton2: {
        width: '20%',
        height: px2dp(36),
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: px2dp(20)
    },
    withSearch: {
        width: '10%',
        height: px2dp(36),
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: px2dp(10)
    },
    withSearchleftButton: {
        width: '4%',
        height: px2dp(36),
    },
    rigthButton: {
        width: '20%',
        alignItems: 'center'
    },
    searchbox: {
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        //opacity: 0.6,
    },
    searchbox2: {
        height: px2dp(28),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        borderRadius: px2dp(14),
        //opacity: 0.6,
    },
    searchbar: {},

    searchbar2: {
        height: Platform.OS === 'ios' ? px2dp(28) : px2dp(60),
        width: '80%'
    },

    searchicon:{
        width: px2dp(17),
        height: px2dp(17),
        marginLeft: px2dp(0),
    },
    seacrhicon: {
        width: px2dp(17),
        height: px2dp(17),
        marginRight: px2dp(7),
    },
    withBacksearchbox: {
        width: '60%'
    },

    doTitleBox: {
        width: px2dp(180),
        height: px2dp(32),
        //borderRadius: px2dp(4),
        borderWidth: 1,
        borderColor: '#01ae5a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    doTitle: {
        flex: 1
    },
    doTitleInner: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    doTitleInnerLeft: {
        //borderTopLeftRadius: px2dp(8),
        //borderBottomLeftRadius: px2dp(8),
        backgroundColor: '#00C164'
    },
    doTitleInnerRigth: {
        //borderTopRightRadius: px2dp(8),
        //borderBottomRightRadius: px2dp(8),
        backgroundColor: '#00C164'
    },

    acountitle: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

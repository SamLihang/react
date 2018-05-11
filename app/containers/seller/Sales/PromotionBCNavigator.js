import React from "react";
import {Image, Platform, StyleSheet, TouchableOpacity, View, TextInput} from "react-native";
import BaseComponent, {BCImage, BCText, BCTouchable, px2dp} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import EditButton from "../../../../app/components/EditButton";

export class BCNavigator extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            rightImage: {
                'pic': require('../../../imgs/screen.png'),
                'presentationnotes': require('../../../imgs/Presentationnotes.png'),
                'Telephone2': require('../../../imgs/Telephone2.png'),
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
        isNewPageSearch: true
    };

    renderLeft() {
        if (this.props.isShowBack) {
            return (
                <TouchableOpacity activeOpacity={0.3}
                                  style={this.props.isShowSearchBar ? Styles.withSearch : Styles.leftButton}
                                  onPress={() => this.push('Index')}>
                    <Image source={require('../../../imgs/Return.png')}></Image>
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
                        <BCImage source={require('../../../imgs/search.png')}/>
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
                        <BCText style={[Styles.buttonText, gs.c_BaseColor]}>{this.props.rightTitle}</BCText>
                    </TouchableOpacity>
                )
        }
    };

    renderCenter() {
        if (this.props.isShowSearchBar) {
            if (this.props.isNewPageSearch) {
                return (
                    <BCTouchable style={[Styles.searchbox, gs.bgc_ececec, {width: '80%'}]}
                                 onPress={() => this.onSearch()}>
                        <BCImage style={Styles.seacrhicon} source={require('../../../imgs/search.png')}/>
                        <BCText style={[Styles.searchbar, gs.fts_14,]}>{this.props.inputPlaceHolder}</BCText>

                    </BCTouchable>
                )
            }
            else {
                return (

                    <BCTouchable style={[Styles.searchbox2, gs.bgc_ececec, {width: '80%'}]}>
                        <BCImage style={Styles.searchIcon} source={require('../../../imgs/search.png')}/>
                        <TextInput
                            placeholder={this.props.inputPlaceHolder}
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
                        <BCImage style={Styles.seacrhicon} source={require('../../../imgs/calendar.png')}/> : null
                    }
                    <BCText style={[gs.c_3a3838, gs.fts_17]}>{this.props.title}</BCText>
                </View>
            )
        }
    };

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9]}>
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
        let {navigation} = this.props;
        if (navigator) {
            navigation.goBack();
            this.props.backCallBack();
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

export class BCDoNavigator extends BCNavigator {
    static defaultProps = {
        actionText: ['参与促销', '未参与促销']
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
                <BCImage source={require('../../../imgs/Return.png')}/>
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
                                style={[gs.fts_13, this.state.whichSelect == 'left' ? gs.c_fff : gs.c_00C164, {textAlign: 'center'}]}>
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
                                style={[gs.fts_13, this.state.whichSelect == 'right' ? gs.c_fff : gs.c_00C164, {textAlign: 'center'}]}>
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
                <BCImage source={require('../../../imgs/search.png')}/>
            </BCTouchable>
        );
    }

    render() {
        return (
            <View style={[Styles.navigator, gs.bgc_f9f9f9, gs.bdc_bdbdbd]}>
                {this.renderLeft()}
                {this.renderCenter()}
                {/*{this.renderRight()}*/}
            </View>
        )
    }

    onBack() {
        if (this.props) {
            // this.props.navigation.navigate("Index")
            // navigation.goBack();
            this.props.backCallBack();
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

    seacrhicon: {
        width: px2dp(17),
        height: px2dp(17),
        marginRight: px2dp(7),
    },
    withBacksearchbox: {
        width: '60%'
    },

    doTitleBox: {
        width: px2dp(170),
        height: px2dp(30),
        marginBottom: px2dp(7),
        borderRadius: px2dp(4),
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

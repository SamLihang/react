/**
 * Created by Administrator on 2017/5/23.
 */
import React, {Component}from "react";
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, FlatList,Platform} from "react-native";
import {PullListComponent, PullViewComponent} from '../../PageComponent'
import {
    deviceWidth,
    px2dp,
    BCText,
    BCImage,
    BCTouchable,
    substr,
    deviceHeight,
    NavigationOptions,
    BCHostImage
} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from '../../../components/CheckBox';
import {toastLong} from '../../../utils/ToastUtil'
import IsSelectBox from './PriceCheckBox';
import GroupButton from './PriceGroupButton'
import {ActionPriceGroup, ActionDeletePriceGroup} from './../../../actions/PriceGroupAction'
import {fetchDeletePriceGroup} from './../../../services/SellerPriceGroupServices'
class PriceGroupManage extends PullViewComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            isEdit: false,
            dataSource: [
            ],
        }
    }

    CheckBoxProducts = [];
    GroupButton = null;

    //设置页面标题
    setTitle() {
        return "价格组管理"
    }

    rightType() {
        if (this.state.dataSource.length == 0) {
            return true
        } else {
            return "Edit"
        }
    }

    //右边点击事件
    onClickNavigationRight(Edit) {
        this.changeEdit(Edit);
        //this.renderBottom(Edit);
    }

    onRefresh(Edit) {
        const {dispatch} = this.props;
        dispatch(ActionPriceGroup());
    }

    changeEdit(Edit) {
        let products = this.CheckBoxProducts;
        products.map((product, index) => {
            //let key = Product.CompanyId + "-" + Product.ProductType;
            product.onChangeEdit(!Edit);
        });
        this.GroupButton.onChangeEdit(!Edit);
        //this._TextChange.onChangeEdit(!Edit);
    }

    renderProduct(product, index) {
        return (
            <View key={index} style={[Styles.productView, gs.bgc_f2f1ef]}>
                {/*  <BCImage style={[Styles.productImage]}
                 source={{uri: product.LogoImage}}/>*/}
                <BCHostImage style={[Styles.productImage]}
                             source={{uri: product.Image}}
                />
                <BCText
                    style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(10)}]}>{product.CompanyName}</BCText>
                {/*<BCTouchable onPress={() => {
                }} style={Styles.deleteCell}>
                    <BCImage source={require('../../../imgs/Sellerdelete.png')}/>
                </BCTouchable>*/}
            </View>
        );
    }

    renderCompany(item, index) {
        this.CheckBoxProducts=[];
        let products = item.Items;
        let id = item.PriceGroupId;
        let PriceGroupName = item.PriceGroupName;
        let Discount = item.Discount;
        return (
            <View key={index}
                  style={[Styles.companyView, gs.bgc_f2f1ef]}>
                <View style={[Styles.topName, gs.bgc_fff]}>
                    <IsSelectBox
                        Checked={require('../../../imgs/onSelect.png')}
                        ProductId={item.PriceGroupId}
                        ref={(c) => {
                            if (c != null) {
                                this.CheckBoxProducts.push(c);
                            }
                        }}
                        OnChange={(isSelect) => {
                            let boxProducts = this.CheckBoxProducts;
                            let i = 0;
                            boxProducts.map((Product, index) => {
                                if (Product.state.IsSelect) {
                                }
                            });
                        }}
                    />
                    <BCTouchable onPress={() => {
                        this.push("PriceGroupEdit", {id, PriceGroupName, Discount})
                    }}>
                        <BCText
                            style={[gs.fts_14, gs.c_3a3838, {marginLeft: px2dp(10)}]}>{substr(item.PriceGroupName, 11)}</BCText>
                    </BCTouchable>

                    <View style={{position:"absolute", right: 0, width: px2dp(64),  height: px2dp(24),}}>
                    {this.renderRightSign(item.Discount)}
                    </View>
                </View>
                {
                    products == null ? null :
                        products.map((product, i) => {
                            return this.renderProduct(product, i)
                        })
                }
                <View style={[Styles.addView]}>
                    <BCTouchable onPress={() => {
                        this.push("BindCustomer",{priceGroupId:id})
                    }}
                                 style={{flexDirection: "row", alignItems: "center", marginTop: px2dp(12)}}>
                        <BCImage source={require('../../../imgs/Addto2.png')}/>
                        <BCText style={[gs.fts_14, gs.c_888, {marginLeft: px2dp(8)}]}>修改组成员</BCText>
                    </BCTouchable>
                </View>
            </View>

        )

    }

    //右头部的标志
    renderRightSign(Discount) {
        if (Discount >= 80) {
            let Discount = Discount
        } else {
            let Discount = Discount * 100;
        }

        let style = {
            width: px2dp(64),
            borderTopLeftRadius: px2dp(10),
            borderBottomLeftRadius: px2dp(10),
            height: px2dp(24),
            //flexDirection: "row",
            //alignItems: "center",
            //marginTop:px2dp(-19),
            //backgroundColor: "red",
            position: 'absolute',
            top: px2dp(0),
            right: 0,
            //paddingLeft: px2dp(4)
        };
        if (Discount >= 80 && Discount <= 120) {
            return (
                <View >
                    <View style={{flexDirection:"row",marginLeft:px2dp(3),marginTop:px2dp(2.5)}}>
                        <View style={{width:px2dp(19),height:px2dp(19),backgroundColor:"#f65242",borderRadius:50,}}>
                        <BCImage
                            style={{width:px2dp(19),height:px2dp(19)}}
                            source={require('../../../imgs/secondlevel.png')}/>
                        </View>
                        <BCText
                            style={[gs.fts_12, {marginLeft: px2dp(4), color: "#f65242",marginTop:(Platform.OS==="ios")?px2dp(2):0}]}>{Discount + "%"}</BCText>
                    </View>
                <View style={[style, {backgroundColor: "#f65242", opacity: 0.2}]}>
                </View>
                </View>

            )
        } else if (Discount > 120 && Discount <= 160) {
            return (
            <View >
                <View style={{flexDirection:"row",marginLeft:px2dp(3),marginTop:px2dp(2.5)}}>
                    <View style={{width:px2dp(19),height:px2dp(19),backgroundColor:"#fec44b",borderRadius:50,}}>
                        <BCImage
                            style={{width:px2dp(19),height:px2dp(19)}}
                            source={require('../../../imgs/Three.png')}/>
                    </View>
                    <BCText
                        style={[gs.fts_12, {marginLeft: px2dp(4), color: "#fec44b",marginTop:(Platform.OS==="ios")?px2dp(2):0}]}>{Discount + "%"}</BCText>
                </View>
                <View style={[style, {backgroundColor: "#fec44b", opacity: 0.2}]}>
                </View>
            </View>
            )
        } else if (Discount > 160 && Discount <= 200) {
            return (
            <View >
                <View style={{flexDirection:"row",marginLeft:px2dp(3),marginTop:px2dp(2.5)}}>
                    <View style={{width:px2dp(19),height:px2dp(19),backgroundColor:"#10bd9c",borderRadius:50,}}>
                        <BCImage
                            style={{width:px2dp(19),height:px2dp(19)}}
                            source={require('../../../imgs/ClassA.png')}/>
                    </View>
                    <BCText
                        style={[gs.fts_12, {marginLeft: px2dp(4), color: "#10bd9c",marginTop:(Platform.OS==="ios")?px2dp(2):0}]}>{Discount + "%"}</BCText>
                </View>
                <View style={[style, {backgroundColor: "#10bd9c", opacity: 0.2}]}>
                </View>
            </View>
               /* <View style={[style, {backgroundColor: "#10bd9c", opacity: 0.6}]}>
                    <BCImage source={require('../../../imgs/ClassA.png')}/>
                    <View>
                    <BCText
                        style={[gs.fts_12, {marginLeft: px2dp(4), color: "#10bd9c"}]}>{Discount + "%"}</BCText>
                    </View>
                </View>*/
            )
        }
    }

    content() {
        let companys = this.state.dataSource;
        return (
            <View style={[Styles.priceView,]}>
                {
                    companys.map((item, index) => {
                        return this.renderCompany(item, index)
                    })
                }
            </View>
        )
    }


    deleteCell() {
        const {ReduceSellerPriceGroup,dispatch} = this.props;
        var priceGroupIds=[];
        const PriceGroups = ReduceSellerPriceGroup.datas;
        let dataSource = PriceGroups.PriceGroups;
        let PriceGroup = this.CheckBoxProducts;
        PriceGroup.map((obj, i) => {
            if(obj.state.IsSelect){
                priceGroupIds.push(
                    obj.props.ProductId
                );
            }
        });
        if(priceGroupIds.length===0){
            toastLong("请选择要删除的价格组")
        }else{
            dispatch(ActionDeletePriceGroup(priceGroupIds));

        }


    }

    WillMount() {
        const {dispatch} = this.props;
        dispatch(ActionPriceGroup());
    }

    Bottom() {
        return (
            this.renderBottom()
        )
    }

    renderBottom() {
        return (
            <View style={Styles.footerWrap}>
                <GroupButton
                    ref={(c) => {
                        this.GroupButton = c
                    }}
                    _toAdd={() => {
                        this.push("PriceGroupEdit", {id: 0, PriceGroupName: '', Discount: 0})
                    }}
                    _deleteCell={() => {
                        this.deleteCell();
                    }}
                />
            </View>
        )
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceSellerPriceGroup.datas != null && nextProps.ReduceSellerPriceGroup.datas != this.props.ReduceSellerPriceGroup.datas) {
            const {ReduceSellerPriceGroup} = nextProps;
            const PriceGroups = ReduceSellerPriceGroup.datas;
            var dataSource = PriceGroups.PriceGroups;
            this.setState({
                IsReceived: true,
                dataSource: dataSource
            });
        }
        if (nextProps.ReduceKeepPriceGroup.datas != null && nextProps.ReduceKeepPriceGroup.datas !== this.props.ReduceKeepPriceGroup.datas) {
            const {ReduceKeepPriceGroup} = nextProps;
            var priceGroupId =ReduceKeepPriceGroup.datas;
            let Data = this.state.dataSource;
            if(Data.length>0){
                if(Data[Data.length-1].PriceGroupId===0){
                    Data[Data.length-1].PriceGroupId=priceGroupId;
                    this.setState({
                        dataSource:Data
                    });
                }
            }

            const {dispatch} = this.props;
            dispatch(ActionPriceGroup());
        }
        if (nextProps.ReduceDeletePriceGroup.datas != null && nextProps.ReduceDeletePriceGroup.datas !== this.props.ReduceDeletePriceGroup.datas) {
            const {ReduceDeletePriceGroup} = nextProps;
            let PriceGroup = ReduceDeletePriceGroup.datas;
             let dataSource = this.state.dataSource;
            PriceGroup.map((obj, i) => {
                this.state.dataSource.map((company, index) => {
                        if(obj===company.PriceGroupId){
                            dataSource.splice(index,1);
                        }
                });
            });
            this.setState({
                dataSource:dataSource,
            })
        }
        if (nextProps.ReduceDeletePriceGroup.error != null && nextProps.ReduceDeletePriceGroup.error !== this.props.ReduceDeletePriceGroup.error) {
            toastLong("不能删除绑定的价格组")
        }
    }


}
const Styles = StyleSheet.create({
    priceView: {
        flex: 1,
        width: "100%",
        minHeight: px2dp(deviceHeight + 1),
    },
    companyView: {
        margin: px2dp(11),
        //width:px2dp(deviceWidth-24),
        minHeight: px2dp(80),
        borderRadius: px2dp(8),
    },
    companyView1: {
        margin: px2dp(11),
        //width:px2dp(deviceWidth-24),
        borderRadius: px2dp(8),
    },
    topName: {
        height: px2dp(35),
        borderTopLeftRadius: px2dp(8),
        borderTopRightRadius: px2dp(8),
        alignItems: "center",
        flexDirection: "row"

    },
    topRight: {
        width: px2dp(64),
        borderTopLeftRadius: px2dp(10),
        borderBottomLeftRadius: px2dp(10),
        height: px2dp(24),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "red",
        position: 'absolute',
        top: px2dp(5),
        right: 0,
        opacity: 0.8,
        paddingLeft: px2dp(4)
    },
    productView: {
        height: px2dp(44),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: px2dp(10),
        paddingTop: px2dp(10)
    },
    productImage: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: Platform.OS==="ios"?px2dp(15):px2dp(50)
    },
    addView: {
        height: px2dp(44),
        paddingLeft: px2dp(15),
    },
    deleteCell: {
        width: px2dp(15),
        height: px2dp(15),
        position: 'absolute',
        top: px2dp(18),
        right: px2dp(10)
    },

    footerWrap: {
        width: '100%',
        height: px2dp(61),
        //position: 'absolute',
        //bottom: 0,
        //left: 0,
        justifyContent: 'center',
        //zIndex: 100
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3"
    },
    add: {
        //width: '100%',
        height: px2dp(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2dp(8),
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    },

});

function mapStateToProps(store) {
    return {
        ReduceSellerPriceGroup: store.ReduceSellerPriceGroup,
        ReduceKeepPriceGroup: store.ReduceKeepPriceGroup,
        ReduceDeletePriceGroup:store.ReduceDeletePriceGroup,
    }

}
const connectPriceGroupManage = connect(mapStateToProps)(PriceGroupManage);
connectPriceGroupManage.navigationOptions = NavigationOptions;
export default connectPriceGroupManage;
/**
 * Created by Administrator on 2017/5/23.
 */
import React, {Component}from "react";
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, FlatList, TextInput} from "react-native";
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
    BCHostImage,
} from "../../../BaseComponent";
import gs from "../../../styles/MainStyles";
import CheckBox from '../../../components/CheckBox';
import {toastLong} from '../../../utils/ToastUtil'
import {ActionGetSellerBindCompanys, ActionReviseBindCompanys,ActionPriceGroup,EditBindCompany} from './../../../actions/PriceGroupAction'

class BindCustomer extends PullViewComponent {
    constructor(props) {
        super(props);// 初始状态
        this.state = {
            dataSource: [],
        };
        this.selectList=[];
    }
    CheckBoxCompany = [];

    //设置页面标题
    setTitle() {
        return "绑定客户"
    }

    rightType() {
        if (this.state.dataSource.length == 0) {
            return true
        } else {
            return true
        }
    }

    save(){
        const {dispatch,navigation} = this.props;
        const priceGroupId = this.params.priceGroupId;
        let bCompanyIds=[];
        let item=[];
        let companys=this.state.dataSource;

        let BoxCompanys=this.CheckBoxCompany;
        BoxCompanys.map((Company,index)=>{
            if(Company.state.IsSelect){
                bCompanyIds.push(
                    Company.props.BCompanyId
                );
                item.push(
                    {
                        BCompanyId:Company.props.BCompanyId,
                        CompanyName:Company.props.CompanyName,
                        Image:Company.props.Image,
                        PriceGroupId:priceGroupId
                    }
                );
            }
        });

        if(bCompanyIds.length===0){
            toastLong("请选择要绑定的客户")
        }else{
            dispatch(ActionReviseBindCompanys({bCompanyIds,priceGroupId}));
            //dispatch(ActionPriceGroup());
            dispatch(EditBindCompany({item,priceGroupId}));

        }
    }

    Bottom() {
        return (
            this.renderBottom()
        )
    }

    renderBottom() {
        return (
            <View style={[Styles.footerWrap,gs.bgc_fff]}>
                <BCTouchable style={[gs.bgc_BaseColor, Styles.add]} onPress={() => {this.save()}}>
                    <View >
                        <BCText style={[gs.c_fff, gs.fts_15]}>保存</BCText>
                    </View>
                </BCTouchable>
            </View>
        )
    }

    content() {
        this.CheckBoxCompany=[];
        let companys = this.state.dataSource;
        return (
            <View style={[Styles.main]}>
                <View style={[Styles.TopView, gs.bgc_fff]}>
                    {
                        companys.map((company, index) => {
                            let IsSelect = company.IsSelect;
                            let CompanyName = company.CompanyName;
                            let Image=company.Image;
                            let BCompanyId=company.BCompanyId;
                            return (
                                <View style={[Styles.groupView]} key={index}>
                                    <CheckBox
                                        Checked={require('../../../imgs/Selected.png')}
                                        IsSelect={IsSelect}
                                        PriceGroupId={company.PriceGroupId}
                                        Image={Image}
                                        CompanyName={CompanyName}
                                        BCompanyId={BCompanyId}
                                        ref={(c) => {
                                            if (c != null) {
                                                this.CheckBoxCompany.push(c);
                                            }
                                        }}
                                        OnChange={(isSelect) => {
                                            let boxCompany = this.CheckBoxCompany;
                                            let i = 0;
                                            boxCompany.map((Company, index) => {
                                                if (Company.state.IsSelect) {
                                                    if(isSelect){
                                                        //把选中的列表添加到新的数组
                                                        this.selectList.push({
                                                            BCompanyId: Company.props.BCompanyId,
                                                        });
                                                        this.state.dataSource.map((data,index)=>{
                                                            this.selectList.map((obj,index)=>{
                                                                if(obj.BCompanyId===data.BCompanyId)
                                                                    data.IsSelect=true;
                                                            });
                                                        });
                                                    }
                                                }else{
                                                    //把取消选中的列表删除到新的数组
                                                    this.selectList.map((list,index)=>{
                                                        if(list.BCompanyId===Company.props.BCompanyId){
                                                            this.selectList.splice(index,1);
                                                            //state中的值也改为false;
                                                            this.state.dataSource.map((data,index)=>{
                                                                if(data.BCompanyId===list.BCompanyId){
                                                                    data.IsSelect=false;
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }}
                                    />
                                    <BCText
                                        style={[gs.fts_15, gs.c_3a3838, {marginLeft: px2dp(2)}]}>{CompanyName}</BCText>
                                </View>
                            )
                        })
                    }
                </View>

            </View>
        )
    }

    WillMount() {
        const {dispatch} = this.props;
        const priceGroupId = this.params.priceGroupId;
        dispatch(ActionGetSellerBindCompanys(priceGroupId));
        this.setState({
            //IsReceived: true
        });
    }

    WillReceive(nextProps) {
        if (nextProps.ReduceGetSellerBindCompanys.datas != null && nextProps.ReduceGetSellerBindCompanys.datas != this.props.ReduceGetSellerBindCompanys.datas) {
            const {ReduceGetSellerBindCompanys} = nextProps;
            let dataSource = ReduceGetSellerBindCompanys.datas;
            dataSource.map((data,index)=>{
                if(data.IsSelect){
                    this.selectList.push({
                        BCompanyId: data.BCompanyId,
                    });
                }
            });
            this.setState({
                IsReceived: true,
                dataSource: dataSource
            });
        }
         if (nextProps.ReduceReviseBindCompanys.datas != null && nextProps.ReduceReviseBindCompanys.datas !== this.props.ReduceReviseBindCompanys.datas) {
         this._Loading.Trigger(false);
             const {dispatch,navigation} = this.props;
             dispatch(ActionPriceGroup());
             //刷新页面
             let BoxCompanys=this.CheckBoxCompany;
             if (navigator) {
                 navigation.goBack();
                 //重新渲染页面
                 toastLong("保存成功")
                 //dispatch(ActionPriceGroup());
             }
         }
    }


}
const Styles = StyleSheet.create({
    main: {
        flex: 1,
        minHeight: px2dp(deviceHeight + 1)
    },
    TopView: {
        marginTop: px2dp(10),
        //height:px2dp(195),
        width: "100%",
    },
    groupView: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        marginLeft: px2dp(10),
        width: px2dp(deviceWidth / 2),

    },
    footerWrap: {
        width: '100%',
        height: px2dp(61),
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        zIndex: 100,
        borderTopWidth:1,
        borderTopColor:"#ccc"
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
        ReduceGetSellerBindCompanys: store.ReduceGetSellerBindCompanys,
        ReduceReviseBindCompanys:store.ReduceReviseBindCompanys
    }

}
const connectBindCustomer = connect(mapStateToProps)(BindCustomer);
connectBindCustomer.navigationOptions = NavigationOptions;
export default connectBindCustomer;
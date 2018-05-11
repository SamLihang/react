/**
 * Created by Administrator on 2017/5/19.
 */
import * as Types from './Types';
import {fetchPriceGroup,
    fetchEditPriceGroup,
    fetchKeepOnePriceGroup,
    fetchDeletePriceGroup,
    fetchDeleteOnePriceGroup,
    fetchBindCompanys,
    fetchReviseBindCompanys
} from '../services/SellerPriceGroupServices';

export function ActionPriceGroup(){
    return (dispatch) => {
        dispatch({'type':Types.RequestSellerPriceGroupStart});
        fetchPriceGroup().then((ret)=>{
            dispatch({'type': Types.RequestSellerPriceGroupEnd, data: ret.data});
        }).catch((e)=>{
            dispatch({'type': Types.RequestSellerPriceGroupError, error: e});
        });
    }
}
//保存整个组
export function ActionEditPriceGroup({id,priceGroupName,discount}){
    return (dispatch) => {
        dispatch({'type':Types.RequestKeepPriceGroupStart});
        fetchEditPriceGroup({id:id,priceGroupName:priceGroupName,discount:discount}).then((ret)=>{
            dispatch({'type': Types.RequestKeepPriceGroupEnd, data: ret.data});
        }).catch((e)=>{
            dispatch({'type': Types.RequestKeepPriceGroupError, error: e});
        });
    }
}
//保存组里的一个
export function ActionKeepOnePriceGroup({p,t}){
    return (dispatch) => {
        dispatch({'type':Types.RequestKeepOnePriceGroupStart});
        fetchKeepOnePriceGroup({p,t}).then((ret)=>{
            dispatch({'type': Types.RequestKeepOnePriceGroupEnd, data: ret.data});
        }).catch((e)=>{
            dispatch({'type': Types.RequestKeepOnePriceGroupError, error: e});
        });
    }
}

//删除一个价格组
export function ActionDeletePriceGroup(priceGroupIds){
    return (dispatch) => {
        dispatch({'type':Types.RequestDeletePriceGroupStart});
        fetchDeletePriceGroup(priceGroupIds).then((ret)=>{
            dispatch({'type': Types.RequestDeletePriceGroupEnd, data: ret.data,error: ret.error});
        }).catch((e)=>{
            dispatch({'type': Types.RequestDeletePriceGroupError, error: e});
        });
    }
}

//删除价格组的中一个
export function ActionDeleteOnePriceGroup(salesOrderIds) {
    return (dispatch) => {
        dispatch({'type': Types.RequestDeleteOnePriceGroupStart});
        fetchDeleteOnePriceGroup(salesOrderIds).then((ret) => {
            dispatch({'type': Types.RequestDeleteOnePriceGroupEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestDeleteOnePriceGroupError, error: e});
        });
    }
}

//加载绑定客户
export function ActionGetSellerBindCompanys(priceGroupId) {
    return (dispatch) => {
        dispatch({'type': Types.RequestGetSellerBindCompanysStart});
        fetchBindCompanys(priceGroupId).then((ret) => {
            dispatch({'type': Types.RequestGetSellerBindCompanysEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestGetSellerBindCompanysError, error: e});
        });
    }
}
//修改绑定客户
export function ActionReviseBindCompanys({bCompanyIds,priceGroupId}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestReviseBindCompanysStart});
        fetchReviseBindCompanys({bCompanyIds,priceGroupId}).then((ret) => {
            dispatch({'type': Types.RequestReviseBindCompanysEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestReviseBindCompanysError, error: e});
        });
    }
}

//修改或者添加价格组
export let EditArr=({id,priceGroupName,discount})=>{
    return (dispatch) => {
        dispatch(EditArrList({id,priceGroupName,discount}));

    }
};
let EditArrList = ({id,priceGroupName,discount}) => {
    return {
        type:Types.EditPriceGroup,
        id,priceGroupName,discount,
    };
};

//修改绑定商户
export let EditBindCompany=({item,priceGroupId})=>{
    return (dispatch) => {
        dispatch(EditBindCompanyList({item,priceGroupId}));

    }
};
let EditBindCompanyList = ({item,priceGroupId}) => {
    return {
        type:Types.EditBindCompanys,
        item,priceGroupId,
    };
};


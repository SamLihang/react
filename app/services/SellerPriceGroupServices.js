/**
 * Created by Administrator on 2017/5/19.
 */
import {request} from '../utils/RequestUtil';
const PriceGroupUrl='/ReactSellerProduct/PriceGroups';
const EditPriceGroupUrl='/ReactSellerProduct/EditPriceGroup';
const KeepOnePriceGroupUrl='/ReactSellerProduct/KeepOnePriceGroup';
const DeletePriceGroupUrl='/ReactSellerProduct/DeletePriceGroups';
const DeleteOnePriceGroupUrl='/ReactSellerProduct/DeleteOnePriceGroup';
const GetSellerBindCompanysUrl='/ReactSellerProduct/GetSllerBindCompanys';
const ReviseBindCompanysUrl='/ReactSellerProduct/BindCustomerPriceGroup';

export const fetchPriceGroup=()=>{
    return request(PriceGroupUrl,)
};
//保存一个组
export const fetchEditPriceGroup=({id,priceGroupName,discount})=>{
    return request(EditPriceGroupUrl,{
        id:id,priceGroupName:priceGroupName,discount:discount
    })
};

//保存组里面的一条
export const fetchKeepOnePriceGroup=(salesOrderIds)=>{
    return request(KeepOnePriceGroupUrl,{
        salesOrderIds:salesOrderIds
    })
};

//删除整组
export const fetchDeletePriceGroup=(priceGroupIds)=>{
    return request(DeletePriceGroupUrl,{
        priceGroupIds:priceGroupIds
    })
};

//删除一组中的一个
export const fetchDeleteOnePriceGroup=(salesOrderId)=>{
    return request(DeleteOnePriceGroupUrl,{
        salesOrderId:salesOrderId
    })
};

//加载绑定客户
export const fetchBindCompanys=(priceGroupId)=>{
    return request(GetSellerBindCompanysUrl,{
        priceGroupId:priceGroupId
    })
};
//修改绑定客户
export const fetchReviseBindCompanys=({bCompanyIds,priceGroupId})=>{
    return request(ReviseBindCompanysUrl,{
    bCompanyIds,priceGroupId
    })
};
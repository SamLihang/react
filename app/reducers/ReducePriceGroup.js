/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'
Array.prototype.newArr = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};

const initalLoaderPriceGroup = {};

const initalKeepPriceGroup = {};
const initalKeepOnePriceGroup = {};
const initalDeletePriceGroup = {};
const initalDeleteOnePriceGroup = {};
const initalGetSellerBindCompanys = {};
const initalReviseBindCompanys = {};

export function ReduceSellerPriceGroup(state = initalLoaderPriceGroup, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSellerPriceGroupStart:
            return {
                ...state
            };
        case Types.RequestSellerPriceGroupEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestSellerPriceGroupError:

            return {
                ...state
            };
        //修改价格组
        case Types.EditPriceGroup:
            state.datas.PriceGroups.map((company,index)=>{
                    if(company.PriceGroupId===action.id){
                        company.Discount=action.discount;
                        company.PriceGroupName=action.priceGroupName;
                    }
            });
            if(action.id===0){
                state.datas.PriceGroups.push(
                    {
                        Discount:action.discount,
                        Items:null,
                        PriceGroupId:0,
                        PriceGroupName:action.priceGroupName
                    }
                )
            }
            return Object.assign({}, state, {
                datas:state.datas,
            });
         //得到返回的添加新的价格组的priceGroupId
            //得到返回的添加新的价格组的绑定客户组
        case Types.EditBindCompanys:
            state.datas.PriceGroups.map((company,index)=>{
                if(company.PriceGroupId===action.priceGroupId){
                    if(company.Items!==null){
                        if(company.Items.length>0){
                            company.Items.splice(0,company.Items.length);
                        }
                    }else{
                        company.Items=[];
                    }
                    action.item.map((list,i)=>{
                        company.Items.push(
                            {
                                BCompanyId:list.BCompanyId,
                                CompanyName:list.CompanyName,
                                Image:list.Image,
                                PriceGroupId:list.PriceGroupId
                            }
                        )
                    });
                }
            });

            return Object.assign({}, state, {
                datas:state.datas,
            });
        default:
            return state;
    }
}
//保存组
export function ReduceKeepPriceGroup(state = initalKeepPriceGroup, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestKeepPriceGroupStart:
            return {
                ...state
            };
        case Types.RequestKeepPriceGroupEnd:
            return {
                ...state,
                datas: action.data,
                error:action.error
            };
        case Types.RequestKeepPriceGroupError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//保存组里一个
export function ReduceKeepOnePriceGroup(state = initalKeepOnePriceGroup, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestKeepOnePriceGroupStart:
            return {
                ...state
            };
        case Types.RequestKeepOnePriceGroupEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestKeepOnePriceGroupError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//删除组
export function ReduceDeletePriceGroup(state = initalDeletePriceGroup, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestDeletePriceGroupStart:
            return {
                ...state
            };
        case Types.RequestDeletePriceGroupEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestDeletePriceGroupError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//删除组里一个
export function ReduceDeleteOnePriceGroup(state = initalDeleteOnePriceGroup, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestDeleteOnePriceGroupStart:
            return {
                ...state
            };
        case Types.RequestDeleteOnePriceGroupEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestDeleteOnePriceGroupError:
            return {
                ...state
            };
        default:
            return state;
    }
}

//加载绑定客户
export function ReduceGetSellerBindCompanys(state = initalGetSellerBindCompanys, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestGetSellerBindCompanysStart:
            return {
                ...state
            };
        case Types.RequestGetSellerBindCompanysEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestGetSellerBindCompanysError:
            return {
                ...state
            };
        default:
            return state;
    }
}
//修改绑定客户
export function ReduceReviseBindCompanys(state = initalReviseBindCompanys, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestReviseBindCompanysStart:
            return {
                ...state
            };
        case Types.RequestReviseBindCompanysEnd:
            return {
                ...state,
                datas: action.data
            };
        case Types.RequestReviseBindCompanysError:
            return {
                ...state
            };
        default:
            return state;
    }
}
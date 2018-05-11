import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'
import {toastLong} from '../utils/ToastUtil';
import {toDecimal2} from '../utils/FormatUtil';

const initalLoaderRetailPrice = {};

const initalRetailPrice = {};

const initalUpdateRetailPrice = {};


export function ReduceLoaderRetailPrice(state = initalLoaderRetailPrice, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestLoaderRetailPriceStart:
            return {
                ...state
            };
        case Types.RequestLoaderRetailPriceEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestLoaderRetailPriceError:
            return {
                ...state
            };
            //修改价格
        case Types.EditRetailPrice:
            state.datas.Products.map((obj,index)=>{
                    if( obj.ProductGlobalId===action.productGlobalId){
                        let price=parseFloat(action.price);
                        obj.SpecPrices.Price=price;
                        //toastLong(JSON.stringify('修改价格成功'));
                    }
            });
            return Object.assign({}, state, {
                datas:state.datas,
            });
        default:
            return state;
    }
}

export function ReduceRetailPrice(state = initalRetailPrice, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestRetailPriceStart:
            return {
                ...state
            };
        case Types.RequestRetailPriceEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestRetailPriceError:
            return {
                ...state
            };
        //修改价格
        case Types.EditRetailPrice:

            if(state.datas){
                state.datas.Products.map((obj,index)=>{
                    if( obj.ProductGlobalId===action.productGlobalId){
                        let price=parseFloat(action.price);
                        obj.SpecPrices.Price=toDecimal2(price);
                        //toastLong(JSON.stringify('修改价格成功'));
                    }
                });
            }
            return Object.assign({}, state, {
                datas:state.datas,
            });
        default:
            return state;
    }
}

//修改
export function ReduceUpdateRetailPrice(state = initalUpdateRetailPrice, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceProduct;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestUpdateRetailPriceStart:
            return {
                ...state
            };
        case Types.RequestUpdateRetailPriceEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestUpdateRetailPriceError:
            return {
                ...state
            };
        default:
            return state;
    }
}


/**
 * Created by Administrator on 2017/5/25.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'
//店铺信息
const initalCustomer = {};

export function ReduceCustomer(state = initalCustomer, action) {
    switch (action.type) {
        case Types.RequestCustomerStart:
            return {
                ...state
            };
        case Types.RequestCustomerEnd:
            return {
                ...state,
                datas: action.datas,
                error:action.error
            }
        case Types.RequestCustomerError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//账款管理
const initalGetSalesOrderSettle = {};

export function ReduceGetSalesOrderSettle(state = initalGetSalesOrderSettle, action) {
    switch (action.type) {
        case Types.RequestGetSalesOrderSettleStart:
            return {
                ...state
            };
        case Types.RequestGetSalesOrderSettleEnd:
            return {
                ...state,
                datas: action.datas,
                error:action.error
            }
        case Types.RequestGetSalesOrderSettleError:

            return {
                ...state
            };
        default:
            return state;
    }
}


//结算列表
const initalOrderSettleList = {};

export function ReduceOrderSettleList(state = initalOrderSettleList, action) {
    switch (action.type) {
        case Types.RequestOrderSettleListStart:
            return {
                ...state
            };
        case Types.RequestOrderSettleListEnd:
            return {
                ...state,
                datas: action.datas,
                error:action.error
            }
        case Types.RequestOrderSettleListError:

            return {
                ...state
            };
        default:
            return state;
    }
}

//账期详情
const initalOrderSettleListDetail = {};

export function ReduceOrderSettleListDetail(state = initalOrderSettleListDetail, action) {
    switch (action.type) {
        case Types.RequestOrderSettleListDetailStart:
            return {
                ...state
            };
        case Types.RequestOrderSettleListDetailEnd:
            return {
                ...state,
                datas: action.datas,
                error:action.error
            }
        case Types.RequestOrderSettleListDetailError:

            return {
                ...state
            };
        default:
            return state;
    }
}


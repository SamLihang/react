/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';
import {REHYDRATE} from 'redux-persist/constants'

const initialAccount = {};
const initialSettlementList = {};
const initialAccountDetail = {};

//账期详情
export function ReduceAccount(state = initialAccount, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestAccountPayStart:
            return {
                ...state
            };
        case Types.RequestAccountPayEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestAccountPayError:
            return {
                ...state
            };
        default:
            return state;
    }

}
//账期月排序
export function ReduceSettlementList(state = initialSettlementList, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestSettlementListStart:
            return {
                ...state
            };
        case Types.RequestSettlementListEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSettlementListError:
            return {
                ...state
            };
        default:
            return state;
    }

}
//账期按天查看
export function ReduceAccountDetail(state = initialAccountDetail, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestAccountDetailStart:
            return {
                ...state
            };
        case Types.RequestAccountDetailEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestAccountDetailError:
            return {
                ...state
            };
        default:
            return state;
    }

}


//账期支付
export function ReduceAccounts(state = {}, action) {
    switch (action.type) {
        case Types.RequestAccountsStart:
            return {
                ...state
            };
        case Types.RequestAccountsEnd:
            return {
                ...state,
                datas: action.data,
                error: action.message
            }
        case Types.RequestAccountsError:
            return {
                ...state
            }
        default:
            return state;
    }

}

//买家账单
export function ReduceBBills(state = {}, action) {
    switch (action.type) {
        case Types.RequestBBillsStart:
            return {
                ...state
            };
        case Types.RequestBBillsEnd:
            return {
                ...state,
                datas: action.data,
                error: action.message
            }
        case Types.RequestBBillsError:
            return {
                ...state
            }
        default:
            return state;
    }
}

//卖家账单
export function ReduceSSBills(state = {}, action) {
    switch (action.type) {
        case Types.RequestSSBillsStart:
            return {
                ...state
            };
        case Types.RequestSSBillsEnd:
            return {
                ...state,
                datas: action.data,
                error: action.message
            }
        case Types.RequestSSBillsError:
            return {
                ...state
            }
        default:
            return state;
    }
}
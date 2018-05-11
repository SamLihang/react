import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalLoaderWithdrawalDetail = {};

export function ReduceLoaderWithdrawalDetail(state = initalLoaderWithdrawalDetail, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestWithdrawDetailStart:
            return {
                ...state
            };
        case Types.RequestWithdrawDetailEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestWithdrawDetailError:
            return {
                ...state
            };
        default:
            return state;
    }
}


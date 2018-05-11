/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalCurrentPurchaseAmount = {};

export function ReduceCurrentPurchaseAmount(state = initalCurrentPurchaseAmount, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestCurrentPurchaseAmountStart:
            return {
                ...state
            };
        case Types.RequestCurrentPurchaseAmountEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestCurrentPurchaseAmountError:
            return {
                ...state
            };
        default:
            return state;
    }

}

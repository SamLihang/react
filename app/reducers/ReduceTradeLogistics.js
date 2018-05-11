/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initalTradeLogistics = {};

export function ReduceTradeLogistics(state = initalTradeLogistics, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceAddressManage;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestTradeLogisticsStart:
            return {
                ...state
            };
        case Types.RequestTradeLogisticsEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestTradeLogisticsError:
            return {
                ...state
            };
        default:
            return state;
    }

}



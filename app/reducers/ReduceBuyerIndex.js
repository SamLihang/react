//买家首页
import * as Types from '../actions/Types';
import {REHYDRATE} from 'redux-persist/constants'


//首页商品分类
const initialSelectIndexRecommend = {};
export function ReduceSelectIndexRecommend(state = initialSelectIndexRecommend, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestSelectIndexRecommendStart:
            return {
                ...state
            };
        case Types.RequestSelectIndexRecommendEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestSelectIndexRecommendError:
            return {
                ...state
            };
        default:
            return state;
    }
}

const initialCities = {};
export function ReduceCities(state = initialCities, action) {
    switch (action.type) {
        case REHYDRATE:
            return state;
        case Types.RequestCitiesStart:
            return {
                ...state
            };
        case Types.RequestCitiesEnd:
            return {
                ...state,
                datas: action.data
            }
        case Types.RequestCitiesError:
            return {
                ...state
            };
        default:
            return state;
    }
}



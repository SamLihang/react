//买家首页

import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchSelectIndexRecommend,
    fetchCities,
} from '../services/BuyerIndexService';


export function ActionSelectIndexRecommend() {
    return (dispatch) => {
        dispatch({'type': Types.RequestSelectIndexRecommendStart});
        fetchSelectIndexRecommend().then((ret) => {
            dispatch({'type': Types.RequestSelectIndexRecommendEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSelectIndexRecommendError, error: e});
        });
    }
}



export function ActionCities() {
    return (dispatch) => {
        dispatch({'type': Types.RequestCitiesStart});
        fetchCities().then((ret) => {
            dispatch({'type': Types.RequestCitiesEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestCitiesError, error: e});
        });
    }
}























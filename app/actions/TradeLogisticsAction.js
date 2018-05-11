/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchTradeLogistics} from '../services/TradeLogisticsServices';

export function ActionTradeLogistics({p}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestTradeLogisticsStart});
        fetchTradeLogistics({p}).then((ret) => {
            dispatch({'type': Types.RequestTradeLogisticsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestTradeLogisticsError, error: e});
        });
    }
}


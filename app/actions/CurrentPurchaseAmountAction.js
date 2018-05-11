/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchCurrentPurchaseAmount,fetchPurchaseStatisticsChart,fetchSellerPurchaseAmount,fetchSellerStatisticsChart} from '../services/CurrentPurchaseAmountServices';

//买家统计

export function ActionCurrentPurchaseAmount() {
    return (dispatch) => {
        dispatch({'type': Types.RequestCurrentPurchaseAmountStart});
        fetchCurrentPurchaseAmount().then((ret) => {
            dispatch({'type': Types.RequestCurrentPurchaseAmountEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestCurrentPurchaseAmountError, error: e});
        });
    }
}
//日/月采购额
export function ActionPurchaseStatisticsChart() {
    return (dispatch) => {
        dispatch({'type': Types.RequestPurchaseStatisticsChartStart});
        fetchPurchaseStatisticsChart().then((ret) => {
            dispatch({'type': Types.RequestPurchaseStatisticsChartEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestPurchaseStatisticsChartError, error: e});
        });
    }
}

//卖家统计

export function ActionSellerPurchaseAmount() {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerPurchaseAmountStart});
        fetchSellerPurchaseAmount().then((ret) => {
            dispatch({'type': Types.RequestSellerPurchaseAmountEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerPurchaseAmountError, error: e});
        });
    }
}
//日/月采购额
export function ActionSellerStatisticsChart() {
    return (dispatch) => {
        dispatch({'type': Types.RequestSellerStatisticsChartStart});
        fetchSellerStatisticsChart().then((ret) => {
            dispatch({'type': Types.RequestSellerStatisticsChartEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestSellerStatisticsChartError, error: e});
        });
    }
}
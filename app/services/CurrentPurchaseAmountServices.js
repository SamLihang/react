/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
//买家统计
const CurrentPurchaseAmountUrl = '/ReactPurchaseStatistics/PurchaseStatisticsTitle';
const PurchaseStatisticsChartUrl = '/ReactPurchaseStatistics/PurchaseStatisticsChart';
//卖家统计
const SellerPurchaseAmountUrl = '/ReactPurchaseStatistics/SalesStatisticsTitle';
const SellerStatisticsChartUrl = '/ReactPurchaseStatistics/SalesStatisticsChart';

//买家统计
export const fetchCurrentPurchaseAmount = () => {
    return request(CurrentPurchaseAmountUrl)
}

export const fetchPurchaseStatisticsChart = () => {
    return request(PurchaseStatisticsChartUrl, )
}

//卖家统计
export const fetchSellerPurchaseAmount = () => {
    return request(SellerPurchaseAmountUrl, )
}

export const fetchSellerStatisticsChart = () => {
    return request(SellerStatisticsChartUrl, )
}
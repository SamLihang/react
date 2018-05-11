/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const TradeLogisticsUrl = '/ReactMessage/LogisticsMessageBuy';

//我的收货地址
export const fetchTradeLogistics = ({p}) => {
    return request(TradeLogisticsUrl, {p})
}


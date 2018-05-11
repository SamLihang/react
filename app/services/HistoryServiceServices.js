/**
 * Created by Administrator on 2017/8/8.
 */
import {request} from '../utils/RequestUtil';
const GetHistoryServiceOrderUrl = '/ReactServiceorder/GetSerllerHisServiceorder';

//买家售后服务
export const fetchGetHistoryServiceOrder = ({p}) => {
    return request(GetHistoryServiceOrderUrl,{p: p})
}
/**
 * Created by Administrator on 2017/8/8.
 */
import {request} from '../utils/RequestUtil';
const GetServiceorderUrl = '/ReactServiceorder/GetServiceorder';

//买家售后服务
export const fetchGetServiceorder = ({p}) => {
    return request(GetServiceorderUrl,{p: p})
}
/**
 * Created by Administrator on 2017/5/25.
 */
import {request} from "../utils/RequestUtil";
const CustomerUrl = '/ReactCustomer/Customer';
const GetSalesOrderSettleUrl='/ReactSalesOrderSettle/GetSalesOrderSettle';
const SalesOrderSettleListUrl='/ReactSalesOrderSettle/SalesOrderSettleList';
const SalesOrderSettleListDetailUrl='/ReactSalesOrderSettle/SalesOrderSettleListDetail'

//店铺详情
export const fetchCustomer = ({bCompanyId:bCompanyId}) => {
    return request(CustomerUrl, {
        bCompanyId:bCompanyId
    })
};

//账款管理
export const fetchGetSalesOrderSettle = () => {
    return request(GetSalesOrderSettleUrl)
};

//结算列表
export const fetchOrderSettleList = ({p,bCompanyId}) => {
    return request(SalesOrderSettleListUrl, {
        p:p,
        bCompanyId:bCompanyId
    })
};

//账期详情
export const fetchOrderSettleListDetail = ({salesOrderSettleId}) => {
    return request(SalesOrderSettleListDetailUrl, {
        salesOrderSettleId:salesOrderSettleId
    })
};
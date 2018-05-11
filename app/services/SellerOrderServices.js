/**
 * Created by Administrator on 2017/5/19.
 */
import {request} from '../utils/RequestUtil';

const SellerSalesOrderUrl = '/ReactSellerSalesOrder/SalesOrders';
const AcceptSalesOrderUrl = '/ReactSellerSalesOrder/AcceptSalesOrder';
const DeliverySalesOrderUrl = '/ReactSellerSalesOrder/DeliverySalesOrder';
const SalesOrderDetailUrl = '/ReactSellerSalesOrder/SalesOrder';
// const ProductDetailUrl = '/ReactSellerProduct/Product';
const ProductDetailUrl = '/BclSellerProduct/Product';
const ConfirmReceiveUrl = '/ReactSellerSalesOrder/ConfirmReceive';
const AgreeToRefundlUrl = '/ReactServiceorder/AgreeToRefund';
const RefusedToRefundUrl = '/ReactServiceorder/RefusedToRefund';

export const fetchSellerSalesOrders = ({p, t}) => {
    return request(SellerSalesOrderUrl, {p: p, t: t})
};

//接单
export const fetchAcceptSalesOrder = (salesOrderIds) => {
    return request(AcceptSalesOrderUrl, {
        salesOrderIds: salesOrderIds
    })
};

//发货
export const fetchDeliverySalesOrder = (salesOrderIds) => {
    return request(DeliverySalesOrderUrl, {
        salesOrderIds: salesOrderIds
    })
};

//订单详情
export const fetchSalesOrderDetail = (salesOrderId) => {
    return request(SalesOrderDetailUrl, {
        salesOrderId: salesOrderId
    })
};

//商品详情
export const fetchProductDetail = (productGlobalId) => {
    return request(ProductDetailUrl, {
        productGlobalId: productGlobalId
    })
};

//订单确认收款
export const fetchConfirmReceive = (salesOrderIds) => {
    return request(ConfirmReceiveUrl, {
        salesOrderIds: salesOrderIds
    })
};

//同意退款
export const fetchAgreeToRefund = (serviceOrderIds, allAmounts, payType) => {
    return request(AgreeToRefundlUrl, {
        ServiceOrderIds: serviceOrderIds,
        allAmounts: allAmounts,
        PayType: payType
    })
};

//拒绝退款
export const fetchRefusedToRefund = (serviceOrderIds) => {
    return request(RefusedToRefundUrl, {
        ServiceOrderIds: serviceOrderIds
    })
};

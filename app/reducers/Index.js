/**
 * Created by sencha on 2017/3/23.
 */
import {combineReducers} from 'redux';
import {nav, auth} from './ReduceNavigation';
import {currentEmployee, ReduceRegist, ReduceForgetPassword, ReduceCompanyType} from './ReduceEmployee';
import {ReduceSelectIndexRecommend,ReduceCities} from './ReduceBuyerIndex'
import {ReduceProviders, ReduceProvider} from './ReduceProvider';
import {
    ReduceLoderProducts,
    ReduceProduct,
    ReduceProductDetail,
    ReduceLoadReplenishProducts,
    ReduceReplenishProducts,
    ReduceLoadMallProducts,
    ReduceMallProducts,
    ReduceLoadMallAd,
    ReduceLoadMallAdPc,
    ReduceLoaderProductsByCategory,
    ReduceClassifyList,
} from './ReduceProduct';
import {
    ReducePurchaseOrders1,
    ReducePurchaseOrderDetail,
    ReducePurchaseOrders3,
    ReducePurchaseOrders4,
    ReducePurchaseOrders5,
    ReducePurchaseOrders7,
    ReducePurchaseOrderConfirm,
    ReduceSettleAccounts,
    ReducePurchasePaySuccess,
    ReduceCancelPurchaseOrder,
    ReduceQuickSignPurchaseOrder,
    ReduceDetailsInspectionPurchaseOrder,
    ReducePrintPurchaseOrder,
    ReduceToPayPurchaseOrder,
    ReduceCheckPayPassword,
    ReduceSettleAccount,
    ReduceConfirmPay,
    ReduceGetServiceorderdetail
} from './ReducePurchaseOrder';
import ReduceNum from './ReduceNum';
import ReduceText from './ReduceText';
import ReduceScale from './ReduceScale';
import {
    ReduceLoadShoppingCarts,
    ReduceInsertOrUpdateShoppingCart,
    ReduceDeleteShoppingCarts
} from './ReduceShoppingCarts';
import {ReduceCalculate} from './ReduceCalculate';
import {
    ReducePurchaseMyAmount,
    ReducePurchaseSendCode,
    ReducePurchasPayPassword,
    ReducePurchasAccountBank,
    ReducePurchasAccountInfo,
    ReducePurchasWithdrawalAdd,
    ReduceRecharge,
    ReduceUpdatePayPassword,
    ReduceUpdatePassword,
    ReduceUpdateSginPassword,
    ReduceGetCustomer,
    ReduceSellInfo,
    ReduceCompanyDescription,
    ReduceCompanyName,
    ReduceContactName,
    ReduceContactPhone,
    ReduceCompanyImages,
    ReduceBContactPhone,
    ReduceSetDeliver,
    ReduceDelivery,
    ReduceSetReplenish
} from './ReducePurchaseMy';
import {ReduceLoaderMarketPrices, ReducePriceTendency, ReduceMarketPrices} from './ReducePriceParity';
import {ReduceLoaderAlwaysBuy, ReduceAlwaysBuy} from './ReduceAlwaysBuy';
import {ReduceAddressManage, ReduceUpdateAddressManage, ReduceDeleteAddressManage} from './ReduceAddress';
import {ReduceServiceManage, ReduceHistoryServiceManage} from './ReduceService'
import {
    ReduceAccount,
    ReduceSettlementList,
    ReduceAccountDetail,
    ReduceAccounts,
    ReduceBBills,
    ReduceSSBills
} from './ReduceAccount';
import {ReduceLoadReplenish, ReduceReplenishCompanys} from './ReduceReplenish'
import {ReduceStoreInformation, ReduceStoreName, ReduceStoreIntroduction} from './ReduceStoreInformation';
import {ReduceTradeLogistics,} from './ReduceTradeLogistics';
import {ReduceCurrentPurchaseAmount,} from './ReduceCurrentPurchaseAmount';
import {ReduceLoaderWithdrawalDetail} from './ReduceWithdrawalDetail';
import {
    ReduceLoaderProductPurchaseAmount,
    ReduceProductPurchaseAmount,
    ReducePurchaseStatisticsChart,
    ReduceSellerPurchaseAmount,
    ReduceSellerStatisticsChart
} from './ReduceProductPurchaseAmount';
import {
    ReduceAcceptSalesOrder,
    ReduceDeliverySalesOrder,
    ReduceSalesOrderDetail,
    ReduceSellerSalesOrder1,
    ReduceSellerSalesOrder3,
    ReduceSellerSalesOrder5,
    ReduceSellerSalesOrder7,
    ReduceSellerProductDetail,
    ReduceConfirmReceive,
    ReduceAgreeToRefund,
    ReduceRefusedToRefund
} from './ReduceSellerSalesOrder';
import {
    ReduceSellerLodeProducts,
    ReduceSellerProduct,
    ReduceSellerProductSpecPrices,
    ReduceLoadActiveProducts,
    ReduceActiveProducts,
    ReducePostActiveProducts,
    ReduceSellerReplenishProducts,
    ReduceSellerUpdateReplenishProducts,
    ReduceEditDetail,
} from './ReduceSellerProduct'
import {
    ReduceSellerPriceGroup,
    ReduceKeepPriceGroup,
    ReduceKeepOnePriceGroup,
    ReduceDeletePriceGroup,
    ReduceDeleteOnePriceGroup,
    ReduceGetSellerBindCompanys,
    ReduceReviseBindCompanys
} from './ReducePriceGroup';
import {
    ReduceCustomer,
    ReduceGetSalesOrderSettle,
    ReduceOrderSettleList,
    ReduceOrderSettleListDetail
} from './ReduceShopDetail'
import {ReduceLoaderRetailPrice, ReduceRetailPrice, ReduceUpdateRetailPrice} from './ReduceRetailPrice'
import {ReduceLoadUploadImages, ReduceUploadImages,} from './ReduceUploadImages'
import {ReduceLoadPromotionProducts,ReducePromotionProduct,ReduceSellerPromotionDetail} from './ReduceSellerPromotion'

const AppReducer = combineReducers({
    ReduceSelectIndexRecommend:ReduceSelectIndexRecommend,
    ReduceCities:ReduceCities,
    ReduceEmployee: currentEmployee,
    ReduceProviders: ReduceProviders,
    ReduceProvider: ReduceProvider,
    ReduceLoderProducts: ReduceLoderProducts,
    ReducePurchaseOrders1: ReducePurchaseOrders1,
    nav: nav,
    auth: auth,
    num: ReduceNum,
    text: ReduceText,
    scale: ReduceScale,
    ReduceRegist: ReduceRegist,
    ReduceProduct: ReduceProduct,
    ReducePurchaseOrderDetail: ReducePurchaseOrderDetail,
    ReducePurchaseOrders3: ReducePurchaseOrders3,
    ReducePurchaseOrders4: ReducePurchaseOrders4,
    ReducePurchaseOrders5: ReducePurchaseOrders5,
    ReducePurchaseOrders7: ReducePurchaseOrders7,
    ReduceLoadShoppingCarts: ReduceLoadShoppingCarts,
    ReduceCalculate: ReduceCalculate,
    ReducePurchaseOrderConfirm: ReducePurchaseOrderConfirm,
    ReduceSettleAccounts: ReduceSettleAccounts,
    ReducePurchaseMyAmount: ReducePurchaseMyAmount,
    ReduceInsertOrUpdateShoppingCart: ReduceInsertOrUpdateShoppingCart,
    ReduceLoaderMarketPrices: ReduceLoaderMarketPrices,
    ReduceLoaderAlwaysBuy: ReduceLoaderAlwaysBuy,
    ReduceAddressManage: ReduceAddressManage,
    ReduceServiceManage: ReduceServiceManage,
    ReduceHistoryServiceManage: ReduceHistoryServiceManage,
    ReduceUpdateAddressManage: ReduceUpdateAddressManage,
    ReducePurchasePaySuccess: ReducePurchasePaySuccess,
    ReduceDeleteAddressManage: ReduceDeleteAddressManage,
    ReduceCancelPurchaseOrder: ReduceCancelPurchaseOrder,
    ReduceQuickSignPurchaseOrder: ReduceQuickSignPurchaseOrder,
    ReduceDetailsInspectionPurchaseOrder: ReduceDetailsInspectionPurchaseOrder,
    ReducePrintPurchaseOrder: ReducePrintPurchaseOrder,
    ReduceToPayPurchaseOrder: ReduceToPayPurchaseOrder,
    ReduceProductDetail: ReduceProductDetail,
    ReduceAccount: ReduceAccount,
    ReduceSettlementList: ReduceSettlementList,
    ReduceAccountDetail: ReduceAccountDetail,
    ReduceStoreInformation: ReduceStoreInformation,
    ReduceStoreName: ReduceStoreName,
    ReducePurchaseSendCode: ReducePurchaseSendCode,
    ReducePurchasPayPassword: ReducePurchasPayPassword,
    ReducePurchasAccountBank: ReducePurchasAccountBank,
    ReducePurchasAccountInfo: ReducePurchasAccountInfo,
    ReduceTradeLogistics: ReduceTradeLogistics,
    ReduceStoreIntroduction: ReduceStoreIntroduction,
    ReducePriceTendency: ReducePriceTendency,
    ReduceCurrentPurchaseAmount: ReduceCurrentPurchaseAmount,
    ReduceDeleteShoppingCarts: ReduceDeleteShoppingCarts,
    ReduceMarketPrices: ReduceMarketPrices,
    ReduceLoadReplenish: ReduceLoadReplenish,
    ReduceReplenishCompanys: ReduceReplenishCompanys,
    ReduceLoaderWithdrawalDetail: ReduceLoaderWithdrawalDetail,
    ReduceLoaderProductPurchaseAmount: ReduceLoaderProductPurchaseAmount,
    ReduceProductPurchaseAmount: ReduceProductPurchaseAmount,
    ReducePurchasWithdrawalAdd: ReducePurchasWithdrawalAdd,
    ReduceRecharge: ReduceRecharge,
    ReducePurchaseStatisticsChart: ReducePurchaseStatisticsChart,
    ReduceUpdatePayPassword: ReduceUpdatePayPassword,
    ReduceUpdatePassword: ReduceUpdatePassword,
    ReduceUpdateSginPassword: ReduceUpdateSginPassword,
    ReduceCheckPayPassword: ReduceCheckPayPassword,
    ReduceAlwaysBuy: ReduceAlwaysBuy,
    ReduceForgetPassword: ReduceForgetPassword,
    ReduceLoadReplenishProducts: ReduceLoadReplenishProducts,
    ReduceReplenishProducts: ReduceReplenishProducts,
    ReduceLoadMallProducts: ReduceLoadMallProducts,
    ReduceMallProducts: ReduceMallProducts,
    ReduceAccounts: ReduceAccounts,
    ReduceSettleAccount: ReduceSettleAccount,
    ReduceBBills: ReduceBBills,
    ReduceConfirmPay: ReduceConfirmPay,
    ReduceGetServiceorderdetail: ReduceGetServiceorderdetail,
    ReduceLoadMallAd:ReduceLoadMallAd,
    ReduceLoadMallAdPc:ReduceLoadMallAdPc,
    ReduceClassifyList:ReduceClassifyList,  //首页分类banner点击后跳转页面接口


    //卖家
    ReduceSellerSalesOrder1: ReduceSellerSalesOrder1,
    ReduceSellerSalesOrder3: ReduceSellerSalesOrder3,
    ReduceSellerSalesOrder5: ReduceSellerSalesOrder5,
    ReduceSellerSalesOrder7: ReduceSellerSalesOrder7,
    ReduceAcceptSalesOrder: ReduceAcceptSalesOrder,
    ReduceDeliverySalesOrder: ReduceDeliverySalesOrder,
    ReduceSalesOrderDetail: ReduceSalesOrderDetail,
    ReduceSellerLodeProducts: ReduceSellerLodeProducts,
    ReduceSellerProduct: ReduceSellerProduct,
    ReduceSellerProductSpecPrices: ReduceSellerProductSpecPrices,
    ReduceSellerPurchaseAmount: ReduceSellerPurchaseAmount,
    ReduceSellerStatisticsChart: ReduceSellerStatisticsChart,
    ReduceSellerPriceGroup: ReduceSellerPriceGroup,
    ReduceKeepPriceGroup: ReduceKeepPriceGroup,
    ReduceKeepOnePriceGroup: ReduceKeepOnePriceGroup,
    ReduceDeletePriceGroup: ReduceDeletePriceGroup,
    ReduceDeleteOnePriceGroup: ReduceDeleteOnePriceGroup,
    ReduceSellerProductDetail: ReduceSellerProductDetail,
    ReduceEditDetail:ReduceEditDetail,
    ReduceCustomer: ReduceCustomer,
    ReduceLoadActiveProducts: ReduceLoadActiveProducts,
    ReduceActiveProducts: ReduceActiveProducts,
    ReducePostActiveProducts: ReducePostActiveProducts,
    ReduceGetSellerBindCompanys: ReduceGetSellerBindCompanys,
    ReduceReviseBindCompanys: ReduceReviseBindCompanys,
    ReduceGetSalesOrderSettle: ReduceGetSalesOrderSettle,
    ReduceOrderSettleList: ReduceOrderSettleList,
    ReduceOrderSettleListDetail: ReduceOrderSettleListDetail,
    ReduceLoaderRetailPrice: ReduceLoaderRetailPrice,
    ReduceRetailPrice: ReduceRetailPrice,
    ReduceUpdateRetailPrice: ReduceUpdateRetailPrice,
    ReduceGetCustomer: ReduceGetCustomer,
    ReduceSellInfo: ReduceSellInfo,
    ReduceCompanyDescription: ReduceCompanyDescription,
    ReduceCompanyName: ReduceCompanyName,
    ReduceContactName: ReduceContactName,
    ReduceContactPhone: ReduceContactPhone,
    ReduceCompanyImages: ReduceCompanyImages,
    ReduceBContactPhone: ReduceBContactPhone,
    ReduceSetDeliver: ReduceSetDeliver,
    ReduceDelivery: ReduceDelivery,
    ReduceSSBills: ReduceSSBills,
    ReduceConfirmReceive: ReduceConfirmReceive,
    ReduceSellerReplenishProducts: ReduceSellerReplenishProducts,
    ReduceSellerUpdateReplenishProducts: ReduceSellerUpdateReplenishProducts,
    ReduceSetReplenish: ReduceSetReplenish,
    ReduceAgreeToRefund: ReduceAgreeToRefund,
    ReduceRefusedToRefund: ReduceRefusedToRefund,

    ReduceCompanyType: ReduceCompanyType,
    ReduceLoadUploadImages: ReduceLoadUploadImages,
    ReduceUploadImages: ReduceUploadImages,

    ReduceLoadPromotionProducts:ReduceLoadPromotionProducts,
    ReducePromotionProduct:ReducePromotionProduct,
    ReduceSellerPromotionDetail:ReduceSellerPromotionDetail,

    ReduceLoaderProductsByCategory:ReduceLoaderProductsByCategory
});

export default AppReducer
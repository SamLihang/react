import React, {Component, PropTypes} from "react";
import {addNavigationHelpers, StackNavigator} from "react-navigation";
import {connect} from "react-redux";

/*#region 引导页*/
import GuideView from "./containers/guideView/GuideView";
/*#endregion*/

/*#region 功能块*/
import CameraView from "./components/Camera";
import SearchPage from "./containers/SearchPage";
import SearchPageProducts from './containers/SearchPageProducts';
import PleaseLogin from './containers/PleaseLogin';
import MonthPicker from './components/MonthPicker';
import BillDetail from './containers/BillDetail';
import ServicePayable from './containers/ServicePayable';
import Amap from './containers/Amap';
/*#endregion*/

/*#region 买家*/
import BuyerIndex from "./containers/BuyerIndex";
import Login from "./containers/Login";
// import SelectCity from "./containers/buyer/address/SelectCity";  //选择城市
import Providers from "./containers/buyer/buyerPurchase/Providers";
import CompanyDetial from "./containers/buyer/CompanyDetail";
import ProductList from "./containers/buyer/buyerPurchase/ProductList";
import ClassifyList from "./containers/buyer/buyerPurchase/ClassifyList"
import AlwaysBuy from "./containers/buyer/AlwaysBuy";
import PurchaseOrderDetail from "./containers/buyer/purchaseOrder/Detail";
import PurchaseOrderList from "./containers/buyer/purchaseOrder/List";
import ProductDetail from "./containers/buyer/purchaseOrder/ProductDetail";
import PaySuccess from "./containers/buyer/PaySuccess";
import ConfirmOrder from "./containers/buyer/purchaseOrder/ConfirmOrder";
import AddAddress from "./containers/buyer/address/AddAddress";
import EditAddress from "./containers/buyer/address/EditAddress";
import CheckDetail from "./containers/buyer/purchaseOrder/CheckDetail";
import SelectCity from "./containers/SelectCity";   //选择城市
import AboutUs from "./containers/buyer/my/AboutUs";
import SetUp from "./containers/buyer/my/SetUp";
import RevisePayPassword from "./containers/buyer/my/RevisePayPassword";
import CommonProblem from "./containers/buyer/my/problem/CommonProblem";
import LoginProblem from "./containers/buyer/my/problem/LoginProblem";
import StoreInformation from "./containers/buyer/my/StoreInformation";
import StoreIntroduction from "./containers/buyer/my/StoreIntroduction";
import StoreName from "./containers/buyer/my/StoreName";
import UpdateContact from "./containers/buyer/my/UpdateContact";
import UpdatePhone from "./containers/buyer/my/UpdatePhone";
import AccountPay from "./containers/buyer/accountperiod/AccountPay";
import SettlementList from "./containers/buyer/accountperiod/SettlementList";
import AccountDetail from "./containers/buyer/accountperiod/AccountDetail";
import TradeLogistics from "./containers/buyer/my/TradeLogistics";
import PriceParity from "./containers/buyer/priceParity/PriceParity";
import AddressList from "./containers/buyer/address/AddressList";
import MyAmount from "./containers/buyer/my/MyAmount";
import MyBill from "./containers/buyer/my/MyBill";
import ReCharge from "./containers/buyer/my/ReCharge";
import TakeCash from "./containers/buyer/my/TakeCash";
import WithdrawalsDetails from "./containers/buyer/my/WithdrawalsDetails";
import PriceTendency from "./containers/buyer/priceParity/PriceTendency";
import SetCashPassword from "./containers/buyer/my/SetCashPassword";
import ReviseLoginPassword from "./containers/buyer/my/ReviseLoginPassword";
import ReviseCheckPassword from "./containers/buyer/my/ReviseCheckPassword";
import CashAccount from "./containers/buyer/my/CashAccount";
import ChooseCalender from "./components/ChooseCalender";
import Cart from "./containers/buyer/shoppingCart/Cart";
import ReviseAccountProblem from "./containers/buyer/my/problem/ReviseAccountProblem";
import PayProblem from "./containers/buyer/my/problem/PayProblem";
import CapitalSafetyInstructions from "./containers/buyer/my/problem/CapitalSafetyInstructions";
import LookUpProblem from "./containers/buyer/my/problem/LookUpProblem";
import PasswordProblem from "./containers/buyer/my/problem/PasswordProblem";
import PurchaseProblem from "./containers/buyer/my/problem/PurchaseProblem";
import CancelProblem from "./containers/buyer/my/problem/CancelProblem";
import OrderProblem from "./containers/buyer/my/problem/OrderProblem";
import CancelOrderProblem from "./containers/buyer/my/problem/CancelOrderProblem";
import RechargeProblem from "./containers/buyer/my/problem/RechargeProblem";
import TakeCashProblem from "./containers/buyer/my/problem/TakeCashProblem";
import TimeProblem from "./containers/buyer/my/problem/TimeProblem";
import LookOrderProblem from "./containers/buyer/my/problem/LookOrderProblem";
import BalanceProblem from "./containers/buyer/my/problem/BalanceProblem";
import NotAccount from "./containers/buyer/my/NotAccount";
import ReplenishCompanys from "./containers/buyer/buyerReplenish/ReplenishCompanys";
import ProductPurchaseAmount from "./containers/buyer/my/statistics/ProductPurchaseAmount";
import CurrentPurchaseAmount from "./containers/buyer/my/statistics/CurrentPurchaseAmount";
import PurchaseStatisticsChart from "./containers/buyer/my/statistics/PurchaseStatisticsChart";
import ForgetPassword from "./containers/ForgetPassword";
import ReplenishProducts from './containers/buyer/buyerReplenish/ReplenishProducts';
import Agreement from './containers/Agreement'
import DevelopmentPage from './containers/DevelopmentPage';
import MallProducts from './containers/buyer/buyerMallProducts/MallProducts';
import AccountPayable from './containers/buyer/accountperiod/AccountPayable';
import PriceParitySearch from './containers/buyer/priceParity/PriceParitySearch';
import SellerOrderSearch from './containers/buyer/purchaseOrder/SellerOrderSearch';
import ApplyService from './containers/buyer/service/ApplyService';
import PrintSetup from "./containers/buyer/my/PrintSetup";
import ServiceDetail from './containers/buyer/service/ServiceDetail';
import ServiceList from './containers/buyer/service/ServiceList';

/*#endregion*/

/*#region 卖家*/
import SellerIndex from "./containers/SellerIndex";
import AddProduct1 from "./containers/seller/product/AddProduct1";
import AddProduct2 from "./containers/seller/product/AddProduct2";
import AddProduct3 from "./containers/seller/product/AddProduct3";
import SellerList from "./containers/seller/order/List";

import SellerList1 from "./containers/seller/order/List1";
import SellerList3 from "./containers/seller/order/List3";
import SellerList5 from "./containers/seller/order/List5";
import SellerList7 from "./containers/seller/order/List7";

import SellerDetail1 from "./containers/seller/order/Detail1";
import SellerDetail2 from "./containers/seller/order/Detail2";
import SellerDetail3 from "./containers/seller/order/Detail3";
import SellerDetail4 from "./containers/seller/order/Detail4";
import BuyerOrSeller from "./containers/guideView/BuyerOrSeller";
import SellerMy from "./containers/seller/my/My";
import Authenticate from "./containers/seller/my/Authenticate";
import SellerSetUp from "./containers/seller/my/SetUp";
import PriceGroupEdit from "./containers/seller/priceGroup/PriceGroupEdit";
import PriceGroupManage from "./containers/seller/priceGroup/PriceGroupManage";
import Products from "./containers/seller/product/Products";
import BindCustomer from "./containers/seller/priceGroup/BindCustomer";
import AccountList from "./containers/seller/account/AccountList";
import SellerStatisticsChart from "./containers/seller/orderManagement/SellerStatisticsChart";
import ShopDetails from "./containers/seller/account/ShopDetails";
import ProductDetails from "./containers/seller/order/ProductDetails";
import EditProductInformation from  "./containers/seller/order/EditProductInformation"
import RetailPrice from "./containers/seller/changePrice/RetailPrice";
import SellerAccountDetail from "./containers/seller/account/AccountDetail";
import MyCustomer from "./containers/seller/my/MyCustomer";
import ChangeDiscount from "./containers/seller/changeDiscount/ChangeDiscount";
import SellerStoreInformation from "./containers/seller/my/StoreInformation";
import SellerStoreIntroduction from "./containers/seller/my/StoreIntroduction";
import SellerStoreName from "./containers/seller/my/StoreName";
import SellerUpdateContact from "./containers/seller/my/UpdateContact";
import SellerUpdatePhone from "./containers/seller/my/UpdatePhone";
import SellerUpdateBusinessLicense from "./containers/seller/my/UpdateBusinessLicense";
import SellerDetail5 from "./containers/seller/order/Detail5";
import SellerBill from "./containers/seller/account/SellerBill";
import SellerMyAmount from "./containers/seller/my/SellerMyAmount";
import BluetoothSerial from "./components/Bluetooth";
import SellerMessages from './containers/seller/my/SellerMessages';
import ProductsSearch from './containers/seller/product/ProductsSearch';
import AddProduct1Search from './containers/seller/product/AddProduct1Search';
import RetailPriceSearch from './containers/seller/changePrice/RetailPriceSearch';
import ServiceManagement from './containers/seller/sellerService/ServiceManagement';
import HistoricalService from './containers/seller/sellerService/HistoricalService';
import SellerServiceDetail from './containers/seller/sellerService/ServiceDetail';
import SellerServiceDetail2 from './containers/seller/sellerService/ServiceDetail2';
import SellerServiceDetail3 from './containers/seller/sellerService/ServiceDetail3';
import SellerReplenishProducts from './containers/seller/sellerReplenish/SellerReplenishProducts';
import SellerReplenishProductsSearch from './containers/seller/sellerReplenish/SellerReplenishProductsSearch';
import DeliveryFee from "./containers/seller/my/DeliveryFee";
import ReplenishFee from "./containers/seller/my/ReplenishFee";
import FareScale from "./containers/seller/my/FareScale";
import SalesPromotion from "./containers/seller/Sales/SalesPromotion";
import PromotionDetails from "./containers/seller/Sales/PromotionDetails";
/*#endregion*/

export const AppNavigator = StackNavigator({
    GuideView: {screen: GuideView},

    /*#region 买家*/
    SellerIndex: {screen: SellerIndex},
    SelectCity:{screen: SelectCity},   //选择城市
    AlwaysBuy: {screen: AlwaysBuy},
    BuyerIndex: {screen: BuyerIndex},
    Login: {screen: Login},
    Providers: {screen: Providers},
    ProductList: {screen: ProductList},
    ClassifyList:{screen:ClassifyList},
    SearchPage: {screen: SearchPage},
    CompanyDetial: {screen: CompanyDetial},
    PurchaseOrderDetail: {screen: PurchaseOrderDetail},
    PurchaseOrderList: {screen: PurchaseOrderList},
    ProductDetail: {screen: ProductDetail},
    PaySuccess: {screen: PaySuccess},
    ConfirmOrder: {screen: ConfirmOrder},
    AddAddress: {screen: AddAddress},
    EditAddress: {screen: EditAddress},
    CheckDetail: {screen: CheckDetail},
    // SelectCity: {screen: SelectCity},
    AboutUs: {screen: AboutUs},
    SetUp: {screen: SetUp},
    RevisePayPassword: {screen: RevisePayPassword},
    CommonProblem: {screen: CommonProblem},
    LoginProblem: {screen: LoginProblem},
    StoreInformation: {screen: StoreInformation},
    StoreIntroduction: {screen: StoreIntroduction},
    StoreName: {screen: StoreName},
    UpdateContact: {screen: UpdateContact},
    UpdatePhone: {screen: UpdatePhone},
    AccountPay: {screen: AccountPay},
    SettlementList: {screen: SettlementList},
    AccountDetail: {screen: AccountDetail},
    TradeLogistics: {screen: TradeLogistics},
    PriceParity: {screen: PriceParity},
    AddressList: {screen: AddressList},
    MyAmount: {screen: MyAmount},
    MyBill: {screen: MyBill},
    TakeCash: {screen: TakeCash},
    PriceTendency: {screen: PriceTendency},
    ReCharge: {screen: ReCharge},
    WithdrawalsDetails: {screen: WithdrawalsDetails},
    SetCashPassword: {screen: SetCashPassword},
    ReviseLoginPassword: {screen: ReviseLoginPassword},
    ReviseCheckPassword: {screen: ReviseCheckPassword},
    CashAccount: {screen: CashAccount},
    ChooseCalender: {screen: ChooseCalender},
    Cart: {screen: Cart},
    ReviseAccountProblem: {screen: ReviseAccountProblem},
    PayProblem: {screen: PayProblem},
    CapitalSafetyInstructions: {screen: CapitalSafetyInstructions},
    LookUpProblem: {screen: LookUpProblem},
    PasswordProblem: {screen: PasswordProblem},
    PurchaseProblem: {screen: PurchaseProblem},
    CancelProblem: {screen: CancelProblem},
    OrderProblem: {screen: OrderProblem},
    CancelOrderProblem: {screen: CancelOrderProblem},
    RechargeProblem: {screen: RechargeProblem},
    TakeCashProblem: {screen: TakeCashProblem},
    TimeProblem: {screen: TimeProblem},
    LookOrderProblem: {screen: LookOrderProblem},
    BalanceProblem: {screen: BalanceProblem},
    NotAccount: {screen: NotAccount},
    ReplenishCompanys: {screen: ReplenishCompanys},
    CurrentPurchaseAmount: {screen: CurrentPurchaseAmount},
    PurchaseStatisticsChart: {screen: PurchaseStatisticsChart},
    ForgetPassword: {screen: ForgetPassword},
    ReplenishProducts: {screen: ReplenishProducts},
    Agreement: {screen: Agreement},
    DevelopmentPage: {screen: DevelopmentPage},
    MallProducts: {screen: MallProducts},
    AccountPayable: {screen: AccountPayable},
    SearchPageProducts: {screen: SearchPageProducts},
    PriceParitySearch: {screen: PriceParitySearch},
    SellerOrderSearch: {screen: SellerOrderSearch},
    ApplyService: {screen: ApplyService},
    PrintSetup: {screen: PrintSetup},
    ServiceDetail: {screen: ServiceDetail},
    ServiceList: {screen: ServiceList},

    /*#endregion*/

    /*#region 卖家*/
    AddProduct1: {screen: AddProduct1},
    AddProduct2: {screen: AddProduct2},
    AddProduct3: {screen: AddProduct3},
    SellerList: {screen: SellerList},
    ProductPurchaseAmount: {screen: ProductPurchaseAmount},
    SellerList1: {screen: SellerList1},
    SellerList3: {screen: SellerList3},
    SellerList5: {screen: SellerList5},
    SellerList7: {screen: SellerList7},
    SellerDetail1: {screen: SellerDetail1},
    SellerDetail2: {screen: SellerDetail2},
    SellerDetail3: {screen: SellerDetail3},
    SellerDetail4: {screen: SellerDetail4},
    BuyerOrSeller: {screen: BuyerOrSeller},
    SellerMy: {screen: SellerMy},
    Authenticate: {screen: Authenticate},
    SellerSetUp: {screen: SellerSetUp},
    PriceGroupEdit: {screen: PriceGroupEdit},
    PriceGroupManage: {screen: PriceGroupManage},
    Products: {screen: Products},
    BindCustomer: {screen: BindCustomer},
    SellerStatisticsChart: {screen: SellerStatisticsChart},
    AccountList: {screen: AccountList},
    ShopDetails: {screen: ShopDetails},
    ProductDetails: {screen: ProductDetails},
    EditProductInformation:{screen:EditProductInformation},
    RetailPrice: {screen: RetailPrice},
    SellerAccountDetail: {screen: SellerAccountDetail},
    MyCustomer: {screen: MyCustomer},
    ChangeDiscount: {screen: ChangeDiscount},
    SellerStoreInformation: {screen: SellerStoreInformation},
    SellerStoreIntroduction: {screen: SellerStoreIntroduction},
    SellerStoreName: {screen: SellerStoreName},
    SellerUpdateContact: {screen: SellerUpdateContact},
    SellerUpdatePhone: {screen: SellerUpdatePhone},
    SellerUpdateBusinessLicense: {screen: SellerUpdateBusinessLicense},
    SellerDetail5: {screen: SellerDetail5},
    SellerMyAmount: {screen: SellerMyAmount},
    BluetoothSerial: {screen: BluetoothSerial},
    SellerMessages: {screen: SellerMessages},
    ProductsSearch: {screen: ProductsSearch},
    AddProduct1Search: {screen: AddProduct1Search},
    RetailPriceSearch: {screen: RetailPriceSearch},
    SellerBill: {screen: SellerBill},
    ServiceManagement: {screen: ServiceManagement},
    HistoricalService: {screen: HistoricalService},
    SellerServiceDetail: {screen: SellerServiceDetail},
    SellerServiceDetail2: {screen: SellerServiceDetail2},
    SellerServiceDetail3: {screen: SellerServiceDetail3},
    SellerReplenishProducts: {screen: SellerReplenishProducts},
    SellerReplenishProductsSearch: {screen: SellerReplenishProductsSearch},
    DeliveryFee: {screen: DeliveryFee},
    ReplenishFee: {screen: ReplenishFee},
    FareScale: {screen: FareScale},
    SalesPromotion: {screen: SalesPromotion},
    PromotionDetails:{screen: PromotionDetails},
    /*#endregion*/

    /*#region 功能页*/
    CameraView: {screen: CameraView},
    PleaseLogin: {screen: PleaseLogin},
    MonthPicker: {screen: MonthPicker},
    BillDetail: {screen: BillDetail},
    ServicePayable: {screen: ServicePayable},
    Amap:{screen: Amap}
    /*#endregion*/

});

/*const AppWithNavigationState=({dispatch,nav})=>(
 <AppNavigator navigation={addNavigationHelpers({dispatch,state:nav})}/>
 )*/

class AppWithNavigationState extends Component {
    render() {
        return (
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav
            })}/>
        )
    }
}

AppWithNavigationState.protoTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState)
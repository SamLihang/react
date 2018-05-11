/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const AddressUpdateUrl = '/ReactPurchaseOrderAddress/InsertOrUpdateAddress';
const AddressDeleteUrl = '/ReactPurchaseOrderAddress/DeleteAddress';


//我的收货地址修改
export const fetchUpdateAddress = ({PurchaseOrderAddressId,ContactName,Phone,Address}) => {
    return request(AddressUpdateUrl,{PurchaseOrderAddressId,ContactName,Phone,Address})
};
//新增收货地址
export const fetchInsertAddress = (item) => {
    return request(AddressUpdateUrl,item)
};

//新增收货地址
export const fetchDeleteAddress = ({AddressId}) => {
    return request(AddressDeleteUrl,{AddressId})
};
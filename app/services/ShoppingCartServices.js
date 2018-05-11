/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const LoaderShoppingCarts = '/BclShoppingCart/ShoppingCarts';
const InsertOrUpdateShoppingCart = '/ReactShoppingCart/InsertOrUpdateShoppingCart';
const DeleteShoppingCarts='/ReactShoppingCart/DeleteShoppingCarts';

export const fetchShoppingCarts = () => {
    return request(LoaderShoppingCarts, {})
};

export const fetchInsertOrUpdateShoppingCart = (cartDatas) => {
    return request(InsertOrUpdateShoppingCart, cartDatas)
};
export const fetchDeleteShoppingCarts=(shoppingCartIds)=>{
    return request(DeleteShoppingCarts,{
        shoppingCartIds:shoppingCartIds
    })
};
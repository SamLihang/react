/**
 * Created by sencha on 2017/4/11.
 */
import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {
    fetchShoppingCarts,
    fetchInsertOrUpdateShoppingCart,
    fetchDeleteShoppingCarts
} from '../services/ShoppingCartServices';

export function ActionShoppingCarts() {
    return (dispatch) => {
        //dispatch({'type': Types.RequestShoppingCartStart});
        fetchShoppingCarts().then((ret) => {
            //toastLong.alert(ret);
            dispatch({'type': Types.RequestShoppingCartEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestShoppingCartError, error: e});
        });
    }
}


export function ActionInsertOrUpdateShoppingCart(cartDatas) {
    return (dispatch) => {
        //dispatch({'type': Types.RequestInsertOrUpdateShoppingCartStart});
        fetchInsertOrUpdateShoppingCart(cartDatas).then((ret) => {
            dispatch({'type': Types.RequestInsertOrUpdateShoppingCartEnd, data: ret.data, error: ret.error});
        }).catch((e) => {
            dispatch({'type': Types.RequestInsertOrUpdateShoppingCartError, error: e});
        });
    }
}

export function ActionDeleteShoppingCarts(shoppingCartIds) {
    return (dispatch) => {
        dispatch({'type': Types.RequestDeleteShoppingCartsStart});
        fetchDeleteShoppingCarts(shoppingCartIds).then((ret) => {
            dispatch({'type': Types.RequestDeleteShoppingCartsEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestDeleteShoppingCartsError, error: e});
        });
    }
}

export let DeleteCar = (shoppingCartIds) => {
    return (dispatch) => {
        dispatch(DeleteShopcarList(shoppingCartIds));

    }
};
let DeleteShopcarList = (shoppingCartIds) => {
    return {
        type: Types.ShoppingCartSelect,
        shoppingCartId: shoppingCartIds,
    };
};
//采购加入购物车
export let UpdateCar = (cartDatas) => {
    return (dispatch) => {
        dispatch(UpdateCarShopcarList(cartDatas));

    }
};
let UpdateCarShopcarList = (cartDatas) => {
    return {
        type: Types.UpdateShoppingCart,
        cartDatas,
    };
};
//常购加入购物车
export let UpdateAlwaysCar = (cartDatas) => {
    return (dispatch) => {
        dispatch(UpdateAlwaysShopcarList(cartDatas));

    }
};
let UpdateAlwaysShopcarList = (cartDatas) => {
    return {
        type: Types.UpdateAlwaysShoppingCart,
        cartDatas,
    };
};



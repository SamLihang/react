import {toastLong} from '../utils/ToastUtil'
import * as Types from './Types';
import {fetchLoaderRetailPrice, fetchRetailPrice, fetchUpdateRetailPrice} from '../services/RetailPriceServices';
//加载时有类别
export function ActionLoaderRetailPrice() {
    return (dispatch) => {
        //dispatch({'type': Types.RequestPriceParityStart});
        fetchLoaderRetailPrice().then((ret) => {
            dispatch({'type': Types.RequestLoaderRetailPriceEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestLoaderRetailPriceError, error: e});
        });
    }
}
//分页
export function ActionRetailPrice({p, parentCategoryId, categoryId, searchKey}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestRetailPriceStart});
        fetchRetailPrice({p, parentCategoryId, categoryId, searchKey}).then((ret) => {
            dispatch({'type': Types.RequestRetailPriceEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestRetailPriceError, error: e});
        });
    }
}
//修改
export function ActionUpdateRetailPrice({productGlobalId, SpecId, price}) {
    return (dispatch) => {
        dispatch({'type': Types.RequestUpdateRetailPriceStart});
        fetchUpdateRetailPrice({productGlobalId, SpecId, price}).then((ret) => {
            dispatch({'type': Types.RequestUpdateRetailPriceEnd, data: ret.data});
        }).catch((e) => {
            dispatch({'type': Types.RequestUpdateRetailPriceError, error: e});
        });
    }
}
//改价格
export let EditPrice=({productGlobalId, SpecId, price})=>{
    return (dispatch) => {
        dispatch(EditPriceList({productGlobalId, SpecId, price}));
    }
};
let EditPriceList = ({productGlobalId, SpecId, price}) => {
    return {
        type:Types.EditRetailPrice,
        productGlobalId: productGlobalId,
        SpecId:SpecId,
        price:price,
    };
};


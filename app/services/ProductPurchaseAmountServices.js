import {request} from '../utils/RequestUtil';
const LoaderProductPurchaseAmountUrl = '/ReactCategory/LoadCategoryNew';
const ProductPurchaseAmountUrl = '/ReactPurchaseStatistics/ProductPurchaseToday';

export const fetchLoaderProductPurchaseAmount= () => {
    return request(LoaderProductPurchaseAmountUrl)
};

export const fetchProductPurchaseAmount= ({p,parentCategoryId,day}) => {
    return request(ProductPurchaseAmountUrl, {
        p: p,
        parentCategoryId: parentCategoryId,
        day: day,
    })
};
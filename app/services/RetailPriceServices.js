import {request} from '../utils/RequestUtil';
const LoaderRetailPriceUrl = '/ReactSellerProduct/LoadBindProducts';
const RetailPriceUrl = '/ReactSellerProduct/BindProducts';
const UpdateRetailPriceUrl = '/ReactSellerProduct/UpdateProductPrice';

export const fetchLoaderRetailPrice = () => {
    return request(LoaderRetailPriceUrl)
};

export const fetchRetailPrice = ({p, parentCategoryId, categoryId, searchKey}) => {
    return request(RetailPriceUrl, {
        p: p,
        parentCategoryId: parentCategoryId,
        categoryId: categoryId,
        searchKey: searchKey,
    })
};
export const fetchUpdateRetailPrice = ({productGlobalId, SpecId, price}) => {
    return request(UpdateRetailPriceUrl, {
        productGlobalId: productGlobalId,
        SpecId: SpecId,
        price: price,
    })
};


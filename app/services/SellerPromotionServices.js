import {request} from '../utils/RequestUtil';

const  LoadPromotionProductsUrl= '/BclPromotions/LoadPromotionProducts';
const  PromotionProductsUrl = '/BclPromotions/PromotionProducts';
const  PromotionProductDetailUrl = '/BclPromotions/GetPromotionProductDetail';
const  PostActiveProductsUrl = '/BclPromotions/CancelPromotionProducts';
const  AddPromotionProductUrl = '/BclPromotions/AddPromotionProduct';

export const fetchLoadPromotionProducts = (IsPromotion) => {
    return request(LoadPromotionProductsUrl, {IsPromotion})
};

export const fetchPromotionProducts = ({parentCategoryId, categoryId, p, IsPromotion, searchKey}) => {
    return request(PromotionProductsUrl, {
        p, IsPromotion, parentCategoryId, categoryId, searchKey
    })
};

export const fetchPromotionProductDetail = (productGlobalId) => {
    return request(PromotionProductDetailUrl, {
        productGlobalId: productGlobalId
    })
};

export const fetchPostActiveProducts = ({productGlobalIds}) => {
    return request(PostActiveProductsUrl, {
        productGlobalIds
    })
};

export const fetchAddPromotionProduct = ({ProductGlobalId,PromotionBegin,PromotionEnd,Specs}) => {
    return request(AddPromotionProductUrl, {
        ProductGlobalId,PromotionBegin,PromotionEnd,Specs
    })
};
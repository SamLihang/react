/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';

const LoaderProductsUrl = '/ReactSellerProduct/LoadProducts';
const ProductsUrl = '/ReactSellerProduct/Products';
const ProductSpecPrices = '/ReactSellerProduct/ProductSpecPrices';
const LoadActiveProductsUrl = '/ReactSellerProduct/LoadActiveProducts';
const ActiveProductsUrl = '/BclSellerProduct/AllProducts';  //获取已上架商品信息
const PostActiveProductsUrl = '/ReactSellerProduct/PostActiveProducts';
const PublishProductUrl = '/ReactSellerProduct/PublishProduct';
const DeleteProductsUrl = '/ReactSellerProduct/DeleteProducts';
const SellerReplenishProductsUrl = '/ReactSellerProduct/ReplenisProducts';
const UpdateSellerReplenishProductsUrl = '/ReactSellerProduct/UpdateReplenisProducts';
const EditDetailUrl = '/BclSellerProduct/EditDetail'; //编辑商品信息
const UpdateProductDetailUrl = '/BclSellerProduct/UpdateProductDetail'; //提交商品信息

//商品发布
export const fetchLoaderProducts = () => {
    return request(LoaderProductsUrl)
};

export const fetchProducts = ({parentCategoryId, categoryId, p, searchKey}) => {
    return request(ProductsUrl, {
        parentCategoryId, categoryId, p, searchKey
    })
};

//商品详情
export const fetchProductSpecPrices = (productGlobalId) => {
    return request(ProductSpecPrices, {
        productGlobalId
    })
};

//发布商品
//productSpecPriceStrs :{"Items":[{"ProductGlobalId":1, "CompanyId":1, "SpecId":1, "Price":2.5,}]}
export const fetchPublishProduct = (objStr) => {
    return request(PublishProductUrl, objStr)
};

//上下架
export const fetchLoadActiveProducts = (isActive) => {
    return request(ActiveProductsUrl, {isActive})
};

export const fetchActiveProducts = ({parentCategoryId, categoryId, p, isActive, searchKey}) => {
    return request(ActiveProductsUrl, {
        p, isActive, parentCategoryId, categoryId, searchKey
    })
};

export const fetchPostActiveProducts = ({productGlobalIds, isActive}) => {
    return request(PostActiveProductsUrl, {
        isActive, productGlobalIds
    })
};

//删除商品
export const fetchDeleteProducts = (obj) => {
    return request(DeleteProductsUrl, obj)
};

//卖家补货
export const fetchSellerReplenishProducts = ({parentCategoryId, categoryId, p, IsReplenish, searchKey}) => {
    return request(SellerReplenishProductsUrl, {
        p, IsReplenish, parentCategoryId, categoryId, searchKey
    })
};

export const fetchSellerUpdateReplenishProducts = ({productGlobalIds, IsReplenish}) => {
    return request(UpdateSellerReplenishProductsUrl, {
        IsReplenish, productGlobalIds
    })
};

//编辑商品信息（商品编辑）
export const fetchEditDetail = (productGlobalId) => {
    return request(EditDetailUrl, {
        productGlobalId
    })
};
//提交商品信息（商品编辑）
export const fetchUpdateProductDetail = (objStr) => {
    return request(UpdateProductDetailUrl, objStr
    )
};

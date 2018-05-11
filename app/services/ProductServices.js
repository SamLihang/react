/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const LoaderProductsUrl = '/BclBuyerProductList/LoaderProducts';
const LoadProviderProductsUrl = '/BclBuyerProduct/LoadProviderProducts';

const ProductsUrl = '/BclBuyerProduct/Products';
const ProductDetailUrl = '/BclBuyerProductList/Product';
const LoadReplenishProductsUrl = '/BclBuyerProductList/LoadReplenishProducts';
const ReplenishProductsUrl = '/BclBuyerProductList/ReplenishProducts';
const LoadMallProductsUrl = '/BclBuyerProductList/LoadMallProducts';
const MallProductsUrl = '/BclBuyerProductList/MallProducts';

const LoadMallAdUrl='/ReactAD/GetAD';
const LoadMallAdPcUrl='/ReactAD/GetAD';

const SearchProductUrl='/BclBuyerProduct/SearchProduct2'; //首页搜索接口
const SearchGetHotKeysUrl='/BclSearchKey/GetHotKeys'; //首页搜索页热搜获取接口
const ProductsCategoryUrl= '/BclBuyerProduct/getCompanyCategory'; //获取商品种类
const SearchAddHotKeyUrl='/BclSearchKey/AddHotKey'; //首页搜索页热搜上传接口

const ClassifyListUrl='/BclBuyingProduct/CategoryAndRecommend2';//首页分类banner点击后跳转页面分类接口
const ClassifyListItemsUrl='/BclBuyingProduct/ProductContainsCarts2';//首页分类banner点击后跳转页面Items接口（小图）

//采购
export const fetchLoaderProducts = ({productType, sCompanyId}) => {
    return request(LoaderProductsUrl, {
        productType: productType,
        sCompanyId: sCompanyId
    })
};
export const fetchLoadProviderProductsUrl = ({productType, sCompanyId, categoryId,parentCategoryId, productGlobalId}) => {
    return request(LoadProviderProductsUrl, {
        productType: productType,
        sCompanyId: sCompanyId,
        categoryId:categoryId,
        parentCategoryId:parentCategoryId,
        productGlobalId:productGlobalId
    })
};

//采购
export const fetchProducts = (cartDatas) => {
    return request(ProductsUrl, cartDatas)
};

//商品详情
export const fetchProductDetail = ({productGlobalId, companyId, productType}) => {
    return request(ProductDetailUrl, {
        productGlobalId: productGlobalId,
        companyId: companyId,
        productType: productType,
    })
};

//补货
export const fetchLoadReplenishProducts = ({productType, sCompanyId}) => {
    return request(LoadReplenishProductsUrl, {
        productType: productType,
        sCompanyId: sCompanyId
    })
};

//补货
export const fetchReplenishProducts = (cartDatas) => {
    return request(ReplenishProductsUrl, cartDatas)
};

//自营
export const fetchLoadMallProducts = (AreaId) => {
    return request(LoadMallProductsUrl,AreaId)
};

//自营
export const fetchMallProducts = (cartDatas) => {
    return request(MallProductsUrl, cartDatas)
};

//自营广告
export const fetchLoadMallAd = ({type}) => {
    return request(LoadMallAdUrl,{type:type})
};

//轮播
export const fetchLoadMallAdPc = ({type}) => {
    return request(LoadMallAdPcUrl,{type:type})
};
//搜索
export const fetchSearchProduct = ({searchKey,p,CompanyId,sellerCompanyId,pageSize,minPrice,maxPrice,productCategoryId,parentProductCategoryId,productType,orderBy,isMall}) => {
    return request(SearchProductUrl, {
        searchKey: searchKey,
        p: p,
        CompanyId: CompanyId,
        sellerCompanyId:sellerCompanyId,
        pageSize:pageSize,
        minPrice:minPrice,
        maxPrice:maxPrice,
        productCategoryId:productCategoryId,
        parentProductCategoryId:parentProductCategoryId,
        productType:productType,
        orderBy:orderBy,
        isMall:isMall})
};

//热搜词获取
export const fetchSearchGetHotKeys = () => {
    return request(SearchGetHotKeysUrl)
};

export const fetchProductsCategory = () =>{
    return request(ProductsCategoryUrl)
}

//热搜词上传
export const fetchSearchAddHotKey = (key) => {
    return request(SearchAddHotKeyUrl,{key:key})
};

//首页分类banner点击后跳转页面接口
export const fetchClassifyList = (category) => {
    return request(ClassifyListUrl, { categoryId: category.categoryId})
};

//首页分类banner点击后跳转页面Items接口+购物车
export const fetchClassifyListItems = (para) => {
    return request(ClassifyListItemsUrl, para)
};






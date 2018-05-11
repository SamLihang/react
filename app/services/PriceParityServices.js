import {request} from '../utils/RequestUtil';
const LoaderMarketPricesUrl = '/ReactMarket/LoadMarketPrices';
const MarketPricesUrl = '/ReactMarket/MarketPrices';
const PriceTendencyUrl = '/ReactMarket/MarketPrice';

export const fetchLoaderMarketPrices = () => {
    return request(LoaderMarketPricesUrl)
};

export const fetchMarketPrices = ({pCategoryId, p, searchKey}) => {
    return request(MarketPricesUrl, {
        pCategoryId: pCategoryId,
        p: p,
        searchKey: searchKey,
    })
};

//每天价格变化
export const fetchPriceTendency = ({productGlobalId}) => {
    return request(PriceTendencyUrl, {productGlobalId})
};
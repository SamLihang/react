import {request} from '../utils/RequestUtil';
const LoaderAlwaysBuyUrl = '/BclAlwaysBuy/LoadAlwaysBuys';
const AlwaysBuysUrl = '/BclAlwaysBuy/AlwaysBuys';
const DeleteAlwaysBuyProduct = '/BclAlwaysBuy/DeleteAlwaysBuyProductNew';


export const fetchLoaderAlwaysBuy = (p, categoryId, searchaKey) => {
    return request(LoaderAlwaysBuyUrl, {p: p, categoryId: categoryId, searchaKey: searchaKey})
};

export const fetchAlwaysBuy = (p, categoryId, searchKey) => {
    return request(AlwaysBuysUrl, {p: p, categoryId: categoryId, searchKey: searchKey})
};

export const fetchDeleteAlwaysBuyProduct = (productGlobalIds) => {
    return request(DeleteAlwaysBuyProduct, {productGlobalIds: productGlobalIds})
};

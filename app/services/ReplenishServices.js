/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const LoadReplenishUrl = '/ReactProvider/LoaderReplenishCompanys2';
const ReplenishCompanysUrl = '/ReactProvider/ReplenishCompanys2';


export const fetchLoadReplenishUrl = () => {
    return request(LoadReplenishUrl)
}

export const fetchReplenishCompanys = (categoryId) => {
    return request(ReplenishCompanysUrl, {
        categoryId: categoryId,
    })
}

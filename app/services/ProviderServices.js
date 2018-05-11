/**
 * Created by sencha on 2017/4/7.
 */
import {request} from '../utils/RequestUtil';
const ProvidersUrl='/ReactProvider/Providers';
const ProviderUrl='/ReactProvider/Provider';

export const fetchProviders=({searchKeyInput})=>{
    return request(ProvidersUrl,{searchKey:searchKeyInput})
}

export const fetchProvider=({bCompanyId,sCompanyId})=>{
    return request(ProviderUrl,{
        bCompanyId: bCompanyId,
        sCompanyid:sCompanyId
    })
}

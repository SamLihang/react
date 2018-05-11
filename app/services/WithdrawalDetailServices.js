import {request} from '../utils/RequestUtil';
const LoaderWithdrawDetailUrl = '/ReactWithdrawal/WithdrawalDetail';

export const fetchLoaderWithdrawDetail = (amount) => {
    return request(LoaderWithdrawDetailUrl,{
        amount:amount
    })
};


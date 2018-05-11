//买家首页Service
import {request,requestNew} from '../utils/RequestUtil';
// const LoadSelectIndexRecommendUrl = '/BclRecommend/SelectIndexRecommend';
const LoadSelectIndexRecommendUrl = '/BclRecommend/SelectIndexRecommend2';
const CitiesUrl='/BclOpen/Areas';
const VersionUrl='/api/App/Version';
const HeaderUrl='/api/App/Header';


export const fetchVersion= () => {
    return requestNew(VersionUrl)
}
export const fetchHeader= () => {
    return requestNew(HeaderUrl)
}

export const fetchSelectIndexRecommend= () => {
    return request(LoadSelectIndexRecommendUrl)
}

export const fetchCities= () => {
    return request(CitiesUrl)
}
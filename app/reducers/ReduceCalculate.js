import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

//数据结构
let initalStates = {
    TotalCount: 0,
    TotalPrice: 0,
    Items: [{
        productId: null,
        productName: '',
        price: null,
        num: null,
        "ShoppingCartId": 1,
        "EmployeeId": 1,
        "ProductGlobalId": 1,
        "CompanyId": 1,
        "Quantity": 0,
        "ProductType": 0,
        "Remark": null,
        "SpecId": 3,
        "Employee": null,
        "Product": null,
        "Spec": null
    }]
};

let initalState = {
    TotalCount: 0,
    TotalPrice: 0,
    Items: []
};

export function ReduceCalculate(state = initalState, action) {
    switch (action.type) {
        case 'Add':
            return doAdd(action.e);
        case 'Reduce':
            return doReduce(action.e);
        default:
            return state
    }
}

function doAdd(state) {
    state.TotalCount++;

    return state;
}

function doReduce(state) {
    state.TotalCount--
    if (state.TotalCount <= 0) {
        state.TotalCount = 0
    }
    return state;
}
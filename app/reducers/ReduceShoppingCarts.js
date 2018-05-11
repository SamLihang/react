/*
 * Created by sencha on 2017/4/11.
 */
import * as Types from '../actions/Types';

import {REHYDRATE} from 'redux-persist/constants'

const initialLoaderShoppingCarts = {
    datas: null,
    products: null,
    companys: null
};
const initialDeleteShoppingCarts = {
    datas: null,
    products: null,
    companys: null,
    shoppingCartIds: null,
};
const initial = {};

export function ReduceLoadShoppingCarts(state = initialLoaderShoppingCarts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestShoppingCartStart:
            return {
                ...state
            };
        case Types.RequestShoppingCartEnd:
            let {products, companys} = action.data;
            return Object.assign({}, state, {
                datas: action.data,
                products: products,
                companys: companys
            });
        case Types.RequestShoppingCartError:
            return {
                ...state
            };

        //删除购物车
        case Types.ShoppingCartSelect:
            state.datas.map((company, index) => {
                company.Items.map((obj, c) => {
                    if (obj.ShoppingCartId === action.shoppingCartId) {
                        company.Items.splice(c, 1);
                    }
                    if (company.Items.length === 0) {
                        state.datas.splice(index, 1)
                    }
                });
            });
            return Object.assign({}, state, {
                datas: state.datas,
            });

        //采购更新购物车
        case Types.UpdateShoppingCart:
            let actionData = action.cartDatas;

            /*if (actionData.ShoppingCartId !== 0 && actionData.Quantity !== 0) {
            }*/

             let index = state.datas.findIndex(data=>
                 data.CompanyId == actionData.sCompanyId
             );
            //console.log(index)
            let ProductIdNum=0;
            if(index>=0){
                state.datas.map((company,index)=>{
                    //在购物车已有的店铺里加入  在常购和采购里面
                    if(company.CompanyId===actionData.sCompanyId&&actionData.productType<=0){
                        let ProductIdIndex = company.Items.findIndex(obj=>
                            obj.ProductGlobalId == actionData.products.ProductId
                        );
                        //判断是否购物车店铺下已有物品
                        if(ProductIdIndex>=0){
                            company.Items.map((obj,i)=>{
                                //判断是否购物车店铺下已有物品
                                if(obj.ProductGlobalId===actionData.products.ProductId){
                                    //判断是否多规格
                                    if(obj.SpecId===actionData.products.Specs[0].SpecId){
                                        //判断是采购
                                        if(actionData.productType===0){
                                            if(actionData.products.Specs[0].Quantity>0){
                                                obj.Quantity=actionData.products.Specs[0].Quantity;
                                            }else{
                                                company.Items.splice(i,1);
                                            }
                                        }
                                        //判断是常购
                                        if(actionData.productType===-1){
                                            obj.Quantity=obj.Quantity+actionData.products.Specs[0].betweenNum;
                                            if(obj.Quantity==0){
                                                company.Items.splice(i,1);
                                            }
                                        }

                                        if(company.Items.length<=0){
                                            state.datas.splice(index,1);
                                        }
                                    }else{
                                        company.Items.push({
                                            CompanyId:actionData.sCompanyId,
                                            DisplayUnit: actionData.products.Specs[0].DisplayUnit,
                                            DisplayUnitTypeId: actionData.products.Specs[0].DisplayUnitTypeId,
                                            Image: actionData.products.Image,
                                            Price:actionData.products.Specs[0].Price,
                                            ProductGlobalId: actionData.products.ProductId,
                                            ProductName: actionData.products.ProductName,
                                            ProductType: actionData.productType,
                                            Quantity: actionData.products.Specs[0].Quantity,
                                            ShoppingCartId: actionData.products.Specs[0].ShoppingCartId,
                                            SpecId: actionData.products.Specs[0].SpecId,
                                            SpecName:actionData.products.Specs[0].SpecName,
                                            Unit:actionData.products.Specs[0].Unit,
                                            UnitAmount:actionData.products.Specs[0].UnitAmount,
                                        });
                                    }
                                }
                            });
                            company.Items.map((nu,b)=>{
                                if(nu.ProductGlobalId===actionData.products.ProductId){
                                    ProductIdNum++
                                }
                            })
                            if(ProductIdNum>1){
                                var newList = [];
                                company.Items.forEach(function (line) {
                                    for (var i = 0; i < newList.length; i++) {
                                        if (newList[i].SpecId === line.SpecId) {
                                            newList[i].num++;
                                            return;
                                        }
                                    }
                                    newList.push({
                                        CompanyId:line.CompanyId,
                                        DisplayUnit: line.DisplayUnit,
                                        DisplayUnitTypeId: line.DisplayUnitTypeId,
                                        Image: line.Image,
                                        Price:line.Price,
                                        ProductGlobalId: line.ProductGlobalId,
                                        ProductName: line.ProductName,
                                        ProductType: line.ProductType,
                                        Quantity: line.Quantity,
                                        ShoppingCartId: line.ShoppingCartId,
                                        SpecId: line.SpecId,
                                        SpecName:line.SpecName,
                                        Unit:line.Unit,
                                        UnitAmount:line.UnitAmount,
                                        num: 1,
                                    });
                                });
                                company.Items=newList;
                            }
                            //判断多规格的数量为0
                            company.Items.map((p,c)=>{
                                if( p.Quantity===0){
                                    company.Items.splice(c,1);
                                }
                            });
                        }
                        //不是购物车店铺下已有物品
                        else{
                            if(actionData.productType===-1){
                                company.Items.push({
                                    CompanyId:actionData.sCompanyId,
                                    DisplayUnit: actionData.products.Specs[0].DisplayUnit,
                                    DisplayUnitTypeId: actionData.products.Specs[0].DisplayUnitTypeId,
                                    Image: actionData.products.Image,
                                    Price:actionData.products.Specs[0].Price,
                                    ProductGlobalId: actionData.products.ProductId,
                                    ProductName: actionData.products.ProductName,
                                    ProductType: actionData.productType,
                                    Quantity: actionData.products.Specs[0].betweenNum,
                                    ShoppingCartId: actionData.products.Specs[0].ShoppingCartId,
                                    SpecId: actionData.products.Specs[0].SpecId,
                                    SpecName:actionData.products.Specs[0].SpecName,
                                    Unit:actionData.products.Specs[0].Unit,
                                    UnitAmount:actionData.products.Specs[0].UnitAmount,
                                });
                            }
                            if(actionData.productType===0){
                                company.Items.push({
                                    CompanyId:actionData.sCompanyId,
                                    DisplayUnit: actionData.products.Specs[0].DisplayUnit,
                                    DisplayUnitTypeId: actionData.products.Specs[0].DisplayUnitTypeId,
                                    Image: actionData.products.Image,
                                    Price:actionData.products.Specs[0].Price,
                                    ProductGlobalId: actionData.products.ProductId,
                                    ProductName: actionData.products.ProductName,
                                    ProductType: actionData.productType,
                                    Quantity: actionData.products.Specs[0].Quantity,
                                    ShoppingCartId: actionData.products.Specs[0].ShoppingCartId,
                                    SpecId: actionData.products.Specs[0].SpecId,
                                    SpecName:actionData.products.Specs[0].SpecName,
                                    Unit:actionData.products.Specs[0].Unit,
                                    UnitAmount:actionData.products.Specs[0].UnitAmount,
                                });
                            }
                        }
                    }
                    //不是常购和采购里面
                    if(company.CompanyId===actionData.sCompanyId&&actionData.productType>0){
                        state.datas.push(
                            {
                                Amount: actionData.products.Specs[0].Price*actionData.products.Specs[0].Quantity,
                                CompanyId:actionData.sCompanyId,
                                CompanyName: actionData.company.CompanyName,
                                IsOpen: false,
                                LogoImage:actionData.company.LogoImage,
                                Items:[
                                    {
                                        CompanyId:actionData.sCompanyId,
                                        DisplayUnit: actionData.products.Specs[0].DisplayUnit,
                                        DisplayUnitTypeId: actionData.products.Specs[0].DisplayUnitTypeId,
                                        Image: actionData.products.Image,
                                        Price:actionData.products.Specs[0].Price,
                                        ProductGlobalId: actionData.products.ProductId,
                                        ProductName: actionData.products.ProductName,
                                        ProductType: actionData.productType,
                                        Quantity: actionData.products.Specs[0].Quantity,
                                        ShoppingCartId: actionData.products.Specs[0].ShoppingCartId,
                                        SpecId: actionData.products.Specs[0].SpecId,
                                        SpecName:actionData.products.Specs[0].SpecName,
                                        Unit:actionData.products.Specs[0].Unit,
                                        UnitAmount:actionData.products.Specs[0].UnitAmount,
                                    }
                                ]
                            }
                        )
                    }
                });
            }
            else{
                //在购物车没有的店铺里加入新的
                if(actionData.productType===0){
                    state.datas.push(
                        {
                            Amount: actionData.products.Specs[0].Price*actionData.products.Specs[0].Quantity,
                            CompanyId:actionData.sCompanyId,
                            CompanyName: actionData.company.CompanyName,
                            IsOpen: false,
                            LogoImage:actionData.company.LogoImage,
                            Type:actionData.productType,
                            Items:[
                                {
                                    CompanyId:actionData.sCompanyId,
                                    DisplayUnit: actionData.products.Specs[0].DisplayUnit,
                                    DisplayUnitTypeId: actionData.products.Specs[0].DisplayUnitTypeId,
                                    Image: actionData.products.Image,
                                    Price:actionData.products.Specs[0].Price,
                                    ProductGlobalId: actionData.products.ProductId,
                                    ProductName: actionData.products.ProductName,
                                    ProductType: actionData.productType,
                                    Quantity: actionData.products.Specs[0].Quantity,
                                    ShoppingCartId: actionData.products.Specs[0].ShoppingCartId,
                                    SpecId: actionData.products.Specs[0].SpecId,
                                    SpecName:actionData.products.Specs[0].SpecName,
                                    Unit:actionData.products.Specs[0].Unit,
                                    UnitAmount:actionData.products.Specs[0].UnitAmount,
                                }
                            ]
                        }
                    )
                }
                if(actionData.productType===-1){
                    state.datas.push(
                        {
                            Amount: actionData.products.Specs[0].Price*actionData.products.Specs[0].Quantity,
                            CompanyId:actionData.sCompanyId,
                            CompanyName: actionData.company.CompanyName,
                            IsOpen: false,
                            LogoImage:actionData.company.LogoImage,
                            Type:0,
                            Items:[
                                {
                                    CompanyId:actionData.sCompanyId,
                                    DisplayUnit: actionData.products.Specs[0].DisplayUnit,
                                    DisplayUnitTypeId: actionData.products.Specs[0].DisplayUnitTypeId,
                                    Image: actionData.products.Image,
                                    Price:actionData.products.Specs[0].Price,
                                    ProductGlobalId: actionData.products.ProductId,
                                    ProductName: actionData.products.ProductName,
                                    ProductType: actionData.productType,
                                    Quantity: actionData.products.Specs[0].betweenNum,
                                    ShoppingCartId: actionData.products.Specs[0].ShoppingCartId,
                                    SpecId: actionData.products.Specs[0].SpecId,
                                    SpecName:actionData.products.Specs[0].SpecName,
                                    Unit:actionData.products.Specs[0].Unit,
                                    UnitAmount:actionData.products.Specs[0].UnitAmount,
                                }
                            ]
                        }
                    )
                }
            }
            //把常购-1改为采购0
            state.datas.map((com,index)=>{
                com.Items.map((obj,i)=>{
                    if(obj.ProductType===-1){
                        obj.ProductType=0;
                    }
                });
            });


            return Object.assign({}, state, {
                datas: state.datas,
            });
        //常购更新购物车
        case Types.UpdateAlwaysShoppingCart:

            return Object.assign({}, state, {
                datas: state.datas,
            });
        default:
            return state;
    }
}

export function ReduceInsertOrUpdateShoppingCart(state = initial, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestInsertOrUpdateShoppingCartStart:
            return {
                ...state
            };
        case Types.RequestInsertOrUpdateShoppingCartEnd:
            return {
                ...state,
                datas: action.data,
                error: action.error
            }
        case Types.RequestInsertOrUpdateShoppingCartError:

            return {
                ...state
            };
        default:
            return state;
    }
}

export function ReduceDeleteShoppingCarts(state = initialDeleteShoppingCarts, action) {
    switch (action.type) {
        case REHYDRATE:
            //var incoming = action.payload.ReduceLoderProducts;
            //if (incoming) return {...state, ...incoming}
            return state;
        case Types.RequestDeleteShoppingCartsStart:
            return {
                ...state
            };
        case Types.RequestDeleteShoppingCartsEnd:
            let {shoppingCartIds} = action.data;
            return Object.assign({}, state, {
                datas: action.data,
                shoppingCartIds: shoppingCartIds,
            });
        case Types.RequestDeleteShoppingCartsError:

            return {
                ...state
            };
        default:
            return state;
    }
}

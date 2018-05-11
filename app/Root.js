/**
 * Created by sencha on 2017/3/23.
 */
import React, {Component} from "react";
import {Provider} from "react-redux";
import AppWithNavigationState from "./RouteConfigs";
import configureStore from "./store/Index";

//let store = configureStore();

export default class Root extends Component {
    /*render() {
     let store = createStore(ApAppReducer);
     getDatas('token', (token) => {
     global.token = token;
     });
     return (
     <Provider store={store}>
     <AppWithNavigationState />
     </Provider>
     )
     }*/

    constructor() {
        super();
        let storeObj = configureStore(() => {
            this.setState({isLoading: false})
        });
        this.state = {
            isLoading: true,
            store: storeObj.store,
            persistor: storeObj.persistor
        }
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }
        return (
            <Provider store={this.state.store} persistor={this.state.persistor}>
                <AppWithNavigationState/>
            </Provider>
        )
    }
}

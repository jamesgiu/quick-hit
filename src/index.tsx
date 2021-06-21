import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import {createStore, Reducer} from "redux";
import storage from 'redux-persist/lib/storage';
import {Provider} from "react-redux";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {dataInitialState, ttReducer} from "./redux/reducers/TTReducer";
import {ViewStoreState} from "./redux/types/ViewTypes";
import {TTStoreState} from "./redux/types/TTTypes";
import {persistCombineReducers} from 'redux-persist';
import {viewInitialState, viewReducer} from "./redux/reducers/ViewReducer";
import persistStore from "redux-persist/es/persistStore";
import {PersistGate} from "redux-persist/integration/react";

TimeAgo.addDefaultLocale(en);

// Redux-persistor config.
const persistConfig = {
    key: 'root',
    storage,
    // We do not want to store the tt data in persist - as it should reload anew on each application refresh.
    blacklist: ['ttData']
};

export interface QuickHitReduxStores {
    ttData: TTStoreState,
    viewStore: ViewStoreState
}

const reducers = persistCombineReducers(persistConfig, {
    viewStore: viewReducer as Reducer,
    ttData: ttReducer as Reducer,
});

export const store = createStore(reducers as Reducer, {
    ttData: dataInitialState,
    viewStore: viewInitialState,
});

const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA
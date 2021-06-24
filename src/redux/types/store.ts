import {TTStoreState} from "./TTTypes";
import {ViewStoreState} from "./ViewTypes";
import {AuthStoreState} from "./AuthTypes";
import {createStore, Reducer} from "redux";
import {dataInitialState, ttReducer} from "../reducers/TTReducer";
import {viewInitialState, viewReducer} from "../reducers/ViewReducer";
import {authInitialState, authReducer} from "../reducers/AuthReducer";
import {persistCombineReducers} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Redux-persistor config.
const persistConfig = {
    key: 'root',
    storage,
    // We do not want to store the tt data in persist - as it should reload anew on each application refresh.
    blacklist: ['ttData']
};

const reducers = persistCombineReducers(persistConfig, {
    viewStore: viewReducer as Reducer,
    ttData: ttReducer as Reducer,
    authStore: authReducer as Reducer,
});

const store = createStore(reducers as Reducer, {
    ttData: dataInitialState,
    viewStore: viewInitialState,
    authStore: authInitialState
});

export interface QuickHitReduxStores {
    ttData: TTStoreState,
    viewStore: ViewStoreState,
    authStore: AuthStoreState
}


export default store;
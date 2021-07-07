import { TTStoreState } from "./TTTypes";
import { ViewStoreState } from "./ViewTypes";
import { AuthStoreState } from "./AuthTypes";
import { combineReducers, createStore, Reducer } from "redux";
import { dataInitialState, ttReducer } from "../reducers/TTReducer";
import { viewInitialState, viewReducer } from "../reducers/ViewReducer";
import { authInitialState, authReducer } from "../reducers/AuthReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

// Redux-persistor config.
const persistConfig = {
    key: "root",
    storage,
    // We do not want to store the tt data in persist - as it should reload anew on each application refresh.
    blacklist: ["ttData", "authStore"],
};

const authConfig = {
    key: "authStore",
    storage,
    //FIXME We want to get a new token on each refresh for now.
    blacklist: ["token"],
};

const reducers = combineReducers({
    viewStore: viewReducer as Reducer,
    ttData: ttReducer as Reducer,
    authStore: persistReducer(authConfig, authReducer as Reducer),
});

const store = createStore(persistReducer(persistConfig, reducers as Reducer), {
    ttData: dataInitialState,
    viewStore: viewInitialState,
    authStore: authInitialState,
});

export interface QuickHitReduxStores {
    ttData: TTStoreState;
    viewStore: ViewStoreState;
    authStore: AuthStoreState;
}

export default store;

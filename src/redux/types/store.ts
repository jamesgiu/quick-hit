import {TTStoreState} from "./TTTypes";
import {ViewStoreState} from "./ViewTypes";
import {AuthStoreState} from "./AuthTypes";

export interface QuickHitReduxStores {
    ttData: TTStoreState,
    viewStore: ViewStoreState,
    authStore: AuthStoreState
}
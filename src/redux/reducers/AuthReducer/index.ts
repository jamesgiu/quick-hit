import {AuthStoreState} from "../../types/AuthTypes";
import {SetAuthKeyAction} from "../../actions/AuthActions";
import {SET_AUTH_KEY} from "../../constants/AuthConstants";

export const authInitialState: AuthStoreState = {
    authKey: undefined
};

export function authReducer(state: AuthStoreState = authInitialState, action: SetAuthKeyAction): AuthStoreState {
    switch (action.type) {
        case SET_AUTH_KEY:
            return {...state, authKey: action.value}
        default:
            return state;
    }
}
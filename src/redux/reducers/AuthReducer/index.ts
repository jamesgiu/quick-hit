import { AuthStoreState } from "../../types/AuthTypes";
import { SetAuthKeyAction, SetTokenAction } from "../../actions/AuthActions";
import { SET_AUTH_KEY, SET_TOKEN } from "../../constants/AuthConstants";

export const authInitialState: AuthStoreState = {
    authKey: undefined,
    token: undefined,
};

export function authReducer(
    state: AuthStoreState = authInitialState,
    action: SetAuthKeyAction | SetTokenAction
): AuthStoreState {
    switch (action.type) {
        case SET_AUTH_KEY:
            return { ...state, authKey: action.value };
        case SET_TOKEN:
            return { ...state, token: action.value };
        default:
            return state;
    }
}

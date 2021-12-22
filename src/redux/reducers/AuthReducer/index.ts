import { AuthStoreState } from "../../types/AuthTypes";
import { SetAuthKeyAction, SetChosenInstanceAction, SetAuthDetailAction } from "../../actions/AuthActions";
import { SET_AUTH_KEY, SET_INSTANCE, SET_AUTH_DETAIL } from "../../constants/AuthConstants";

export const authInitialState: AuthStoreState = {
    authKey: undefined,
    authDetail: undefined,
};

export function authReducer(
    state: AuthStoreState = authInitialState,
    action: SetAuthKeyAction | SetAuthDetailAction | SetChosenInstanceAction
): AuthStoreState {
    switch (action.type) {
        case SET_AUTH_KEY:
            return { ...state, authKey: action.value };
        case SET_AUTH_DETAIL:
            return { ...state, authDetail: action.value };
        case SET_INSTANCE:
            return { ...state, chosenInstance: action.value };
        default:
            return state;
    }
}

import * as constants from "../../constants/AuthConstants";

export interface SetAuthKeyAction {
    type: constants.SET_AUTH_KEY_TYPE;
    value: string;
}

export function setAuthKey(newKey: string): SetAuthKeyAction {
    return {
        type: constants.SET_AUTH_KEY,
        value: newKey,
    };
}

import * as constants from "../../constants/AuthConstants";
import { DbInstance } from "../../../types/database/models";
import { AuthUserDetail } from "../../types/AuthTypes";

export interface SetChosenInstanceAction {
    type: constants.SET_INSTANCE_TYPE;
    value: DbInstance;
}

export interface SetAuthKeyAction {
    type: constants.SET_AUTH_KEY_TYPE;
    value: string;
}

export interface SetAuthDetailAction {
    type: constants.SET_AUTH_DETAIL_TYPE;
    value: AuthUserDetail | undefined;
}

export function setChosenInstance(newChosenInstance: DbInstance): SetChosenInstanceAction {
    return {
        type: constants.SET_INSTANCE,
        value: newChosenInstance,
    };
}

export function setAuthKey(newKey: string): SetAuthKeyAction {
    return {
        type: constants.SET_AUTH_KEY,
        value: newKey,
    };
}

export function setAuthDetail(newAuthDetail?: AuthUserDetail): SetAuthDetailAction {
    return {
        type: constants.SET_AUTH_DETAIL,
        value: newAuthDetail,
    };
}

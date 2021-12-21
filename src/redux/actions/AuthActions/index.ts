import * as constants from "../../constants/AuthConstants";
import { DbInstance } from "../../../types/database/models";

export interface SetChosenInstanceAction {
    type: constants.SET_INSTANCE_TYPE;
    value: DbInstance;
}

export interface SetAuthKeyAction {
    type: constants.SET_AUTH_KEY_TYPE;
    value: string;
}

export interface SetTokenAction {
    type: constants.SET_TOKEN_TYPE;
    value: string;
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

export function setToken(newToken: string): SetTokenAction {
    return {
        type: constants.SET_TOKEN,
        value: newToken,
    };
}

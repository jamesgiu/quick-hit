import { DbInstance } from "../../../types/database/models";

export interface AuthUserDetail {
    idToken: string;
    userName?: string;
    email?: string;
}

export interface AuthStoreState {
    authKey?: string;
    authDetail?: AuthUserDetail;
    chosenInstance?: DbInstance;
}

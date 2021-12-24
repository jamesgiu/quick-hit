import { DbInstance } from "../../../types/database/models";
import firebase from "firebase/compat";

export interface AuthUserDetail {
    idToken: string;
    refreshToken?: string;
    /* UTC string */
    expiryTime: string;
    userName?: string;
    email?: string;
    /* For Google auth */
    userCredential?: firebase.User;
}

export interface AuthStoreState {
    authKey?: string;
    authDetail?: AuthUserDetail;
    chosenInstance?: DbInstance;
}

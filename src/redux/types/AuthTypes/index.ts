import { DbInstance } from "../../../types/database/models";

export interface AuthStoreState {
    authKey?: string;
    token?: string;
    chosenInstance?: DbInstance;
}

import { connect } from "react-redux";
import KeyPrompt, { KeyPromptProps } from "../../components/KeyPrompt/KeyPrompt";
import { Dispatch } from "redux";
import * as authActions from "../../redux/actions/AuthActions";
import {SetAuthKeyAction, SetChosenInstanceAction, SetTokenAction} from "../../redux/actions/AuthActions";
import { AuthStoreState } from "../../redux/types/AuthTypes";
import { QuickHitReduxStores } from "../../redux/types/store";
import { DbInstance } from "../../types/database/models";

export function mapStateToProps(store: QuickHitReduxStores): AuthStoreState {
    return {
        authKey: store.authStore.authKey,
        chosenInstance: store.authStore.chosenInstance,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<SetAuthKeyAction | SetChosenInstanceAction | SetTokenAction>): KeyPromptProps {
    return {
        setAuthKey: (newKey: string): SetAuthKeyAction => dispatch(authActions.setAuthKey(newKey)),
        setToken: (newToken: string): SetTokenAction => dispatch(authActions.setToken(newToken)),
        setChosenInstance: (newInstance: DbInstance): SetChosenInstanceAction =>
            dispatch(authActions.setChosenInstance(newInstance)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyPrompt);

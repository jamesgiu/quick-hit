import { connect } from "react-redux";
import KeyPrompt, { KeyPromptProps } from "../../components/KeyPrompt/KeyPrompt";
import { Dispatch } from "redux";
import * as authActions from "../../redux/actions/AuthActions";
import { SetAuthKeyAction, SetChosenInstanceAction, SetAuthDetailAction } from "../../redux/actions/AuthActions";
import { AuthStoreState, AuthUserDetail } from "../../redux/types/AuthTypes";
import { QuickHitReduxStores } from "../../redux/types/store";
import { DbInstance } from "../../types/database/models";

export function mapStateToProps(store: QuickHitReduxStores): AuthStoreState {
    return {
        authKey: store.authStore.authKey,
        chosenInstance: store.authStore.chosenInstance,
        authDetail: store.authStore.authDetail,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<SetAuthKeyAction | SetChosenInstanceAction | SetAuthDetailAction>
): KeyPromptProps {
    return {
        setAuthKey: (newKey: string): SetAuthKeyAction => dispatch(authActions.setAuthKey(newKey)),
        setAuthDetail: (newAuthDetail?: AuthUserDetail): SetAuthDetailAction =>
            dispatch(authActions.setAuthDetail(newAuthDetail)),
        setChosenInstance: (newInstance: DbInstance): SetChosenInstanceAction =>
            dispatch(authActions.setChosenInstance(newInstance)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyPrompt);

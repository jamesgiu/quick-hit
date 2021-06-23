import {connect} from "react-redux";
import KeyPrompt, {KeyPromptProps} from "../../components/KeyPrompt/KeyPrompt";
import {QuickHitReduxStores} from "../../index";
import {Dispatch} from "redux";
import * as authActions from "../../redux/actions/AuthActions";
import {SetAuthKeyAction} from "../../redux/actions/AuthActions";
import {AuthStoreState} from "../../redux/types/AuthTypes";

export function mapStateToProps(store: QuickHitReduxStores) : AuthStoreState {
    return {
        authKey: store.authStore.authKey,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<SetAuthKeyAction>) : KeyPromptProps {
    return {
        setAuthKey: (newKey: string) => dispatch(authActions.setAuthKey(newKey)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyPrompt);
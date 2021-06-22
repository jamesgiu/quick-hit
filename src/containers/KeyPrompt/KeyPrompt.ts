import {connect} from "react-redux";
import KeyPrompt from "../../components/KeyPrompt/KeyPrompt";
import {QuickHitReduxStores} from "../../index";
import {Dispatch} from "redux";
import * as authActions from "../../redux/actions/AuthActions";
import {SetAuthKeyAction} from "../../redux/actions/AuthActions";

export function mapStateToProps(store: QuickHitReduxStores) {
    return {
        authKey: store.authStore.authKey,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<SetAuthKeyAction>) {
    return {
        setAuthKey: (newKey: string) => dispatch(authActions.setAuthKey(newKey)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(KeyPrompt);
import { connect } from "react-redux";
import { QuickHitReduxStores } from "../../redux/types/store";
import Chat, { ChatProps } from "../../components/Chat/Chat";

export function mapStateToProps(store: QuickHitReduxStores): ChatProps {
    return {
        currentUser: store.viewStore.currentUser,
    };
}

export default connect(mapStateToProps, {})(Chat);

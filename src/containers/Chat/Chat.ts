import { connect } from "react-redux";
import { QuickHitReduxStores } from "../../redux/types/store";
import Chat, { ChatProps } from "../../components/Chat/Chat";

export function mapStateToProps(store: QuickHitReduxStores): ChatProps {
    return {
        username: store.viewStore.username,
    };
}

export default connect(mapStateToProps, {})(Chat);

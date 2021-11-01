import { connect } from "react-redux";
import { mapTTDispatchToProps } from "../shared";
import Comparator from "../../components/Comparator/Comparator";
import { QuickHitReduxStores } from "../../redux/types/store";
import { DbMatch, DbPlayer } from "../../types/database/models";

export interface ComparatorStoreProps {
    players: DbPlayer[];
    matches: DbMatch[];
}

export function mapStateToProps(
    store: QuickHitReduxStores
): ComparatorStoreProps {
    return {
        players: store.ttData.players,
        matches: store.ttData.matches,
    };
}

export default connect(mapStateToProps, mapTTDispatchToProps)(Comparator);

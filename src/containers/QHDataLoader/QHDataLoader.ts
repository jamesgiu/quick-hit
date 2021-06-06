import {Dispatch} from "redux";
import * as actions from "../../redux/actions/TTActions";
import {connect} from "react-redux";
import {QuickHitReduxStores} from "../../index";
import QHDataLoader from "../../components/QHDataLoader/QHDataLoader";
import {DB_Match, DB_Player} from "../../types/database/models";

export function mapStateToProps(store: QuickHitReduxStores) {
    return {
        loaderData: { loading: store.ttData.loading, playersMap: store.ttData.playersMap, matches: store.ttData.matches },
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SetLoadingAction | actions.SetMatchesAction | actions.SetPlayersAction>) {
    return {
        setMatches: (newMatches: DB_Match[]) => dispatch(actions.setMatches(newMatches)),
        setPlayers: (newPlayers: Map<string, DB_Player>) => dispatch(actions.setPlayers(newPlayers)),
        setLoading: (newLoading: boolean) => dispatch(actions.setLoading(newLoading)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(QHDataLoader);
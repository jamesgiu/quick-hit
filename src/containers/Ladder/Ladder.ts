import {connect} from "react-redux";
import Ladder from "../../components/Ladder/Ladder";
import {Dispatch} from "redux";
import * as ttActions from "../../redux/actions/TTActions";
import * as viewActions from "../../redux/actions/ViewActions";
import {DbMatch, DbPlayer} from "../../types/database/models";
import {QuickHitReduxStores} from "../../index";

export function mapStateToProps(store: QuickHitReduxStores) {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        hideZeroGamePlayers: store.viewStore.hideZeroGamePlayers,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ttActions.SetLoadingAction | ttActions.SetMatchesAction | ttActions.SetPlayersAction | ttActions.SetForceRefreshAction | viewActions.SetZeroGamesFilterAction>) {
    return {
        setMatches: (newMatches: DbMatch[]) => dispatch(ttActions.setMatches(newMatches)),
        setPlayers: (newPlayers: DbPlayer[]) => dispatch(ttActions.setPlayers(newPlayers)),
        setLoading: (newLoading: boolean) => dispatch(ttActions.setLoading(newLoading)),
        setForceRefresh: (newRefresh: boolean) => dispatch(ttActions.setRefresh(newRefresh)),
        setHideZeroGamePlayers: (hideZeroGamePlayers: boolean) => dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);
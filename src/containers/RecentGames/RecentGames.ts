import {connect} from "react-redux";
import RecentGames, {RecentGamesProps} from "../../components/RecentGames/RecentGames";
import {TTStoreState} from "../../redux/types/TTTypes";
import {mapTTDispatchToProps} from "../shared";

export function mapStateToProps(store: TTStoreState, ownProps: RecentGamesProps) {
    return {
        loading: store.loading,
        players: store.players,
        matches: store.matches,
        refresh: store.refresh,
        focusedPlayerId: ownProps.focusedPlayerId,
    }
}

export default connect(mapStateToProps, mapTTDispatchToProps)(RecentGames);
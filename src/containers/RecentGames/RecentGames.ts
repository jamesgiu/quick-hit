import {connect} from "react-redux";
import RecentGames, {RecentGamesProps} from "../../components/RecentGames/RecentGames";
import {TTStoreState} from "../../redux/types/TTTypes";

export function mapStateToProps(store: TTStoreState, ownProps: RecentGamesProps) {
    return {
        loading: store.loading,
        players: store.players,
        matches: store.matches,
        focusedPlayerId: ownProps.focusedPlayerId,
    }
}

export default connect(mapStateToProps, {})(RecentGames);
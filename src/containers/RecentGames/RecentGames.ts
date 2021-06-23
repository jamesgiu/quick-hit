import {connect} from "react-redux";
import RecentGames, {RecentGamesProps} from "../../components/RecentGames/RecentGames";
import {mapTTDispatchToProps} from "../shared";
import {QuickHitReduxStores} from "../../index";
import {TTStoreState} from "../../redux/types/TTTypes";

export function mapStateToProps(store: QuickHitReduxStores, ownProps: RecentGamesProps) : TTStoreState & RecentGamesProps {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        focusedPlayerId: ownProps.focusedPlayerId,
    }
}

export default connect(mapStateToProps, mapTTDispatchToProps)(RecentGames);
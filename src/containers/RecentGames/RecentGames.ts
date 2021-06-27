import { connect } from "react-redux";
import RecentGames, { RecentGamesProps } from "../../components/RecentGames/RecentGames";
import { mapTTDispatchToProps } from "../shared";
import { TTStoreState } from "../../redux/types/TTTypes";
import { QuickHitReduxStores } from "../../redux/types/store";

export function mapStateToProps(
    store: QuickHitReduxStores,
    ownProps: RecentGamesProps
): TTStoreState & RecentGamesProps {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        focusedPlayerId: ownProps.focusedPlayerId,
    };
}

export default connect(mapStateToProps, mapTTDispatchToProps)(RecentGames);

import { connect } from "react-redux";
import { mapTTDataToProps, mapTTDispatchToProps } from "../shared";
import AchievementFeed from "../../components/PlayerStatistics/AchievementFeed";
import { QuickHitReduxStores } from "../../redux/types/store";
import { RecentGamesOwnProps } from "../../components/RecentGames/RecentGames";
import { TTStoreState } from "../../redux/types/TTTypes";

export interface AchievementFeedProps {
    focusedPlayerId?: string;
}

export function mapStateToProps(
    store: QuickHitReduxStores,
    ownProps: AchievementFeedProps
): TTStoreState & RecentGamesOwnProps {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        tournaments: store.ttData.tournaments,
        doublesPairs: store.ttData.doublesPairs,
        focusedPlayerId: ownProps.focusedPlayerId,
    };
}

export default connect(mapTTDataToProps, mapTTDispatchToProps)(AchievementFeed);

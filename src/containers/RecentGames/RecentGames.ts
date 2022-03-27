import { connect } from "react-redux";
import RecentGames, { RecentGamesOwnProps } from "../../components/RecentGames/RecentGames";
import { TTStoreState } from "../../redux/types/TTTypes";
import { QuickHitReduxStores } from "../../redux/types/store";
import { Dispatch } from "redux";
import * as viewActions from "../../redux/actions/ViewActions";
import * as actions from "../../redux/actions/TTActions";
import { DbPlayer } from "../../types/database/models";

export type RecentGamesDispatchType = {
    setCurrentUser: (newUser: DbPlayer) => void;
    setForceRefresh: (newRefresh: boolean) => void;
};

export function mapStateToProps(
    store: QuickHitReduxStores,
    ownProps: RecentGamesOwnProps
): TTStoreState & RecentGamesOwnProps & { currentUser?: DbPlayer } {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        tournaments: store.ttData.tournaments,
        currentUser: store.viewStore.currentUser,
        focusedPlayerId: ownProps.focusedPlayerId,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<viewActions.SetCurrentUserAction | actions.SetForceRefreshAction>
): RecentGamesDispatchType {
    return {
        setCurrentUser: (newUser: DbPlayer): viewActions.SetCurrentUserAction =>
            dispatch(viewActions.setCurrentUser(newUser)),
        setForceRefresh: (newRefresh: boolean): actions.SetForceRefreshAction =>
            dispatch(actions.setRefresh(newRefresh)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentGames);

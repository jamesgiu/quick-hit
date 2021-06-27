import { connect } from "react-redux";
import Ladder from "../../components/Ladder/Ladder";
import { Dispatch } from "redux";
import * as ttActions from "../../redux/actions/TTActions";
import * as viewActions from "../../redux/actions/ViewActions";
import { TTStoreState } from "../../redux/types/TTTypes";
import { ViewStoreState } from "../../redux/types/ViewTypes";
import { TTRefreshDispatchType } from "../shared";
import { QuickHitReduxStores } from "../../redux/types/store";

export interface ViewDispatchType {
    setHideZeroGamePlayers: (hideZeroGamePlayers: boolean) => void;
    setShowCards: (showCards: boolean) => void;
}

export function mapStateToProps(store: QuickHitReduxStores): TTStoreState & ViewStoreState {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        hideZeroGamePlayers: store.viewStore.hideZeroGamePlayers,
        showCards: store.viewStore.showCards,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        ttActions.SetForceRefreshAction | viewActions.SetZeroGamesFilterAction | viewActions.SetShowCardsAction
    >
): TTRefreshDispatchType & ViewDispatchType {
    return {
        setForceRefresh: (newRefresh: boolean) => dispatch(ttActions.setRefresh(newRefresh)),
        setHideZeroGamePlayers: (hideZeroGamePlayers: boolean) =>
            dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers)),
        setShowCards: (showCards: boolean) => dispatch(viewActions.setShowCards(showCards)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);

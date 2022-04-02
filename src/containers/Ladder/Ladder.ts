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
    setHideUnplacedPlayers: (hideZeroGamePlayers: boolean) => void;
    setShowCards: (showCards: boolean) => void;
}

export function mapStateToProps(store: QuickHitReduxStores): TTStoreState & ViewStoreState {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        tournaments: store.ttData.tournaments,
        doublesPairs: store.ttData.doublesPairs,
        hideUnplacedPlayers: store.viewStore.hideUnplacedPlayers,
        showCards: store.viewStore.showCards,
        disableMusic: store.viewStore.disableMusic,
        darkMode: store.viewStore.darkMode,
        currentUser: store.viewStore.currentUser,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        | ttActions.SetForceRefreshAction
        | viewActions.SetUnplacedFilterAction
        | viewActions.SetShowCardsAction
        | viewActions.SetDisableMusicAction
    >
): TTRefreshDispatchType & ViewDispatchType {
    return {
        setForceRefresh: (newRefresh: boolean): ttActions.SetForceRefreshAction =>
            dispatch(ttActions.setRefresh(newRefresh)),
        setHideUnplacedPlayers: (hideZeroGamePlayers: boolean): viewActions.SetUnplacedFilterAction =>
            dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers)),
        setShowCards: (showCards: boolean): viewActions.SetShowCardsAction =>
            dispatch(viewActions.setShowCards(showCards)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);

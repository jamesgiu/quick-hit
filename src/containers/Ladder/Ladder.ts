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
    setDisableMusic: (disableMusic: boolean) => void;
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
        hideZeroGamePlayers: store.viewStore.hideZeroGamePlayers,
        showCards: store.viewStore.showCards,
        disableMusic: store.viewStore.disableMusic,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        | ttActions.SetForceRefreshAction
        | viewActions.SetZeroGamesFilterAction
        | viewActions.SetShowCardsAction
        | viewActions.SetDisableMusicAction
    >
): TTRefreshDispatchType & ViewDispatchType {
    return {
        setForceRefresh: (newRefresh: boolean): ttActions.SetForceRefreshAction =>
            dispatch(ttActions.setRefresh(newRefresh)),
        setHideZeroGamePlayers: (hideZeroGamePlayers: boolean): viewActions.SetZeroGamesFilterAction =>
            dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers)),
        setShowCards: (showCards: boolean): viewActions.SetShowCardsAction =>
            dispatch(viewActions.setShowCards(showCards)),
        setDisableMusic: (disableMusic: boolean): viewActions.SetDisableMusicAction =>
            dispatch(viewActions.setDisableMusic(disableMusic)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);

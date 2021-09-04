import { connect } from "react-redux";
import Settings from "../../components/Settings/Settings";
import { Dispatch } from "redux";
import { QuickHitReduxStores } from "../../redux/types/store";
import * as viewActions from "../../redux/actions/ViewActions";
import { ViewDispatchType } from "../Ladder/Ladder";
import { SettingsProps } from "../../components/Settings/Settings";

export function mapStateToProps(store: QuickHitReduxStores): SettingsProps {
    return {
        hideZeroGamePlayers: store.viewStore.hideZeroGamePlayers,
        showCards: store.viewStore.showCards,
        disableMusic: store.viewStore.disableMusic,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        viewActions.SetZeroGamesFilterAction | viewActions.SetShowCardsAction | viewActions.SetDisableMusicAction
    >
): ViewDispatchType {
    return {
        setHideZeroGamePlayers: (hideZeroGamePlayers: boolean): viewActions.SetZeroGamesFilterAction =>
            dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers)),
        setShowCards: (showCards: boolean): viewActions.SetShowCardsAction =>
            dispatch(viewActions.setShowCards(showCards)),
        setDisableMusic: (disableMusic: boolean): viewActions.SetDisableMusicAction =>
            dispatch(viewActions.setDisableMusic(disableMusic)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

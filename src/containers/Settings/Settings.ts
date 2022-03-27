import { connect } from "react-redux";
import Settings from "../../components/Settings/Settings";
import { Dispatch } from "redux";
import { QuickHitReduxStores } from "../../redux/types/store";
import * as viewActions from "../../redux/actions/ViewActions";
import { ViewDispatchType } from "../Ladder/Ladder";
import { SettingsProps } from "../../components/Settings/Settings";
import { DbPlayer } from "../../types/database/models";

export type SettingsDispatchType = ViewDispatchType & {
    setDisableMusic: (disableMusic: boolean) => void;
    setCurrentUser: (newUser: DbPlayer) => void;
    setDarkMode: (isDarkMode: boolean) => void;
};

export function mapStateToProps(store: QuickHitReduxStores): SettingsProps {
    return {
        hideZeroGamePlayers: store.viewStore.hideUnplacedPlayers,
        showCards: store.viewStore.showCards,
        disableMusic: store.viewStore.disableMusic,
        currentUser: store.viewStore.currentUser,
        darkMode: store.viewStore.darkMode,
        players: store.ttData.players,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        | viewActions.SetUnplacedFilterAction
        | viewActions.SetShowCardsAction
        | viewActions.SetDisableMusicAction
        | viewActions.SetCurrentUserAction
        | viewActions.SetDarkModeAction
    >
): SettingsDispatchType {
    return {
        setHideUnplacedPlayers: (hideZeroGamePlayers: boolean): viewActions.SetUnplacedFilterAction =>
            dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers)),
        setShowCards: (showCards: boolean): viewActions.SetShowCardsAction =>
            dispatch(viewActions.setShowCards(showCards)),
        setDisableMusic: (disableMusic: boolean): viewActions.SetDisableMusicAction =>
            dispatch(viewActions.setDisableMusic(disableMusic)),
        setCurrentUser: (newUser: DbPlayer): viewActions.SetCurrentUserAction =>
            dispatch(viewActions.setCurrentUser(newUser)),
        setDarkMode: (isDarkMode: boolean): viewActions.SetDarkModeAction =>
            dispatch(viewActions.setDarkMode(isDarkMode)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

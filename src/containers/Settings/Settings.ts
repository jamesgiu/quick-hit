import { connect } from "react-redux";
import Settings from "../../components/Settings/Settings";
import { Dispatch } from "redux";
import { QuickHitReduxStores } from "../../redux/types/store";
import * as viewActions from "../../redux/actions/ViewActions";
import { ViewDispatchType } from "../Ladder/Ladder";
import { SettingsProps } from "../../components/Settings/Settings";

export type SettingsDispatchType = ViewDispatchType & {
    setDisableMusic: (disableMusic: boolean) => void;
    setUsername: (username: string) => void;
};

export function mapStateToProps(store: QuickHitReduxStores): SettingsProps {
    return {
        hideZeroGamePlayers: store.viewStore.hideZeroGamePlayers,
        showCards: store.viewStore.showCards,
        disableMusic: store.viewStore.disableMusic,
        username: store.viewStore.username,
    };
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        | viewActions.SetZeroGamesFilterAction
        | viewActions.SetShowCardsAction
        | viewActions.SetDisableMusicAction
        | viewActions.SetUsernameAction
    >
): SettingsDispatchType {
    return {
        setHideZeroGamePlayers: (hideZeroGamePlayers: boolean): viewActions.SetZeroGamesFilterAction =>
            dispatch(viewActions.setZeroGamesFilter(hideZeroGamePlayers)),
        setShowCards: (showCards: boolean): viewActions.SetShowCardsAction =>
            dispatch(viewActions.setShowCards(showCards)),
        setDisableMusic: (disableMusic: boolean): viewActions.SetDisableMusicAction =>
            dispatch(viewActions.setDisableMusic(disableMusic)),
        setUsername: (username: string): viewActions.SetUsernameAction => dispatch(viewActions.setUsername(username)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

import { DbPlayer } from "../../../types/database/models";

export interface ViewStoreState {
    hideUnplacedPlayers: boolean;
    showCards: boolean;
    disableMusic: boolean;
    currentUser?: DbPlayer;
    darkMode: boolean;
}

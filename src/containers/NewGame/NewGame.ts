import { connect } from "react-redux";
import { mapTTDispatchToProps } from "../shared";
import NewGame, { NewGameOwnProps } from "../../components/NewGame/NewGame";
import { QuickHitReduxStores } from "../../redux/types/store";
import { DbHappyHour, DbMatch, DbPlayer } from "../../types/database/models";

export interface NewGameStoreProps {
    players: DbPlayer[];
    happyHour: DbHappyHour;
    matches: DbMatch[];
}

export function mapStateToProps(
    store: QuickHitReduxStores,
    ownProps: NewGameOwnProps
): NewGameStoreProps & NewGameOwnProps {
    return {
        players: store.ttData.players,
        happyHour: store.ttData.happyHour,
        matches: store.ttData.matches,
        customModalOpenElement: ownProps.customModalOpenElement,
        onNewGameAdded: ownProps.onNewGameAdded,
    };
}

export default connect(mapStateToProps, mapTTDispatchToProps)(NewGame);

import { connect } from "react-redux";
import Tournament from "../../components/Tournament/Tournament";
import { mapTTDispatchToProps } from "../shared";
import { QuickHitReduxStores } from "../../redux/types/store";
import { TTStoreState } from "../../redux/types/TTTypes";
import { DbInstance } from "../../types/database/models";

export type TournamentReduxProps = TTStoreState & { disableMusic: boolean; chosenInstance?: DbInstance };

export function mapStateToProps(store: QuickHitReduxStores): TournamentReduxProps {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        doublesPairs: store.ttData.doublesPairs,
        tournaments: store.ttData.tournaments,
        disableMusic: store.viewStore.disableMusic,
        chosenInstance: store.authStore.chosenInstance,
    };
}

export default connect(mapStateToProps, mapTTDispatchToProps)(Tournament);

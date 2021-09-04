import { connect } from "react-redux";
import Tournament from "../../components/Tournament/Tournament";
import { mapTTDispatchToProps } from "../shared";
import { QuickHitReduxStores } from "../../redux/types/store";
import { TTStoreState } from "../../redux/types/TTTypes";

export type TournamentReduxProps = TTStoreState & { disableMusic: boolean };

export function mapStateToProps(store: QuickHitReduxStores): TournamentReduxProps {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        tournaments: store.ttData.tournaments,
        disableMusic: store.viewStore.disableMusic,
    };
}

export default connect(mapStateToProps, mapTTDispatchToProps)(Tournament);

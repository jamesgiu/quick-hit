import { connect } from "react-redux";
import HallOfFallen from "../../components/HallOfFallen/HallOfFallen";
import { mapTTDispatchToProps } from "../shared";
import { QuickHitReduxStores } from "../../redux/types/store";
import { TTStoreState } from "../../redux/types/TTTypes";
import { DbInstance } from "../../types/database/models";

export type HallOfFallenReduxProps = TTStoreState & { disableMusic: boolean; chosenInstance?: DbInstance };

export function mapStateToProps(store: QuickHitReduxStores): HallOfFallenReduxProps {
    return {
        loading: store.ttData.loading,
        players: store.ttData.players,
        matches: store.ttData.matches,
        refresh: store.ttData.refresh,
        happyHour: store.ttData.happyHour,
        badges: store.ttData.badges,
        tournaments: store.ttData.tournaments,
        disableMusic: store.viewStore.disableMusic,
        chosenInstance: store.authStore.chosenInstance,
    };
}

export default connect(mapStateToProps, mapTTDispatchToProps)(HallOfFallen);

import {QuickHitReduxStores} from "../../index";
import {TTStoreState} from "../../redux/types/TTTypes";

export interface TTDataPropsType {
    loaderData: TTStoreState,
}

export function mapTTDataToProps(store: QuickHitReduxStores) {
    return {
        loaderData: { loading: store.ttData.loading, playersMap: store.ttData.playersMap, matches: store.ttData.matches },
    }
}

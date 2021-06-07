import {TTStoreState} from "../../redux/types/TTTypes";

export interface TTDataPropsType extends TTStoreState {}

export function mapTTDataToProps(store: TTStoreState) {
    return {
        loading: store.loading,
        players: store.players,
        matches: store.matches,
    }
}

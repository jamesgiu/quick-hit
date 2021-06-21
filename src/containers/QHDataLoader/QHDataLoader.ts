import {Dispatch} from "redux";
import * as actions from "../../redux/actions/TTActions";
import {connect} from "react-redux";
import QHDataLoader from "../../components/QHDataLoader/QHDataLoader";
import {DbMatch, DbPlayer} from "../../types/database/models";
import {mapTTDataToProps} from "../shared";

export function mapDispatchToProps(dispatch: Dispatch<actions.SetLoadingAction | actions.SetMatchesAction | actions.SetPlayersAction | actions.SetForceRefreshAction>) {
    return {
        setMatches: (newMatches: DbMatch[]) => dispatch(actions.setMatches(newMatches)),
        setPlayers: (newPlayers: DbPlayer[]) => dispatch(actions.setPlayers(newPlayers)),
        setLoading: (newLoading: boolean) => dispatch(actions.setLoading(newLoading)),
        setForceRefresh: (newRefresh: boolean) => dispatch(actions.setRefresh(newRefresh)),
    };
}

export default connect(mapTTDataToProps, mapDispatchToProps)(QHDataLoader);
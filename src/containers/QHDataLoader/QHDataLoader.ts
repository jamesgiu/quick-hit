import { Dispatch } from "redux";
import * as actions from "../../redux/actions/TTActions";
import { connect } from "react-redux";
import QHDataLoader from "../../components/QHDataLoader/QHDataLoader";
import {DbBadge, DbDoublesPair, DbHappyHour, DbMatch, DbPlayer, DbTournament} from "../../types/database/models";
import { mapTTDataToProps, TTRefreshDispatchType } from "../shared";

export interface DataLoaderDispatchType extends TTRefreshDispatchType {
    setMatches: (newMatches: DbMatch[]) => void;
    setPlayers: (newPlayers: DbPlayer[]) => void;
    setHappyHour: (newHappyHour: DbHappyHour) => void;
    setLoading: (newLoading: boolean) => void;
    setBadges: (newBadges: DbBadge[]) => void;
    setTournaments: (newTournaments: DbTournament[]) => void;
    setDoublesPairs: (newDoublesPairs: DbDoublesPair[]) => void;
}

export function mapDispatchToProps(
    dispatch: Dispatch<
        | actions.SetLoadingAction
        | actions.SetMatchesAction
        | actions.SetPlayersAction
        | actions.SetForceRefreshAction
        | actions.SetHappyHourAction
        | actions.SetBadgesAction
        | actions.SetTournamentsAction
        | actions.SetDoublesPairsAction
    >
): DataLoaderDispatchType {
    return {
        setMatches: (newMatches: DbMatch[]): actions.SetMatchesAction => dispatch(actions.setMatches(newMatches)),
        setPlayers: (newPlayers: DbPlayer[]): actions.SetPlayersAction => dispatch(actions.setPlayers(newPlayers)),
        setHappyHour: (newHappyHour: DbHappyHour): actions.SetHappyHourAction =>
            dispatch(actions.setHappyHour(newHappyHour)),
        setLoading: (newLoading: boolean): actions.SetLoadingAction => dispatch(actions.setLoading(newLoading)),
        setForceRefresh: (newRefresh: boolean): actions.SetForceRefreshAction =>
            dispatch(actions.setRefresh(newRefresh)),
        setBadges: (newBadges: DbBadge[]): actions.SetBadgesAction => dispatch(actions.setBadges(newBadges)),
        setTournaments: (newTournaments: DbTournament[]): actions.SetTournamentsAction =>
            dispatch(actions.setTournaments(newTournaments)),
        setDoublesPairs: (newDoublesPairs: DbDoublesPair[]): actions.SetDoublesPairsAction => dispatch(actions.setDoublesPairs(newDoublesPairs)),
    };
}

export default connect(mapTTDataToProps, mapDispatchToProps)(QHDataLoader);

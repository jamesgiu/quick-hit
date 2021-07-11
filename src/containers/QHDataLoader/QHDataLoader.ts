import { Dispatch } from "redux";
import * as actions from "../../redux/actions/TTActions";
import { connect } from "react-redux";
import QHDataLoader from "../../components/QHDataLoader/QHDataLoader";
import { DbBadge, DbHappyHour, DbMatch, DbPlayer, DbTournament } from "../../types/database/models";
import { mapTTDataToProps, TTRefreshDispatchType } from "../shared";

export interface DataLoaderDispatchType extends TTRefreshDispatchType {
    setMatches: (newMatches: DbMatch[]) => void;
    setPlayers: (newPlayers: DbPlayer[]) => void;
    setHappyHour: (newHappyHour: DbHappyHour) => void;
    setLoading: (newLoading: boolean) => void;
    setBadges: (newBadges: DbBadge[]) => void;
    setTournaments: (newTournaments: DbTournament[]) => void;
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
    >
): DataLoaderDispatchType {
    return {
        setMatches: (newMatches: DbMatch[]) => dispatch(actions.setMatches(newMatches)),
        setPlayers: (newPlayers: DbPlayer[]) => dispatch(actions.setPlayers(newPlayers)),
        setHappyHour: (newHappyHour: DbHappyHour) => dispatch(actions.setHappyHour(newHappyHour)),
        setLoading: (newLoading: boolean) => dispatch(actions.setLoading(newLoading)),
        setForceRefresh: (newRefresh: boolean) => dispatch(actions.setRefresh(newRefresh)),
        setBadges: (newBadges: DbBadge[]) => dispatch(actions.setBadges(newBadges)),
        setTournaments: (newTournaments: DbTournament[]) => dispatch(actions.setTournaments(newTournaments)),
    };
}

export default connect(mapTTDataToProps, mapDispatchToProps)(QHDataLoader);

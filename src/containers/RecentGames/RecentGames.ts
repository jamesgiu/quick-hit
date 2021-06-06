import {connect} from "react-redux";
import RecentGames, {RecentGamesProps} from "../../components/RecentGames/RecentGames";
import {QuickHitReduxStores} from "../../index";

export function mapStateToProps(store: QuickHitReduxStores, ownProps: RecentGamesProps) {
    return {
        loaderData: { loading: store.ttData.loading, playersMap: store.ttData.playersMap, matches: store.ttData.matches },
        focusedPlayerId: ownProps.focusedPlayerId,
    }
}

export default connect(mapStateToProps, {})(RecentGames);
import {connect} from "react-redux";
import Home from "../../components/Home/Home";
import {TTStoreState} from "../../redux/types/TTTypes";

export function mapStateToProps(store: TTStoreState) {
    return {
        loading: store.loading,
        players: store.players,
        matches: store.matches,
    }
}

export default connect(mapStateToProps, {})(Home);
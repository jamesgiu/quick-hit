import {connect} from "react-redux";
import {mapTTDataToProps, mapTTDispatchToProps} from "../shared";
import PlayerStatistics from "../../components/PlayerStatistics/PlayerStatistics";

export default connect(mapTTDataToProps, mapTTDispatchToProps)(PlayerStatistics);
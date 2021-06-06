import {connect} from "react-redux";
import {mapTTDataToProps} from "../shared";
import PlayerStatistics from "../../components/PlayerStatistics/PlayerStatistics";

export default connect(mapTTDataToProps, {})(PlayerStatistics);
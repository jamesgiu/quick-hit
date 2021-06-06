import {connect} from "react-redux";
import Ladder from "../../components/Ladder/Ladder";
import {mapTTDataToProps} from "../shared";

export default connect(mapTTDataToProps, {})(Ladder);
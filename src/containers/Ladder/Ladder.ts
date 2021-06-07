import {connect} from "react-redux";
import Ladder from "../../components/Ladder/Ladder";
import {mapTTDataToProps, mapTTDispatchToProps} from "../shared";

export default connect(mapTTDataToProps, mapTTDispatchToProps)(Ladder);
import {connect} from "react-redux";
import Home from "../../components/Home/Home";
import {mapTTDataToProps, mapTTDispatchToProps} from "../shared";

export default connect(mapTTDataToProps, mapTTDispatchToProps)(Home);
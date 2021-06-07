import {connect} from "react-redux";
import Home from "../../components/Home/Home";
import {mapTTDataToProps} from "../shared";

export default connect(mapTTDataToProps, {})(Home);
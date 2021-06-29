import { connect } from "react-redux";
import Tournament from "../../components/Tournament/Tournament";
import { mapTTDataToProps, mapTTDispatchToProps } from "../shared";

export default connect(mapTTDataToProps, mapTTDispatchToProps)(Tournament);

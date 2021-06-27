import { connect } from "react-redux";
import { mapTTDataToProps, mapTTDispatchToProps } from "../shared";
import AchievementFeed from "../../components/PlayerStatistics/AchievementFeed";

export default connect(mapTTDataToProps, mapTTDispatchToProps)(AchievementFeed);

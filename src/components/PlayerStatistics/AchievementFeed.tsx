import React from "react";
import "./AchievementsFeed.css";
import {Divider, Feed, Header, Icon} from "semantic-ui-react";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";
import { DbBadge } from "../../types/database/models";
import {TTDataPropsTypeCombined} from "../../containers/shared";

export interface AchievementFeedProps {
    focusedPlayerId?: string,
}

function AchievementFeed(props: AchievementFeedProps & TTDataPropsTypeCombined): JSX.Element {
    const getAchievements = (): FeedEventProps[] => {
        if (props.players.length === 0) {
            return [];
        }

        const events: FeedEventProps[] = [];
        const playersMap = getPlayersMap(props.players);

        const relevantBadges = props.badges.filter((badge: DbBadge) => {return badge.player_id === props.focusedPlayerId});

        // Sort list from oldest to newest
        relevantBadges.sort((badgeA, badgeB) => {
            return new Date(badgeB.date).getTime() - new Date(badgeA.date).getTime();
        });

        relevantBadges.forEach((badge) => {
            const involvedPlayer = playersMap.get(badge.involved_player);
            events.push({
                meta: <div className={"event-summary"}>
                    {badge.text}
                    <Divider />
                </div>,
                date: (
                    <div className={"event-date"}>
                        {new Date(badge.date).toDateString()} during a match against:{" "}
                        <Icon name={involvedPlayer?.icon} /> {involvedPlayer?.name}
                    </div>
                ),
                content: <div className={"event-content"}>{badge.title}</div>,
                icon: badge.icon,
            });
        });

        return events;
    };

    return (
        <div className="achievements">
            <Header as={"h2"} icon>
                <Icon name="trophy" circular />
                <Header.Content>Achievements</Header.Content>
            </Header>
            <Feed className={"achievements-feed"} events={getAchievements()} />
        </div>
    );
}

export default AchievementFeed;

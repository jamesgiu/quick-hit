import React from "react";
import "./AchievementsFeed.css";
import {Feed, Header, Icon} from "semantic-ui-react";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";
import {DbBadge, DbPlayer} from "../../types/database/models";

export interface AchievementFeedProps {
    badges: DbBadge[];
    players: DbPlayer[];
}

function AchievementFeed(props: AchievementFeedProps): JSX.Element {
    const getAchievements = (): FeedEventProps[] => {
        if (props.players.length === 0) {
            return [];
        }

        const events: FeedEventProps[] = [];
        const playersMap = getPlayersMap(props.players);

        // Sort list from oldest to newest
        props.badges.sort((badgeA, badgeB) => {
            return new Date(badgeB.date).getTime() - new Date(badgeA.date).getTime();
        });

        props.badges.forEach((badge) => {
            const involvedPlayer = playersMap.get(badge.involved_player);
            events.push({
                meta: (
                    <div className={"event-content"}>
                        {badge.title}
                    </div>
                ),
                date: <div className={"event-date"}>{new Date(badge.date).toDateString()} during a match against: <Icon name={involvedPlayer?.icon}/> {involvedPlayer?.name}</div>,
                content: (
                    <div className={"event-summary"}>
                        {badge.text}
                    </div>
                ),
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
            <Feed className={"achievements-feed"} events={getAchievements()}/>
        </div>
    );
}

export default AchievementFeed;

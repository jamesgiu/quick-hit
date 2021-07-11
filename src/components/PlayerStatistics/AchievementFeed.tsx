import React from "react";
import "./AchievementsFeed.css";
import { Divider, Feed, Header, Icon } from "semantic-ui-react";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import { getPlayersMap } from "../QHDataLoader/QHDataLoader";
import { DbBadge } from "../../types/database/models";
import { TTDataPropsTypeCombined } from "../../containers/shared";

export interface AchievementFeedProps {
    focusedPlayerId?: string;
}

function AchievementFeed(props: AchievementFeedProps & TTDataPropsTypeCombined): JSX.Element {
    // Calculate the global percentage of players who have obtained this achievement.
    const calculateAttainmentPercentage = (focusedBadge: DbBadge): number => {
        const badgeHolders: DbBadge[] = props.badges.filter((badge: DbBadge) =>
            badge.key === focusedBadge.key
        );
        const percentage = (badgeHolders.length / props.players.length) * 100;

        return percentage;
    }

    // Obtain a feed of achievements that the focused player has obtained.
    const getAchievements = (): FeedEventProps[] => {
        if (props.players.length === 0) {
            return [];
        }

        const events: FeedEventProps[] = [];
        const playersMap = getPlayersMap(props.players);

        const relevantBadges = props.badges.filter((badge: DbBadge) => 
            badge.player_id === props.focusedPlayerId
        );

        // Sort list from oldest to newest
        relevantBadges.sort((badgeA, badgeB) => 
            new Date(badgeB.date).getTime() - new Date(badgeA.date).getTime()
        );

        relevantBadges.forEach((badge) => {
            const involvedPlayer = playersMap.get(badge.involved_player);

            events.push({
                meta: (
                    <div className={"event-summary"}>
                        {badge.text}
                        <div>{calculateAttainmentPercentage(badge).toFixed(1)}% of players have this achievement</div>
                        <Divider />
                    </div>
                ),
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

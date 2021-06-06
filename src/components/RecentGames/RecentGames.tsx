import React from 'react';
import './RecentGames.css';
import {Divider, Feed, Header, Icon, Transition} from "semantic-ui-react";
import {FeedEventProps} from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import ReactTimeAgo from 'react-time-ago';
import {TTDataPropsType} from "../../containers/shared";

export interface RecentGamesProps {
    focusedPlayerId?: string,
}

interface RecentGamesCombinedProps extends RecentGamesProps, TTDataPropsType {};

function RecentGames(props: RecentGamesCombinedProps) {
    console.log(props);
    const getMatchEvents = () : FeedEventProps[] => {
        if (props.loaderData.playersMap.size === 0) {
            return [];
        }

        const events : FeedEventProps[] = [];
        const playersMap = props.loaderData.playersMap;

        // Sort list from oldest to newest
        props.loaderData.matches.sort((matchA, matchB) => {
           return new Date(matchB.date).getTime() - new Date(matchA.date).getTime();
        })

        props.loaderData.matches.forEach((match) => {
            const winningPlayer = playersMap.get(match.winning_player_id)!;
            const losingPlayer = playersMap.get(match.losing_player_id)!;

            // If we are focusing on a certain player's recent games only
            if (props.focusedPlayerId) {
                if (winningPlayer.id !== props.focusedPlayerId && losingPlayer.id !== props.focusedPlayerId) {
                    // Skip this match in the loop, as it does not contain our focused player.
                    return
                }
            }

            events.push({
                meta:
                    <div className={"event-content"}>
                        {winningPlayer.name} ({match.winning_player_original_elo}
                        <span className={"elo-gain"}>
                            +{match.winner_new_elo - match.winning_player_original_elo}
                        </span>) defeated {losingPlayer.name} ({match.losing_player_original_elo}
                        <span className={"elo-loss"}>
                            -{match.losing_player_original_elo - match.loser_new_elo}
                        </span>) <ReactTimeAgo date={new Date(match.date)}/>...
                        <Divider/>
                    </div>,
                date:
                    <div className={"event-date"}>
                        {new Date(match.date).toDateString()}
                    </div>,
                content:
                    <div className={"event-summary"}>
                        <Icon name={winningPlayer.icon} color={"green"}/>
                        <span className={"game-winner"}>{winningPlayer.name} </span>
                        <span className={"game-winner"}>({match.winning_player_score})</span>
                        <Icon name={"chevron right"} color={"orange"}/>
                        <Icon name={losingPlayer.icon} color={"red"}/>
                        <span className={"game-loser"}>{losingPlayer.name} </span>
                        <span className={"game-loser"}>({match.losing_player_score})</span>
                    </div>,
                icon: winningPlayer.icon
            })
        });

        return events;
    }

    return (
        <div className="recent-games">
            <Header as={"h2"} icon>
                <Icon name='history' circular/>
                <Header.Content>Recent games</Header.Content>
            </Header>
            <Transition visible={!props.loaderData.loading}>
                <Feed className={"games-feed"} events={getMatchEvents()}/>
            </Transition>
        </div>
    );
}

export default RecentGames;

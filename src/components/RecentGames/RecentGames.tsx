import React, {useState} from 'react';
import './RecentGames.css';
import {Divider, Feed, Header, Icon, Transition} from "semantic-ui-react";
import {FeedEventProps} from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import QHDataLoader, {LoaderData} from "../QHDataLoader/QHDataLoader";
import {DB_Player} from "../../types/database/models";
import ReactTimeAgo from 'react-time-ago';

function RecentGames() {
    const [loaderData, setLoaderData] = useState<LoaderData>({playersMap: new Map<string, DB_Player>(), matches: [], loading: true});

    const getMatchEvents = () : FeedEventProps[] => {
        if (loaderData.playersMap.size === 0) {
            return [];
        }

        const events : FeedEventProps[] = [];
        const playersMap = loaderData.playersMap;

        // Sort list from oldest to newest
        loaderData.matches.sort((matchA, matchB) => {
           return new Date(matchB.date).getTime() - new Date(matchA.date).getTime();
        })

        loaderData.matches.forEach((match) => {
            const winningPlayer = playersMap.get(match.winning_player_id)!;
            const losingPlayer = playersMap.get(match.losing_player_id)!;

            events.push({
                meta:
                    <div className={"event-content"}>
                        {winningPlayer.name} defeated {losingPlayer.name} <ReactTimeAgo date={new Date(match.date)}/>...
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
        })

        return events;
    }

    const receiveDataFromLoader = (data: LoaderData) => {
        setLoaderData(data);
    }

    return (
        <div className="recent-games">
            <Header as={"h2"} icon>
                <Icon name='history' circular/>
                <Header.Content>Recent games</Header.Content>
            </Header>
            <QHDataLoader dataReceivedCallback={receiveDataFromLoader}/>
            <Transition visible={!loaderData.loading}>
                <Feed className={"games-feed"} events={getMatchEvents()}/>
            </Transition>
        </div>
    );
}

export default RecentGames;

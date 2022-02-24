import React, { useEffect, useState } from "react";
import "./RecentGames.css";
import { Button, Divider, DropdownItemProps, Feed, Header, Icon, Modal, Pagination, PaginationProps, Popup, Select, Transition } from "semantic-ui-react";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import ReactTimeAgo from "react-time-ago";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { getPlayersMap, getWinLossForPlayer } from "../QHDataLoader/QHDataLoader";
import { DbMatch, DbMatchReaction, DbPlayer, isUnderPlacement } from "../../types/database/models";
import RecentGamesStatistics from "./RecentGamesStatistics/RecentGamesStatistics";
import EmojiPicker, { SKIN_TONE_NEUTRAL } from "emoji-picker-react";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { v4 } from "uuid";
import { makeErrorToast } from "../Toast/Toast";
import { renderPlayerOption } from "../NewGame/NewGame";

export interface RecentGamesProps {
    focusedPlayerId?: string;
}

export type RecentGamesCombinedProps = RecentGamesProps & TTDataPropsTypeCombined;

// TODOS
// - Add count to emoji button
// - Allow reactions to be removed
// - Allow existing reactions by other users to be added to

const sendReactRequest = (
    matchId: string,
    emoji: string,
    setReactingTo: (matchId: string | undefined) => void,
    currentUser: string,
): void => {
    const matchReaction: DbMatchReaction = {
        id: v4(),
        matchId,
        reactorId: currentUser,
        reaction: emoji
    }
    QuickHitAPI.addMatchReation(
        matchReaction,
        () => setReactingTo(undefined),
        (errorMsg) => makeErrorToast("Could not react!", errorMsg)
    );
};

export const turnMatchIntoFeedItems = (
    filteredMatches: DbMatch[],
    allMatches: DbMatch[],
    players: DbPlayer[],
    offset: number,
    nextPageOffset: number,
    matchReactions: DbMatchReaction[],
    reactingTo: string | undefined,
    setReactingTo: ((matchId: string | undefined) => void) | undefined,
    currentUser: string | undefined,
): FeedEventProps[] => {
    if (filteredMatches.length === 0 || players.length === 0) {
        return [];
    }

    const events: FeedEventProps[] = [];
    const playersMap = getPlayersMap(players);

    for (let i = offset; i < nextPageOffset; i++) {
        if (i > filteredMatches.length - 1) {
            break;
        }

        const match = filteredMatches[i];

        const winningPlayer = playersMap.get(match.winning_player_id);
        const losingPlayer = playersMap.get(match.losing_player_id);

        if (!(winningPlayer && losingPlayer)) {
            break;
        }

        const winningPlayerWinLoss = getWinLossForPlayer(match.winning_player_id, allMatches);
        const losingPlayerWinLoss = getWinLossForPlayer(match.losing_player_id, allMatches);

        const winningPlayerUnranked = isUnderPlacement(winningPlayerWinLoss.matches);
        const losingPlayerUnranked = isUnderPlacement(losingPlayerWinLoss.matches);

        const relevantMatchReactions = matchReactions.filter((reaction) => reaction.matchId === match.id);
        const previousReactions: JSX.Element[] = [];
        relevantMatchReactions.forEach((reaction) => {
            previousReactions.push(
                <Popup content={playersMap.get(reaction.reactorId)?.name} trigger={
                    <Button className={"reaction"}
                                           content={reaction.reaction}
                                           size={"mini"}
                                           color={reaction.reactorId === currentUser ? "orange" : "grey"} />
                }/>
            );
        });

        events.push({
            key: match.id,
            meta: (
                <div className={"event-content"}>
                    {winningPlayer.name} ({winningPlayerUnranked ? "??" : match.winning_player_original_elo}
                    <span className={"elo-gain"}>
                        {winningPlayerUnranked
                            ? "+??=??"
                            : `+${match.winner_new_elo - match.winning_player_original_elo}=${match.winner_new_elo}`}
                    </span>
                    ) defeated {losingPlayer.name} ({losingPlayerUnranked ? "??" : match.losing_player_original_elo}
                    <span className={"elo-loss"}>
                        {losingPlayerUnranked
                            ? "-??=??"
                            : `-${match.losing_player_original_elo - match.loser_new_elo}=${match.loser_new_elo}`}
                    </span>
                    ) <ReactTimeAgo date={new Date(match.date)} />
                    ...
                    <br/>
                    {previousReactions}
                    {setReactingTo &&
                        <Button className={"reaction"} icon={"plus"} color={"grey"} size={"mini"} onClick={(): void => setReactingTo(match.id)} />
                    }
                    {reactingTo === match.id && setReactingTo && currentUser &&
                        <EmojiPicker 
                            onEmojiClick={(_, emojiObject): void => sendReactRequest(match.id, emojiObject.emoji, setReactingTo, currentUser)}
                            skinTone={SKIN_TONE_NEUTRAL} />}
                    <Divider />
                </div>
            ),
            date: <div className={"event-date"}>{new Date(match.date).toDateString()}</div>,
            content: (
                <div className={"event-summary"}>
                    <Icon name={winningPlayer.icon} color={"green"} />
                    <span className={"game-winner"}>{winningPlayer.name} </span>
                    <span className={"game-winner"}>({match.winning_player_score})</span>
                    <Icon name={"chevron right"} color={"orange"} />
                    <Icon name={losingPlayer.icon} color={"red"} />
                    <span className={"game-loser"}>{losingPlayer.name} </span>
                    <span className={"game-loser"}>({match.losing_player_score})</span>
                    <span className={"happy-hour"}>
                        {match.happy_hour && (
                            <span>
                                <Icon name={"smile"} />
                                Happy hour!
                            </span>
                        )}
                    </span>
                </div>
            ),
            icon: winningPlayer.icon,
        });
    }

    return events;
};

function RecentGames(props: RecentGamesCombinedProps): JSX.Element {
    const PAGE_SIZE = 5;
    // Track this in state, as we may potentially filter the matches to only be focused ones.
    const [matches, setMatches] = React.useState<DbMatch[]>(props.matches);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [reactingTo, setReactingTo] = useState<string | undefined>(undefined);
    const [matchReactions, setMatchReactions] = useState<DbMatchReaction[]>([]);
    const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);

    // Runs on mount.
    useEffect(() => {
        sortAndFilterMatches();
    }, []);

    // When the matches change, re-sort them.
    useEffect(() => {
        sortAndFilterMatches();
    }, [props.matches]);

    useEffect(() => {
        QuickHitAPI.getMatchReactions(setMatchReactions, (errorStr) => makeErrorToast("Could not get reactions!", errorStr));
    }, [props.matches, reactingTo]);

    const sortAndFilterMatches = (): void => {
        let sortedAndFilteredMatches: DbMatch[] = props.matches;
        // Determine which matches will make up our Recent Games set on mount to save performance.
        // If we are focusing on a player, do the filter now.
        if (props.focusedPlayerId) {
            sortedAndFilteredMatches = sortedAndFilteredMatches.filter(
                (match) =>
                    match.winning_player_id === props.focusedPlayerId ||
                    match.losing_player_id === props.focusedPlayerId
            );
        }

        // Sort list from newest to oldest
        sortedAndFilteredMatches = sortedAndFilteredMatches.sort((matchA, matchB) => {
            return new Date(matchB.date).getTime() - new Date(matchA.date).getTime();
        });

        // Set this filtered and sorted match object in state, for later use.
        setMatches(sortedAndFilteredMatches);
    };

    const getTotalPages = (): number => {
        return Math.max(Math.ceil(matches.length / PAGE_SIZE), 1);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setCurrentPage(data.activePage as number);
    };

    const getMatchEvents = (): FeedEventProps[] => {
        // Use index access for pagination, with a max result size of PAGE_SIZE and offset generated by the current page
        // * page-size.
        // - 1 as `currentPage` starts at 1, but we actually start at 0 for our page offset calculations.
        const offset = (currentPage - 1) * PAGE_SIZE;
        const nextPageOffset = currentPage * PAGE_SIZE;

        return turnMatchIntoFeedItems(
            matches, props.matches, props.players, offset, nextPageOffset, matchReactions, reactingTo, setReactingTo, currentUser
        );
    };

    return (
        <div className="recent-games">
            <Header as={"h2"} icon>
                <Icon name="history" circular />
                <Header.Content>Recent games</Header.Content>
            </Header>
            <Transition visible={!props.loading}>
                <span>
                    <RecentGamesStatistics matches={matches} />
                    <Feed className={"games-feed"} events={getMatchEvents()} />
                    {
                        /* Show pagination if number of pages is greater than 1 */
                        getTotalPages() > 1 && (
                            <Pagination
                                totalPages={getTotalPages()}
                                defaultActivePage={1}
                                onPageChange={handlePageChange}
                                siblingRange={0}
                                firstItem={null}
                                lastItem={null}
                            />
                        )
                    }
                </span>
            </Transition>
            <Modal
                open={reactingTo !== undefined && !currentUser}
                header={"Wait a sec, who are you?"}
                content={<Select
                    fluid
                    label={"Player"}
                    options={props.players.map((player) => renderPlayerOption(player))}
                    search={(options, value): DropdownItemProps[] => {
                        return options.filter((option) => {
                            const player = JSON.parse(option.value as string);
                            return player.name.toLowerCase().includes(value.toLowerCase());
                        });
                    }}
                    placeholder="Average Commenter"
                    onChange={(_, data): void => setCurrentUser(JSON.parse(data.value as string).id)}
                />}
            />
        </div>
    );
}

export default RecentGames;

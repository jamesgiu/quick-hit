import React, { useEffect, useState } from "react";
import "./RecentGames.css";
import {
    Button,
    Comment,
    CommentGroup,
    Divider,
    DropdownItemProps,
    Feed,
    Form,
    Header,
    Icon,
    Modal,
    Pagination,
    PaginationProps,
    Popup,
    Select,
    Transition,
} from "semantic-ui-react";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import ReactTimeAgo from "react-time-ago";
import { TTDataPropsTypeCombined } from "../../containers/shared";
import { getPlayersMap, getWinLossForPlayer } from "../QHDataLoader/QHDataLoader";
import { DbMatch, DbMatchComment, DbMatchReaction, DbPlayer, isUnderPlacement } from "../../types/database/models";
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

// TODOs:
// - Comment text should erase on comment.
// - Comments should update in modal on comment.

// A very simple interface representing a reaction for a user that is yet to identify themselves.
interface PendingReaction {
    matchId: string;
    emoji: string;
}

/**
 * Add a reaction for the match with the supplied ID with the supplied emoji by the supplied user.
 * @param matchId The ID of the match being reacted to.
 * @param emoji The emoji being reacted with.
 * @param setReactingTo The useState setter to call on success, resetting the match being reacted to.
 * @param currentUser The user being currently identified as.
 * @param matchReactions All previous match reactions, used to ensure the same user isn't using the same emoji against the same
 * post more than once.
 */
const sendReactRequest = (
    matchId: string,
    emoji: string,
    setReactingTo: (matchId: string | undefined) => void,
    currentUser: string,
    matchReactions?: DbMatchReaction[]
): void => {
    if (
        matchReactions &&
        matchReactions.filter(
            (reaction) =>
                reaction.matchId === matchId && reaction.reaction === emoji && reaction.reactorId === currentUser
        ).length !== 0
    ) {
        makeErrorToast("You can't do that!", "No double reacts allowed.");
        return;
    }
    const matchReaction: DbMatchReaction = {
        id: v4(),
        matchId,
        reactorId: currentUser,
        reaction: emoji,
    };
    QuickHitAPI.addMatchReation(
        matchReaction,
        () => setReactingTo(undefined),
        (errorMsg) => makeErrorToast("Could not react!", errorMsg)
    );
};

const sendCommentRequest = (
    matchId: string,
    comment: string,
    setCommentText: (comment: string) => void,
    currentUser: string
): void => {
    const matchComment: DbMatchComment = {
        id: v4(),
        matchId,
        commenterId: currentUser,
        comment,
        timestamp: new Date().toISOString()
    };
    QuickHitAPI.addMatchComment(
        matchComment,
        () => setCommentText(""),
        (errorMsg) => makeErrorToast("Could not comment!", errorMsg)
    );
};

/**
 * Handle the click on an existing match reaction.
 * @param emoji The emoji of the existing reaction.
 * @param reactors The list of user IDs for the users that previously reacted with this emoji for this match.
 * @param currentUser The ID of the user being currently identified as.
 * @param matchId The ID of the match that the clicked-on reaction is for.
 * @param setReactingTo The useState setter to call on success, resetting the match being reacted to.
 * @param setPendingReaction The useState setter to call if the user has not yet identified themselves.
 * @param allMatchReactions All previous reactions for the relevant match, used when a user is removing their reaction.
 */
const handleReactionClick = (
    emoji: string,
    reactors: string[],
    currentUser: string | undefined,
    matchId: string,
    setReactingTo: ((matchId: string | undefined) => void) | undefined,
    setPendingReaction: (reaction: PendingReaction) => void,
    allMatchReactions: DbMatchReaction[]
): void => {
    if (setReactingTo) {
        // We need the below so that the updated reactions will be retrieved without showing the selector, which it would if we
        // set reactingTo to the match's ID.
        setReactingTo("");
        if (currentUser) {
            if (reactors.includes(currentUser)) {
                const reactionToRemove = allMatchReactions.filter(
                    (reaction) => reaction.reaction === emoji && reaction.reactorId === currentUser
                )[0].id;
                QuickHitAPI.removeMatchReaction(
                    reactionToRemove,
                    () => setReactingTo(undefined),
                    (errorStr) => makeErrorToast("Could not remove reaction!", errorStr)
                );
            } else {
                sendReactRequest(matchId, emoji, setReactingTo, currentUser);
            }
        } else {
            setPendingReaction({ matchId, emoji });
        }
    }
};

/**
 * Generate the tooltip content for a reaction.
 * @param reactors The list of IDs of those that have used this reaction on this match.
 * @param playersMap The map of IDs to player objects.
 * @returns A comma-separated string of player names that have reacted.
 */
const getReactionTooltip = (reactors: string[], playersMap: Map<string, DbPlayer>): string => {
    const reactorNames: string[] = [];
    reactors.forEach((reactor) => {
        if (playersMap.has(reactor)) {
            // We need the 'as string' here because TypeScript isn't smart enough to realise that the previous .has() call means
            // that this .get() call will never be undefined.
            reactorNames.push(playersMap.get(reactor)?.name as string);
        }
    });
    // All this complicated localeCompare() call does is compare case-insensitively.
    reactorNames.sort((name1, name2) => name1.localeCompare(name2, undefined, { sensitivity: "base" }));
    return reactorNames.join(", ");
};

export const turnMatchIntoFeedItems = (
    filteredMatches: DbMatch[],
    allMatches: DbMatch[],
    players: DbPlayer[],
    offset: number,
    nextPageOffset: number,
    matchReactions?: DbMatchReaction[],
    reactingTo?: string,
    setReactingTo?: (matchId: string | undefined) => void,
    currentUser?: string,
    setPendingReaction?: (reaction: PendingReaction) => void,
    matchComments?: DbMatchComment[],
    commentingOn?: string,
    setCommentingOn?: (matchId: string | undefined) => void,
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

        const previousReactions: JSX.Element[] = [];
        if (matchReactions && setPendingReaction) {
            const relevantMatchReactions = matchReactions.filter((reaction) => reaction.matchId === match.id);
            // Collect the reactions by emoji so we can have counts.
            const collectedReactions = new Map<string, string[]>();
            relevantMatchReactions.forEach((reaction) => {
                if (collectedReactions.has(reaction.reaction)) {
                    collectedReactions.get(reaction.reaction)?.push(reaction.reactorId);
                } else {
                    collectedReactions.set(reaction.reaction, [reaction.reactorId]);
                }
            });
            // Sort the reactions by emoji name so that we don't have reactions moving all over the place when new ones are added.
            new Map([...collectedReactions.entries()].sort((r1, r2) => r1[0].localeCompare(r2[0]))).forEach(
                (reactors, reaction) => {
                    previousReactions.push(
                        <Popup
                            content={getReactionTooltip(reactors, playersMap)}
                            trigger={
                                <Button
                                    className={"reaction"}
                                    content={
                                        <div>
                                            {reaction}
                                            <span className={"reactions-count"}>{reactors.length}</span>
                                        </div>
                                    }
                                    size={"mini"}
                                    color={currentUser && reactors.includes(currentUser) ? "orange" : "grey"}
                                    onClick={(): void =>
                                        handleReactionClick(
                                            reaction,
                                            reactors,
                                            currentUser,
                                            match.id,
                                            setReactingTo,
                                            setPendingReaction,
                                            relevantMatchReactions
                                        )
                                    }
                                />
                            }
                        />
                    );
                }
            );
        }

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
                    <br />
                    {previousReactions}
                    {setReactingTo && (
                        <Button
                            className={"reaction"}
                            icon={reactingTo === match.id ? "chevron up" : "plus"}
                            color={"grey"}
                            size={"mini"}
                            onClick={(): void => setReactingTo(reactingTo === match.id ? undefined : match.id)}
                        />
                    )}
                    {setCommentingOn && matchComments && (
                        <Button
                            className={"reaction"}
                            content={
                                <div>
                                    <Icon name={"comment"} />
                                    <span className={"reactions-count"}>
                                        {matchComments.filter(comment => comment.matchId === match.id).length}
                                    </span>
                                </div>
                            }
                            color={"grey"}
                            size={"mini"}
                            onClick={(): void => setCommentingOn(match.id)}
                    />
                    )}
                    {reactingTo === match.id && setReactingTo && currentUser && (
                        <div>
                            <EmojiPicker
                                onEmojiClick={(_, emojiObject): void =>
                                    sendReactRequest(
                                        match.id,
                                        emojiObject.emoji,
                                        setReactingTo,
                                        currentUser,
                                        matchReactions
                                    )
                                }
                                skinTone={SKIN_TONE_NEUTRAL}
                                disableSkinTonePicker
                            />
                        </div>
                    )}
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

const getCommentObjects = (comments: DbMatchComment[], playersMap: Map<string, DbPlayer>): JSX.Element[] => {
    const commentObjects: JSX.Element[] = [];
    comments.forEach((comment) => {
        const commenterName = playersMap.get(comment.commenterId)?.name;
        commentObjects.push(
            <Comment>
                <Comment.Content>
                    <Comment.Author>{commenterName}</Comment.Author>
                    <Comment.Text>{comment.comment}</Comment.Text>
                </Comment.Content>
            </Comment>
        );
    });
    return commentObjects;
};

function RecentGames(props: RecentGamesCombinedProps): JSX.Element {
    const PAGE_SIZE = 5;
    // Track this in state, as we may potentially filter the matches to only be focused ones.
    const [matches, setMatches] = React.useState<DbMatch[]>(props.matches);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [reactingTo, setReactingTo] = useState<string | undefined>(undefined);
    const [commentingOn, setCommentingOn] = useState<string | undefined>(undefined);
    const [matchReactions, setMatchReactions] = useState<DbMatchReaction[]>([]);
    const [matchComments, setMatchComments] = useState<DbMatchComment[]>([]);
    const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);
    const [pendingReaction, setPendingReaction] = useState<PendingReaction | undefined>(undefined);
    const [commentText, setCommentText] = useState<string>("");

    // Runs on mount.
    useEffect(() => {
        sortAndFilterMatches();
    }, []);

    // When the matches change, re-sort them.
    useEffect(() => {
        sortAndFilterMatches();
    }, [props.matches]);

    // When the matches change or the post the user is reacting to changes (e.g. a new reaction has been added), retrieve all reactions
    // again.
    useEffect(() => {
        QuickHitAPI.getMatchReactions(setMatchReactions, (errorStr) =>
            makeErrorToast("Could not get reactions!", errorStr)
        );
    }, [props.matches, reactingTo]);

    useEffect(() => {
        QuickHitAPI.getMatchComments(setMatchComments, (errorStr) => 
            makeErrorToast("Could not get comments!", errorStr)
        );
    }, [props.matches, commentingOn]);

    // If the user has just identified themselves, check if they just clicked to add another reaction immediately beforehand, and if so,
    // add that reaction to the identified user.
    useEffect(() => {
        if (pendingReaction && currentUser) {
            sendReactRequest(
                pendingReaction.matchId,
                pendingReaction.emoji,
                setReactingTo,
                currentUser,
                matchReactions
            );
            setPendingReaction(undefined);
        }
    }, [currentUser]);

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
            matches,
            props.matches,
            props.players,
            offset,
            nextPageOffset,
            matchReactions,
            reactingTo,
            setReactingTo,
            currentUser,
            setPendingReaction,
            matchComments,
            commentingOn,
            setCommentingOn
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
                open={(reactingTo !== undefined || commentingOn !== undefined) && !currentUser}
                header={"Wait a sec, who are you?"}
                content={
                    <Select
                        fluid
                        label={"Player"}
                        options={props.players.map((player) => renderPlayerOption(player))}
                        search={(options, value): DropdownItemProps[] => {
                            return options.filter((option) => {
                                const player = JSON.parse(option.value as string);
                                return player.name.toLowerCase().includes(value.toLowerCase());
                            });
                        }}
                        placeholder={"Average Commenter"}
                        onChange={(_, data): void => setCurrentUser(JSON.parse(data.value as string).id)}
                    />
                }
            />
            {commentingOn !== undefined && currentUser !== undefined && 
            <Modal open={commentingOn !== undefined && currentUser !== undefined}
                   closeIcon
                   onClose={(): void => setCommentingOn(undefined)}>
                   <Modal.Header>Comments</Modal.Header>
                   <Modal.Content>
                       <CommentGroup>
                           {getCommentObjects(matchComments.filter(comment => comment.matchId === commentingOn),
                                              getPlayersMap(props.players))}
                           <Form reply>
                               <Form.TextArea onChange={(_, {value}): void => {
                                                   setCommentText(value as string ?? "");
                                               }}
                                               value={commentText} />
                               <Button content={"Add Comment"}
                                       color={"blue"}
                                       onClick={(): void => sendCommentRequest(commentingOn, commentText, setCommentingOn, currentUser)} />
                           </Form>
                       </CommentGroup>
                   </Modal.Content>
               </Modal>}
        </div>
    );
}

export default RecentGames;

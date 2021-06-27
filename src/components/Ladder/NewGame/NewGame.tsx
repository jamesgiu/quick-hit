import {Button, Form, Icon, Modal} from "semantic-ui-react";
import React from "react";
import "./NewGame.css";
import {DbHappyHour, DbMatch, DbPlayer} from "../../../types/database/models";
import {makeErrorToast, makeSuccessToast} from "../../Toast/Toast";
import EloRank from "elo-rank";
import { v4 as uuidv4 } from 'uuid';
import {QuickHitAPI} from "../../../api/QuickHitAPI";

interface NewGameProps {
    players: DbPlayer[],
    happyHour: DbHappyHour,
    customModalOpenElement?: JSX.Element,
    // Callback for when a new game is added.
    onNewGameAdded?: ()=> void,
}

/**
 * QuickHit NewGame component.
 */
function NewGame(props: NewGameProps) : JSX.Element {
    const [open, setModalOpen] = React.useState<boolean>(false)
    const [winningPlayer, setWinningPlayer] = React.useState<DbPlayer>()
    const [losingPlayer, setLosingPlayer] = React.useState<DbPlayer>()
    const [winningPlayerScore, setWinningPlayerScore] = React.useState<number | undefined>(undefined)
    const [losingPlayerScore, setLosingPlayerScore] = React.useState<number | undefined>(undefined)

    const sendCreateRequest =  (addAnother: boolean)  => {
        const onSuccess = () => {
            makeSuccessToast("Game added!", "Back to work?");
            if (!addAnother) {
                setModalOpen(false);
            }
            setWinningPlayer(undefined);
            setLosingPlayer(undefined);
            setWinningPlayerScore(undefined);
            setLosingPlayerScore(undefined);

            if (props.onNewGameAdded) {
                props.onNewGameAdded();
            }
        }

        const onError = (errorMsg: string) => {
            makeErrorToast("Game not added!", errorMsg);
        }

        if (!(winningPlayer && losingPlayer) || winningPlayerScore === undefined || losingPlayerScore === undefined) {
            return;
        }

        if (winningPlayer?.id === losingPlayer?.id)
        {
            makeErrorToast("Get outta here", "Players cannot beat themselves on QuickHit");
            return;
        }

        if (winningPlayerScore <= losingPlayerScore)
        {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
            return;
        }

        let kFactor = 15;
        let happyHour = false;

        // If it is currently a happy hour.
        if (new Date().getHours() <= props.happyHour.hourStart &&  new Date().getHours() >= props.happyHour.hourStart - 1) {
            kFactor = 15 * props.happyHour.multiplier;
            happyHour = true;
        }

        const elo = new EloRank(kFactor);
        const winnerElo = winningPlayer.elo;
        const loserElo = losingPlayer.elo;

        //Gets expected score for first parameter
        const winningPlayerExpectedScore = elo.getExpected(winnerElo, loserElo);
        const losingPlayerExpectedScore = elo.getExpected(loserElo, winnerElo);

        //update score, 1 if won 0 if lost
        const winnerNewElo = elo.updateRating(winningPlayerExpectedScore, 1, winnerElo);
        const loserNewElo = elo.updateRating(losingPlayerExpectedScore, 0, loserElo);

        const matchToAdd : DbMatch = {
            id: uuidv4(),
            date: new Date().toISOString(),
            winning_player_id: winningPlayer.id,
            winning_player_score: winningPlayerScore,
            winning_player_original_elo: winnerElo,
            losing_player_id: losingPlayer.id,
            losing_player_score: losingPlayerScore,
            losing_player_original_elo: loserElo,
            winner_new_elo: winnerNewElo,
            loser_new_elo: loserNewElo,
            happy_hour: happyHour
        }
        // Assigning new elo values to player object, then PATCHING.
        winningPlayer.elo = winnerNewElo;
        losingPlayer.elo = loserNewElo;

        QuickHitAPI.addNewMatch(matchToAdd, winningPlayer, losingPlayer, onSuccess, onError);
    }

    const renderPlayerOption = (player: DbPlayer) => {
        return { key: player.id, text: <span><Icon name={player.icon} size={"small"}/>{player.name}</span>, value: JSON.stringify(player)}
    }

    return (
        <Modal
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
            open={open}
            trigger={props.customModalOpenElement ?? <Button inverted><Icon name={'trophy'}/>Enter game</Button>}
        >
            <Modal.Header>
                <Icon name='plus'/>
                New game
            </Modal.Header>
            <Modal.Content className={"new-game-form"}>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Select
                            fluid
                            label={<b>Winning player<Icon name={"trophy"}/></b>}
                            options={props.players.map((player) => renderPlayerOption(player))}
                            search={(options, value) => {return options.filter((option) => {
                                const player = JSON.parse(option.value as string);
                                return player.name.toLowerCase().includes(value.toLowerCase())
                            })}}
                            placeholder='Chicken Dinner'
                            required
                            onChange={(event, data) => setWinningPlayer(JSON.parse(data.value as string))}
                            value={winningPlayer ? renderPlayerOption(winningPlayer).value : ""}
                        />
                        <Form.Field>
                            <label>Winning player score</label>
                            <input type={"number"} min={0} required value={winningPlayerScore ?? ""}
                                   onChange={(event) => setWinningPlayerScore(event.target.value !== "" ? parseInt(event.target.value) : undefined)}
                            />
                        </Form.Field>
                        <Form.Select
                            fluid
                            label={<b>Losing player<Icon name={"close"}/></b>}
                            options={props.players.map((player) => renderPlayerOption(player))}
                            search={(options, value) => {return options.filter((option) => {
                                const player = JSON.parse(option.value as string);
                                return player.name.toLowerCase().includes(value.toLowerCase())
                            })}}
                            placeholder='Big Dog'
                            required
                            onChange={(event, data) => setLosingPlayer(JSON.parse(data.value as string))}
                            value={losingPlayer ? renderPlayerOption(losingPlayer).value : ""}
                        />
                        <Form.Field>
                            <label>Losing player score</label>
                            <input type={"number"} min={0} required value={losingPlayerScore ?? ""}
                                   onChange={(event) => setLosingPlayerScore(event.target.value !== "" ? parseInt(event.target.value) : undefined)}/>
                        </Form.Field>
                    </Form.Group>
                    <Button onClick={() => sendCreateRequest(false)}
                            disabled={!(winningPlayer && winningPlayerScore !== undefined &&
                                        losingPlayer && losingPlayerScore !== undefined)}
                    >
                        GG
                    </Button>
                    <Button onClick={() => sendCreateRequest(true)}
                            disabled={!(winningPlayer && winningPlayerScore !== undefined &&
                                        losingPlayer && losingPlayerScore !== undefined)}
                    >
                        Just one more game
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewGame;
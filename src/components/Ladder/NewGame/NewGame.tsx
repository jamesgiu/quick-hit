import {Form, Modal, Icon, Button} from "semantic-ui-react";
import React from "react";
import {v4 as uuidv4} from 'uuid';
import {DB_Match, DB_Player} from "../../../types/database/models";
import {QuickHitAPI} from "../../../api/QuickHitAPI";
import {makeErrorToast, makeSuccessToast} from "../../Toast/Toast";
import {QuickHitPage} from "../../../util/QuickHitPage";
import "./NewGame.css";
import EloRank from "elo-rank";

interface NewGameProps {
    players: DB_Player[],
    customModalOpenElement?: JSX.Element,
}

/**
 * QuickHit NewPlayer component.
 */
function NewGame(props: NewGameProps) {
    const [open, setModalOpen] = React.useState<boolean>(false)
    const [winningPlayer, setWinningPlayer] = React.useState<DB_Player>()
    const [losingPlayer, setLosingPlayer] = React.useState<DB_Player>()
    const [winningPlayerScore, setWinningPlayerScore] = React.useState<number>(0)
    const [losingPlayerScore, setLosingPlayerScore] = React.useState<number>(0)

    const sendCreateRequest =  ()  => {
        const onSuccess = () => {
            makeSuccessToast("Game added!", "Back to work?");
            setModalOpen(false);

            // FIXME Replace this with firing an event to the parent to force a new request without refreshing
            // the application.
            setTimeout( () => {
                window.location.href = QuickHitPage.LADDER;
            }, 1000);
        }

        const onError = (errorMsg: string) => {
            makeErrorToast("Game not added!", errorMsg);
        }

        if (winningPlayer?.id === losingPlayer?.id)
        {
            makeErrorToast("Get outta here", "Players cannot beat themselves on QuickHit");
            return;
        }

        if (winningPlayerScore < losingPlayerScore)
        {
            makeErrorToast("Come on man", "Winning player score must be higher than losing player score");
            return;
        }

        const elo = new EloRank(15);
        const winnerElo = winningPlayer!.elo;
        const loserElo = losingPlayer!.elo;

        //Gets expected score for first parameter
        const winningPlayerExpectedScore = elo.getExpected(winnerElo, loserElo);
        const losingPlayerExpectedScore = elo.getExpected(loserElo, winnerElo);

        //update score, 1 if won 0 if lost
        const winnerNewElo = elo.updateRating(winningPlayerExpectedScore, 1, winnerElo);
        const loserNewElo = elo.updateRating(losingPlayerExpectedScore, 0, loserElo);

        const matchToAdd : DB_Match = {
            id: uuidv4(),
            date: new Date().toISOString(),
            winning_player_id: winningPlayer!.id,
            winning_player_score: winningPlayerScore,
            winning_player_original_elo: winnerElo,
            losing_player_id: losingPlayer!.id,
            losing_player_score: losingPlayerScore,
            losing_player_original_elo: loserElo,
            winner_new_elo: winnerNewElo,
            loser_new_elo: loserNewElo
        }
        // Assigning new elo values to player object, then PATCHING.
        winningPlayer!.elo = winnerNewElo;
        losingPlayer!.elo = loserNewElo;

        QuickHitAPI.addNewMatch(matchToAdd, winningPlayer!, losingPlayer!, onSuccess, onError);
    }

    const renderPlayerOption = (player: DB_Player) => {
        return { key: player.id, text: <span><Icon name={player.icon} size={"small"}/>{player.name}</span>, value: player as any}
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
                <Form onSubmit={sendCreateRequest}>
                    <Form.Group widths='equal'>
                        <Form.Select
                            fluid
                            label={<b>Winning player<Icon name={"trophy"}/></b>}
                            options={props.players.map((player) => renderPlayerOption(player))}
                            placeholder='Chicken Dinner'
                            required
                            onChange={(event, data) => setWinningPlayer(data.value as any)}
                        />
                        <Form.Field>
                            <label>Winning player score</label>
                            <input type={"number"} min={0} required
                                   onChange={(event) => setWinningPlayerScore(parseInt(event.target.value))}
                            />
                        </Form.Field>
                        <Form.Select
                            fluid
                            label={<b>Losing player<Icon name={"close"}/></b>}
                            options={props.players.map((player) => renderPlayerOption(player))}
                            placeholder='Big Dog'
                            required
                            onChange={(event, data) => setLosingPlayer(data.value as any)}
                        />
                        <Form.Field>
                            <label>Losing player score</label>
                            <input type={"number"} min={0} required
                            onChange={(event) => setLosingPlayerScore(parseInt(event.target.value))}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Button>GG</Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

export default NewGame;
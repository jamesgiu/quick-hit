import { DropdownItemProps, Grid, Icon, Menu, Modal, Select } from "semantic-ui-react";
import { useEffect, useState } from "react";
import "./Comparator.css";
import { DbPlayer, getELOString } from "../../types/database/models";
import { ComparatorStoreProps } from "../../containers/Comparator/Comparator";
import { WinLoss } from "../../types/types";
import { getRecordAgainstPlayer, getWinLossForPlayer } from "../QHDataLoader/QHDataLoader";
import { getChanceOfVictory } from "../../util/Predictor";

/**
 * QuickHit Comparator component.
 */
function Comparator(props: ComparatorStoreProps): JSX.Element {
    const [open, setModalOpen] = useState<boolean>(false);
    const [playerOne, setPlayerOne] = useState<DbPlayer>();
    const [playerTwo, setPlayerTwo] = useState<DbPlayer>();
    const [headToHead, setHeadToHead] = useState<WinLoss>();
    const [vicChance, setVicChance] = useState<number>();

    /**
     * When the players change, update the H2H and chance of victory.
     */
    useEffect(() => {
        if (playerOne && playerTwo) {
            setHeadToHead(getRecordAgainstPlayer(playerOne?.id, playerTwo?.id, props.matches));
            setVicChance(getChanceOfVictory(playerOne, playerTwo, props.matches));
        }
    }, [playerOne, playerTwo]);

    /**
     * Get the dropdown option for the specified player.
     * @param player The player to generate the dropdown option for.
     * @returns The props for the dropdown item to be generated.
     */
    const renderPlayerOption = (player: DbPlayer): DropdownItemProps => {
        return {
            key: player.id,
            text: (
                <span>
                    <Icon name={player.icon} size={"small"} />
                    {player.name}
                </span>
            ),
            value: JSON.stringify(player),
        };
    };

    return (
        <Modal
            closeIcon
            onClose={(): void => setModalOpen(false)}
            onOpen={(): void => setModalOpen(true)}
            open={open}
            trigger={
                <Menu.Item as={"a"}>
                    <Icon name={"calculator"} />
                </Menu.Item>
            }
        >
            <Modal.Header>
                <Icon name={"calculator"} />
                Compare players
            </Modal.Header>
            <Modal.Content>
                <Grid columns={3} className={"comparison-grid"}>
                    <Grid.Row>
                        <Grid.Column>
                            <Select
                                className={"player-select"}
                                fluid
                                options={props.players.map((player) => renderPlayerOption(player))}
                                search={(options, value): DropdownItemProps[] => {
                                    return options.filter((option) => {
                                        const player = JSON.parse(option.value as string);
                                        return player.name.toLowerCase().includes(value.toLowerCase());
                                    });
                                }}
                                placeholder="Chicken Dinner"
                                required
                                onChange={(_, data): void => setPlayerOne(JSON.parse(data.value as string))}
                                value={playerOne ? renderPlayerOption(playerOne).value : ""}
                            />
                        </Grid.Column>
                        <Grid.Column className={"centre-column"}>VERSUS</Grid.Column>
                        <Grid.Column>
                            <Select
                                className={"player-select"}
                                fluid
                                options={props.players.map((player) => renderPlayerOption(player))}
                                search={(options, value): DropdownItemProps[] => {
                                    return options.filter((option) => {
                                        const player = JSON.parse(option.value as string);
                                        return player.name.toLowerCase().includes(value.toLowerCase());
                                    });
                                }}
                                placeholder="Big Dog"
                                required
                                onChange={(_, data): void => setPlayerTwo(JSON.parse(data.value as string))}
                                value={playerTwo ? renderPlayerOption(playerTwo).value : ""}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>{headToHead?.wins}</Grid.Column>
                        <Grid.Column className={"centre-column"}>H2H</Grid.Column>
                        <Grid.Column>{headToHead?.losses}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {playerOne &&
                                getELOString(getWinLossForPlayer(playerOne.id, props.matches).matches, playerOne.elo)}
                        </Grid.Column>
                        <Grid.Column className={"centre-column"}>ELO</Grid.Column>
                        <Grid.Column>
                            {playerTwo &&
                                getELOString(getWinLossForPlayer(playerTwo.id, props.matches).matches, playerTwo.elo)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={"prediction-row"}>
                        <Grid.Column>{vicChance ? vicChance + "%" : "N/A"}</Grid.Column>
                        <Grid.Column className={"centre-column"}>CHANCE OF VICTORY</Grid.Column>
                        <Grid.Column>{vicChance ? 100 - vicChance + "%" : "N/A"}</Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
        </Modal>
    );
}

export default Comparator;

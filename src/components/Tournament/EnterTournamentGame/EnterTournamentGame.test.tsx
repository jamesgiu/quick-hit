import { render } from "@testing-library/react";
import EnterTournamentGame from "./EnterTournamentGame";

it("renders without crashing", () => {
    render(
        <EnterTournamentGame
            onClose={jest.fn}
            isOpen={true}
            refresh={jest.fn}
            matchEntering={{
                match_number: 0,
                home_player_id: "abc",
                away_player_id: "def",
            }}
            currentTournament={{
                id: "tou",
                name: "test",
                start_date: "right now",
                matches: [],
            }}
            homePlayerEntering={"homer"}
            awayPlayerEntering={"awayer"}
        />
    );
});

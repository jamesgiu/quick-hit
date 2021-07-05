import { render } from "@testing-library/react";
import NewTournament from "./NewTournament";

it("renders without crashing", () => {
    render(
        <NewTournament
            onClose={jest.fn}
            isOpen={true}
            sortedPlayers={[]}
        />
    );
});

import { render } from "@testing-library/react";
import NewGame from "./NewGame";

it("renders without crashing", () => {
    render(
        <NewGame
            players={[]}
            happyHour={{
                date: "2020-02-02",
                hourStart: 14,
                multiplier: 3,
            }}
        />
    );
});

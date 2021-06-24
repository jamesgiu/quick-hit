import {render} from "@testing-library/react";
import PlayerCard from "./PlayerCard";
import {BrowserRouter} from "react-router-dom";

it("renders without crashing", ()=> {
    render(
        <BrowserRouter>
            <PlayerCard player={{id: "test", name: "test", elo: 1000, icon: "thumbs up"}}/>
        </BrowserRouter>
    )
});
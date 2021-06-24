import {render} from "@testing-library/react";
import NewGame from "./NewGame";

it("renders without crashing", ()=> {
    render(
        <NewGame players={[]}/>
    )
});
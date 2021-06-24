import {render} from "@testing-library/react";
import NewPlayer from "./NewPlayer";

it("renders without crashing", ()=> {
    render(
        <NewPlayer onNewPlayerAdded={jest.fn}/>
    )
});
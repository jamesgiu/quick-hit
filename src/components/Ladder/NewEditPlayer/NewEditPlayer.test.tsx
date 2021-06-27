import {render} from "@testing-library/react";
import NewPlayer from "./NewEditPlayer";

it("renders without crashing", ()=> {
    render(
        <NewPlayer onRequestMade={jest.fn}/>
    )
});
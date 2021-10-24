import {render} from "@testing-library/react";
import ELOGraph from "./ELOGraph";
import {DbPlayer} from "../../types/database/models";

it("renders without crashing", () => {
    render(<ELOGraph player={{} as DbPlayer} matches={[]} />);
});

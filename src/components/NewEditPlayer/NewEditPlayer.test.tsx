import { render } from "@testing-library/react";
import NewEditPlayer from "./NewEditPlayer";

it("renders without crashing", () => {
    render(<NewEditPlayer onRequestMade={jest.fn} />);
});

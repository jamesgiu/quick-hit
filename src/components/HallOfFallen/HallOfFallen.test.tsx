import { render } from "@testing-library/react";
import HallOfFallen from "./HallOfFallen";

it("renders without crashing", () => {
    render(<HallOfFallen players={[]} doublesPairs={[]} />);
});

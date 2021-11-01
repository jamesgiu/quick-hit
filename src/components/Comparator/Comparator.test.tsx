import { render } from "@testing-library/react";
import Comparator from "./Comparator";

it("renders without crashing", () => {
    render(
        <Comparator
            players={[]}
            matches={[]}
            setForceRefresh={jest.fn}
        />
    );
});

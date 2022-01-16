import { render } from "@testing-library/react";
import RecentGamesTicker from "./RecentGamesTicker";

it("renders without crashing", () => {
    render(<RecentGamesTicker feedItems={[]} />);
});

import { render } from "@testing-library/react";
import RecentGamesStatistics from "./RecentGamesStatistics";

it("renders without crashing", () => {
    render(<RecentGamesStatistics matches={[]} />);
});

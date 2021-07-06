import { render } from "@testing-library/react";
import Tournament from "./Tournament";

it("renders without crashing", () => {
    render(<Tournament matches={[]} players={[]} happyHour={{
        date: "rn",
        hourStart: 999,
        multiplier: 1000000000,
    }} badges={[]} tournaments={[]} refresh={false} loading={false} setForceRefresh={jest.fn}/>);
});

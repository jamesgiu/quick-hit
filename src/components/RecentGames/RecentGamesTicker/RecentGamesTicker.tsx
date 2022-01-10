import React from "react";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import "./RecentGamesTicker.css";
import NewsTicker, { Directions } from "react-advanced-news-ticker";

interface RecentGamesTickerProps {
    feedItems: FeedEventProps[];
}

function RecentGamesTicker(props: RecentGamesTickerProps): JSX.Element {
    const renderFeedItems = (): JSX.Element[] => {
        const feedItemElements: JSX.Element[] = [];

        props.feedItems.forEach((feedItem) => {
            feedItemElements.push(<div>{feedItem.meta}</div>);
        });

        return feedItemElements;
    };

    return (
        <div className={"recent-games-feed"}>
            <NewsTicker
                rowHeight={20}
                maxRows={3}
                direction={Directions.UP}
                duration={4000}
                autoStart={true}
                pauseOnHover={false}
            >
                {renderFeedItems()}
            </NewsTicker>
        </div>
    );
}

export default RecentGamesTicker;

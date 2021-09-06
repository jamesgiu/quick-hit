import React, { useEffect, useRef } from "react";
import "./Chat.css";
import { Button, Divider, Feed, Form, Header, Icon, Menu, Portal, Segment } from "semantic-ui-react";
import { makeErrorToast } from "../Toast/Toast";
import { DbChatRoom, DbChatRoomMessage, getTodaysDate } from "../../types/database/models";
import { QuickHitAPI } from "../../api/QuickHitAPI";
import { FeedEventProps } from "semantic-ui-react/dist/commonjs/views/Feed/FeedEvent";
import ReactTimeAgo from "react-time-ago";
import { v4 as uuidv4 } from "uuid";
import Settings from "../../containers/Settings";

export interface ChatProps {
    username: string;
}

const POLL_RATE_MS = 1000;

/**
 * Chat component in QuickHit.
 */
function Chat(props: ChatProps): JSX.Element {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [chatRoom, setChatRoom] = React.useState<DbChatRoom>();
    const [messageField, setMessageField] = React.useState<string>();
    const intervalRef = useRef<NodeJS.Timeout>();

    const getChatroomOrCreateOneIfNotPresent = (): void => {
        const onFailure = (error: string): void => {
            makeErrorToast("Could not get today's chatroom", error);
        };

        const onSuccess = (chatRoom?: DbChatRoom): void => {
            if (chatRoom?.date) {
                setChatRoom(chatRoom);
            } else {
                // No chatroom generated for today, generate one
                const newChatroom: DbChatRoom = {
                    date: getTodaysDate(),
                    // Initialise the chat room.
                    messages: {
                        "welcome-message": {
                            author: "QuickHit",
                            id: uuidv4(),
                            text: `Welcome to the daily chat for ${getTodaysDate()}`,
                            date: new Date().toISOString(),
                        }
                    },
                };

                QuickHitAPI.setChatRoom(
                    newChatroom,
                    () => {
                        setChatRoom(newChatroom);
                        return;
                    },
                    onFailure
                );
            }
        };
        QuickHitAPI.getTodaysChatRoom(onSuccess, onFailure);
    };

    const getMessages = (): FeedEventProps[] => {
        if (!chatRoom || !chatRoom.messages) {
            return [];
        }

        const events: FeedEventProps[] = [];

        const messages = Object.entries(chatRoom.messages);

        // Sort messages.
        messages.sort((msgA, msgB) => {
            return new Date(msgB[1].date).getTime() - new Date(msgA[1].date).getTime();
        });

        messages.forEach(([, message]) => {
            events.push({
                date: (
                    <div className={"event-date"}>
                        {message.author} <ReactTimeAgo date={new Date(message.date)} />
                        ...
                    </div>
                ),
                meta: <Divider />,
                content: message.text,
            });
        });

        return events;
    };

    // Runs on mount.
    useEffect(() => {
        getChatroomOrCreateOneIfNotPresent();
    }, []);

    const sendMessage = (): void => {
        const onFailure = (error: string): void => {
            makeErrorToast("Could not get today's chatroom", error);
        };

        if (chatRoom && messageField && messageField.trim() !== "") {
            const updatedChatRoom = chatRoom;
            const newMessage: DbChatRoomMessage = {
                id: uuidv4(),
                text: encodeURI(messageField.trim()),
                author: props.username,
                date: new Date().toISOString(),
            };

            updatedChatRoom.messages[newMessage.id] = newMessage;

            QuickHitAPI.setChatRoom(
                updatedChatRoom,
                () => {
                    setChatRoom(updatedChatRoom);
                    setMessageField("");
                },
                onFailure
            );
        }
    };

    // Popover in navbar, with notification bell if possible
    // Guest username at first (can set username in redux)
    return (
        //TODO hacktoberfest - add 'disabled' prop to Semantic UI portal.
        <div className="chat-outer">
            <Portal
                closeOnTriggerClick
                openOnTriggerClick
                closeOnDocumentClick={false}
                trigger={
                    chatRoom && (
                        <Menu.Item as={"a"}>
                            <span className={"chat-icon"}>
                                <Icon name={"chat"} inverted={isOpen} />
                            </span>
                        </Menu.Item>
                    )
                }
                onClose={(): void => {
                    setIsOpen(false);

                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }}
                onOpen={(): void => {
                    setIsOpen(true);

                    intervalRef.current = setInterval(() => {
                        getChatroomOrCreateOneIfNotPresent();
                    }, POLL_RATE_MS);
                }}
            >
                {chatRoom && (
                    <Segment className={"chat-portal-element"} inverted>
                        <Header>QuickHit Daily Chat</Header>
                        <p>Chat for {chatRoom.date}</p>
                        <p>
                            Username: {props.username} <Settings />{" "}
                        </p>
                        <Feed className={"chat-feed"} events={getMessages()} />
                        <Form className={"message-form"}>
                            <span
                                onKeyPress={(event): void => {
                                    // If they pressed enter
                                    if (event.key === "13") {
                                        sendMessage();
                                    }
                                }}
                            ></span>
                            <Form.Input
                                inverted
                                inline
                                placeholder={"Enter a message"}
                                value={messageField}
                                onChange={(event, data): void => setMessageField(data.value)}
                            />
                            <Button
                                onClick={sendMessage}
                                inverted
                                disabled={!messageField || messageField.trim() === ""}
                            >
                                <Icon name={"arrow right"} size={"large"} />
                            </Button>
                        </Form>
                    </Segment>
                )}
            </Portal>
        </div>
    );
}

export default Chat;

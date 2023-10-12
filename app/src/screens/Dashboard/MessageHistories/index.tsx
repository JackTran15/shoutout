import { Spinner } from "reactstrap";
import { SentMessage } from "../../../components/SentMessage";
import { useMessages } from "../../../hooks/useMessages";
import "./styles.css";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useCreateMessage } from "../../../hooks/useCreateMessage";
import { MessageDTO } from "../../../types";

interface Props {
  onMessageDeleted?: () => void;
  messagesCreated: boolean;
}
export const MessageHistories = (props: Props) => {
  const messages = useMessages();

  const historiesRef = useRef<any>(null);

  useEffect(() => {
    const messageHistories = historiesRef.current;
    const onScroll = async (event: any) => {
      const { scrollHeight, scrollTop, clientHeight } = event.target;

      if (!messages.isLoading && scrollHeight - scrollTop <= clientHeight) {
        if (messages.hasNextPage) {
          console.log("fetching");
          await messages.fetchNextPage();
        }
      }
    };

    messageHistories?.addEventListener("scroll", onScroll);
    return () => {
      messageHistories?.removeEventListener("scroll", onScroll);
    };
  }, [messages.data]);

  useEffect(() => {
    if (!props.messagesCreated || !historiesRef.current) return;
    historiesRef.current.scrollTop = 0;
  }, [props.messagesCreated]);

  const displayMessages =
    messages.data?.pages
      ?.map((e) => e.data)
      .reduce((arr, data) => [...arr, ...data], []) || [];

  return (
    <div className="messages d-flex align-items-center justify-content-center">
      {!messages.error && !messages.isLoading && messages.data && (
        <div
          id="message-histories"
          className="message-histories"
          ref={historiesRef}
        >
          {displayMessages?.map((e: MessageDTO) => (
            <SentMessage
              data={e}
              key={e._id}
              onDelete={props.onMessageDeleted}
            />
          ))}
        </div>
      )}

      {messages.error ? (
        <h2 className="messages-load-error">{"Cannot load messages"}</h2>
      ) : (
        <></>
      )}

      {messages.isLoading && (
        <Spinner
          color="light"
          style={{ width: 40, height: 40, opacity: 0.3 }}
        />
      )}
    </div>
  );
};

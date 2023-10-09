import { Spinner } from "reactstrap";
import { SentMessage } from "../../../components/SentMessage";
import { useMessages } from "../../../hooks/useMessages";
import "./styles.css";

interface Props {
  onMessageDeleted?: () => void;
}
export const MessageHistories = (props: Props) => {
  const messages = useMessages();

  return (
    <div className="messages d-flex align-items-center justify-content-center">
      {messages.isLoading && (
        <Spinner
          color="light"
          style={{ width: 40, height: 40, opacity: 0.3 }}
        />
      )}

      {messages.data && (
        <div className="message-histories">
          {messages.data?.map((e: any) => (
            <SentMessage
              data={e}
              key={e._id}
              onDelete={props.onMessageDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

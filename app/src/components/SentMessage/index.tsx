import { useDeleteMessage } from "../../hooks/useDeleteMessage";
import { useMessages } from "../../hooks/useMessages";
import { MessageDTO } from "../../types";
import { LoadingButton } from "../LoadingButton";
import "./styles.css";
type Props = { data: MessageDTO };

export const SentMessage = ({ data }: Props) => {
  const { _id, content } = data;
  const { deleteMessage, isLoading: deleting } = useDeleteMessage();
  const { refetch } = useMessages();

  return (
    <div className="sent-message d-flex justify-content-end p-2 w-100 align-items-center gap-2">
      <LoadingButton
        className="btn btn-danger delete-message-btn"
        onClick={() => {
          deleteMessage(_id, {
            onSuccess: () => {
              refetch();
            },
          });
        }}
        loading={deleting}
        loaderColor={"light"}
      >
        x
      </LoadingButton>
      <div className="btn btn-primary d-block sent-message-content">
        {content}
      </div>
    </div>
  );
};

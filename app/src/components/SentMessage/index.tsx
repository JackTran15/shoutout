import { Spinner } from "reactstrap";
import { useDeleteMessage } from "../../hooks/useDeleteMessage";
import { useMessages } from "../../hooks/useMessages";
import { MessageDTO } from "../../types";
import { LoadingButton } from "../LoadingButton";
import "./styles.css";
import { toast } from "react-toastify";
type Props = { data: MessageDTO; onDelete?: () => void };

export const SentMessage = ({ data, onDelete }: Props) => {
  const { _id, content } = data;
  const { deleteMessage, isLoading: deleting } = useDeleteMessage();
  const { refetch } = useMessages();

  return (
    <div className="sent-message d-flex justify-content-end p-2 w-100 align-items-center gap-2">
      {deleting ? (
        <Spinner className="sent-message-loading" color="secondary" size={"sm"} style={{ opacity: 0.5 }} />
      ) : (
        <div
          className="delete-message-btn"
          onClick={() => {
            deleteMessage(_id, {
              onSuccess: () => {
                onDelete?.();
                // refetch();
              },
              onError() {
                toast.error("Message delete unsuccessfully", {
                  position: "top-left",
                  autoClose: 1000,
                  hideProgressBar: true,
                  draggable: false,
                });
              },
            });
          }}
        >
          <img src="/cancel.png" alt="delete-icon" width={10} />
        </div>
      )}
      <div className="d-block sent-message-content">{content}</div>
    </div>
  );
};

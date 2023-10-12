import { Container } from "reactstrap";
import { useMessages } from "../../hooks/useMessages";
import "./styles.css";
import {
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MessageSchema, messageSchema } from "../../schemas/message";
import { toast } from "react-toastify";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useNavigate } from "react-router-dom";
import { clearAuthentication, queryClient } from "../../helpers";
import { MessageHistories } from "./MessageHistories";
import { SendMessageForm } from "./SendMessageForm";

const MAX_CHARS = 280;

export function Dashboard() {
  const navigate = useNavigate();
  const messages = useMessages();
  const { handleSubmit, control, watch, setValue, setFocus } = useForm({
    resolver: yupResolver<MessageSchema>(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = watch("content");

  const { createMessage, isLoading: sending } = useCreateMessage();

  const submit = (input: MessageSchema) =>
    createMessage(input, {
      onSuccess: (data) => {
        setValue("content", "" as never);
        setFocus("content");
        messages.refetch();
      },
      onError() {
        toast.error("Message sent unsuccessfully", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: true,
          draggable: false,
        });
      },
    });

  const logout = () => {
    queryClient.clear();
    clearAuthentication();
    navigate("/login");
  };

  return (
    <>
      <title>Dashboard</title>
      <Container className="main-bg dashboard p-lg-5 p-3">
        <div className="logout-btn" onClick={() => logout()}>
          Logout
        </div>
        <SendMessageForm
          onSubmit={handleSubmit(submit)}
          control={control}
          maxChars={MAX_CHARS}
          sending={sending}
          content={content}
        />
        <MessageHistories
          messagesCreated={sending}
          onMessageDeleted={() => {
            setFocus("content");
          }}
        />
      </Container>
    </>
  );
}

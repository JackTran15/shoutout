import { Button, Container, Form, FormGroup, Spinner } from "reactstrap";
import { useMessages } from "../../hooks/useMessages";
import "./styles.css";
import {
  ErrorOption,
  Field,
  FieldArray,
  FieldArrayPath,
  FieldError,
  FieldErrors,
  FieldValues,
  FormState,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegisterReturn,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MessageSchema, messageSchema } from "../../schemas/message";
import { ControlTextInput } from "../../components/ControlTextInput";
import { toast } from "react-toastify";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useNavigate } from "react-router-dom";
import { clearAuthentication } from "../../helpers";
import { MessageHistories } from "./MessageHistories";
import { SendMessageForm } from "./SendMessageForm";
import { BaseSyntheticEvent } from "react";

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

  const submit = (data: MessageSchema) =>
    createMessage(data, {
      onSuccess: () => {
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

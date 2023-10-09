import { Button, Container, Form, FormGroup, Spinner } from "reactstrap";
import { useMessages } from "../../hooks/useMessages";
import "./styles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MessageSchema, messageSchema } from "../../schemas/message";
import { ControlTextInput } from "../../components/ControlTextInput";
import { LoadingButton } from "../../components/LoadingButton";
import { usePostMessage } from "../../hooks/usePostMessage";
import { SentMessage } from "../../components/SentMessage";
import { useNavigate } from "react-router-dom";
import { clearAuthentication } from "../../helpers";

const MAX_CHARS = 280;

export function Dashboard() {
  const navigate = useNavigate();
  const messages = useMessages();
  const { handleSubmit, control, watch, setValue } = useForm({
    resolver: yupResolver<MessageSchema>(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = watch("content");

  const { postMessage, isLoading: posting } = usePostMessage();

  const submit = (data: MessageSchema) =>
    postMessage(data, {
      onSuccess: () => {
        setValue("content", "");
        messages.refetch();
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
        <Button className="logout-btn" color="dark" onClick={() => logout()}>
          Logout
        </Button>
        <div className="messages d-flex align-items-center justify-content-center">
          {messages.isLoading && (
            <Spinner color="light" style={{ width: 45, height: 45 }} />
          )}

          {messages.data && (
            <div className="messages-histories">
              {messages.data?.map((e: any) => (
                <SentMessage data={e} key={e._id} />
              ))}
            </div>
          )}
        </div>
        <Form
          className="messages-form-container p-md-2 p-sm-1"
          onSubmit={handleSubmit(submit)}
        >
          <div className="messages-counter">
            <small>
              {content.length}/{MAX_CHARS}
            </small>
          </div>
          <ControlTextInput
            control={control}
            type="text"
            placeholder="Type messages here..."
            className="message-input"
            maxLength={MAX_CHARS}
            name={"content"}
            autoComplete="off"
            showError={false}
          />

          <button
            className={`
              send-message-btn 
              ${posting ? "send-message-btn-disabled" : ""}
            `}
            type="submit"
            style={{ outline: "none", border: "none", background: "none" }}
            disabled={!content.length || posting}
          >
            <img
              src="/send.png"
              alt=""
              className="d-block"
              width={30}
              height={30}
            />
          </button>
        </Form>
      </Container>
    </>
  );
}

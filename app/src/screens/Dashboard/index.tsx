import { Button, Container, Form, FormGroup, Spinner } from "reactstrap";
import { useMessages } from "../../hooks/useMessages";
import "./styles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MessageSchema, messageSchema } from "../../schemas/message";
import { ControlTextInput } from "../../components/ControlTextInput";
import { LoadingButton } from "../../components/LoadingButton";

const MAX_CHARS = 280;

export function Dashboard() {
  const messages = useMessages();
  const { handleSubmit, control, watch } = useForm({
    resolver: yupResolver<MessageSchema>(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = watch("content");

  const submit = (data: MessageSchema) => {
    console.log({ data });
  };

  return messages.isLoading ? (
    <Spinner color="light" style={{ width: 45, height: 45 }} />
  ) : (
    <>
      <title>Dashboard</title>
      <Container className="main-bg dashboard p-lg-5 p-3">
        <div className="messages"></div>
        <Form
          className="messages-form-container"
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
          />
          <LoadingButton
            loading={false}
            color="primary"
            loaderColor={"light"}
            disabled={!content.length}
          >
            Post
          </LoadingButton>
        </Form>
      </Container>
    </>
  );
}

import { Control, Form } from "react-hook-form";
import { ControlTextInput } from "../../../components/ControlTextInput";
import { MessageSchema } from "../../../schemas/message";
import "./styles.css";

interface Props {
  onSubmit: () => {};
  control: Control<MessageSchema>;
  maxChars: number;
  sending: boolean;
  content: string;
}

export const SendMessageForm = (props: Props) => {
  const { control, maxChars, onSubmit, sending, content } = props;

  return (
    <Form
      className="messages-form-container p-md-2 p-sm-1"
      onSubmit={onSubmit}
      control={control}
    >
      <div className="messages-counter">
        <small>
          {content.length}/{maxChars}
        </small>
      </div>
      <ControlTextInput
        control={control}
        type="text"
        placeholder="Type messages here..."
        className="message-input"
        maxLength={maxChars}
        name={"content"}
        autoComplete="off"
        showError={false}
        autoFocus={true}
      />

      <button
        id="send-messsage-btn"
        className={`
        send-message-btn 
        ${sending ? "send-message-btn-disabled" : ""}
      `}
        type="submit"
        disabled={!content.length || sending}
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
  );
};

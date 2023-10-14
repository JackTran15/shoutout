import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { SendMessageForm } from "../Dashboard/SendMessageForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { MessageSchema, messageSchema } from "../../schemas";

const queryClient = new QueryClient();

describe("Send message form", () => {
  it("Should be rendered correctly with controlled values", () => {
    const onSubmit = vi.fn();

    let methods: any;
    const defaultValues: MessageSchema = {
      content: "Hello World",
    };

    const { container } = render(<div></div>, {
      wrapper: (props) => {
        methods = useForm({
          resolver: yupResolver(messageSchema),
          defaultValues,
        });

        const content = methods.watch("content");

        return (
          <BrowserRouter>
            <FormProvider {...props} {...methods}>
              <SendMessageForm
                maxChars={280}
                onSubmit={methods.handleSubmit(onSubmit)}
                sending={true}
                control={methods.control}
                content={content}
              />
              {props.children}
            </FormProvider>
          </BrowserRouter>
        );
      },
    });

    expect(
      screen.getByText(`${defaultValues.content.length}/280`)
    ).toBeInTheDocument();

    const contentInput = container.querySelector('input[name="content"');
    expect(contentInput).toBeInTheDocument();
    expect(contentInput?.getAttribute("value")).toEqual(defaultValues.content);

    const submitButton = container.querySelector(
      'button[type="submit"]#send-messsage-btn'
    );
    expect(submitButton).toBeInTheDocument();
    expect(
      submitButton?.classList.contains("send-message-btn-disabled")
    ).toEqual(true);

    expect((submitButton as HTMLButtonElement).disabled).toEqual(true);
  });

  it("Should call onSubmit function when submit button is clicked and content is not empty", async () => {
    const onSubmit = vi.fn();

    let methods: any;
    const defaultValues: MessageSchema = {
      content: "Hello World",
    };

    const { container } = render(<div></div>, {
      wrapper: (props) => {
        methods = useForm({
          resolver: yupResolver(messageSchema),
          defaultValues,
        });

        const content = methods.watch("content");

        return (
          <BrowserRouter>
            <FormProvider {...props} {...methods}>
              <SendMessageForm
                maxChars={280}
                onSubmit={methods.handleSubmit(onSubmit)}
                sending={false}
                control={methods.control}
                content={content}
              />
              {props.children}
            </FormProvider>
          </BrowserRouter>
        );
      },
    });

    const submitButton = container.querySelector(
      'button[type="submit"]#send-messsage-btn'
    );

    expect(submitButton).toBeInTheDocument();

    if (!submitButton) return;
    fireEvent.click(submitButton);

    await act(() => {});

    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(defaultValues, expect.any(Object));
  });

  it("Should be controlled well by react hook form events", async () => {
    const onSubmit = vi.fn();

    let methods: any;
    const defaultValues: MessageSchema = {
      content: "Hello World",
    };

    const { container } = render(<div></div>, {
      wrapper: (props) => {
        methods = useForm({
          resolver: yupResolver(messageSchema),
          defaultValues,
        });

        const content = methods.watch("content");

        return (
          <BrowserRouter>
            <FormProvider {...props} {...methods}>
              <SendMessageForm
                maxChars={280}
                onSubmit={methods.handleSubmit(onSubmit)}
                sending={false}
                control={methods.control}
                content={content}
              />
              {props.children}
            </FormProvider>
          </BrowserRouter>
        );
      },
    });

    const contentInput = container.querySelector('input[name="content"]');
    const submitButton = container.querySelector(
      'button[type="submit"]#send-messsage-btn'
    );

    expect(contentInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    if (!submitButton || !contentInput) return;

    const newContent = "new content";
    methods.setValue("content", newContent);
    fireEvent.click(submitButton);

    await act(() => {});

    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      { content: newContent },
      expect.any(Object)
    );
  });
});

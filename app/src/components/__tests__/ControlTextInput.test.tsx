import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { ControlTextInput } from "../ControlTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../schemas";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";

describe("ControlTextInput", () => {
  it("renders the input field", async () => {
    let methods: any;
    const defaultValues = {
      email: "email@gmai.com",
      password: "pass",
    };
    const { container } = render(<div></div>, {
      wrapper: (props) => {
        methods = useForm({
          resolver: yupResolver(loginSchema),
          defaultValues,
        });
        return (
          <BrowserRouter>
            <FormProvider {...props} {...methods}>
              <ControlTextInput name="email" control={methods.control} />
              {props.children}
            </FormProvider>
          </BrowserRouter>
        );
      },
    });

    const emailInput = container.querySelector('input[name="email"]');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput?.getAttribute("value")).toEqual(defaultValues.email);
    expect(emailInput?.getAttribute("value")).not.toEqual(
      defaultValues.password
    );

    const newEmail = "new-email@email.com";
    await act(async () => methods.setValue("email", newEmail));
    expect(emailInput?.getAttribute("value")).toEqual(newEmail);
  });
});

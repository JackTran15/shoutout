import {
  Container,
  Form,
  FormGroup,
  Label,
  UncontrolledAlert,
} from "reactstrap";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterSchema, registerSchema } from "../../schemas/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLogin, useRegister } from "../../hooks";
import { ControlTextInput } from "../../components/ControlTextInput";
import { LoadingButton } from "../../components/LoadingButton";

export function RegisterScreen() {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { register, isLoading, error } = useRegister();
  const { login, isLoading: isLogingin } = useLogin();
  const navigate = useNavigate();

  const submit = (data: RegisterSchema) =>
    register(data, {
      onSuccess(_, variables) {
        console.log("day", variables);
        login(
          {
            email: variables.email,
            password: variables.password,
          },
          {
            onSuccess: () => {
              navigate("/");
            },
          }
        );
      },
    });

  return (
    <Container
      fluid
      className="bg-gray d-flex justify-content-center align-items-center"
    >
      <Form
        className="loginForm d-block p-md-5 p-3 main-bg"
        onSubmit={handleSubmit(submit)}
      >
        <h3 className="text-center">REGISTER NEW ACCOUNT</h3>
        <br />
        {error?.message && (
          <UncontrolledAlert color="danger mt-2 mb-2">
            {error?.message}
          </UncontrolledAlert>
        )}
        <FormGroup controlId="formBasicEmail">
          <Label>Email address</Label>
          <ControlTextInput
            control={control}
            className="form-control"
            type="email"
            placeholder="Enter email"
            name="email"
          />
        </FormGroup>

        <FormGroup controlId="formBasicPassword">
          <Label>Password</Label>
          <ControlTextInput
            control={control}
            type="password"
            placeholder="Password"
            className="form-control"
            name="password"
          />
        </FormGroup>

        <FormGroup controlId="formBasicPassword">
          <Label>Confirm Password</Label>
          <ControlTextInput
            control={control}
            type="password"
            placeholder="Confirm password"
            className="form-control"
            name="confirmPassword"
          />
        </FormGroup>

        <FormGroup className="justify-content-center row ">
          <LoadingButton
            loading={isLoading || isLogingin}
            loaderColor="light"
            className="algin-right col-6 mt-3"
            color="primary"
            type="submit"
            disabled={isLoading || isLogingin}
          >
            Register
          </LoadingButton>

          <p className="col-12 text-center mt-2">
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </FormGroup>
      </Form>
    </Container>
  );
}

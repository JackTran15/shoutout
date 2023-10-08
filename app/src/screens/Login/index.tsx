import {
  Container,
  Form,
  FormGroup,
  Label,
  UncontrolledAlert,
} from "reactstrap";
import "./styles.css";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, loginSchema } from "../../schemas/auth";
import { ControlTextInput } from "../../components/ControlTextInput";
import { useLogin } from "../../hooks";
import { LoadingButton } from "../../components/LoadingButton";
export function LoginScreen() {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoading, data: loginData, error } = useLogin();

  const submit = (data: LoginSchema) => login(data);

  if (loginData) return <Navigate to="/" />;

  return (
    <>
      <title>Login</title>
      <Container
        fluid
        className="bg-gray d-flex justify-content-center align-items-center"
      >
        <Form
          className="loginForm d-block p-lg-5 p-3 main-bg"
          onSubmit={handleSubmit(submit)}
        >
          <h3 className="text-center">LOGIN TO AN ACCOUNT</h3>
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

          <FormGroup className="justify-content-center row ">
            <LoadingButton
              loading={isLoading}
              loaderColor="light"
              className="algin-right col-6 mt-3"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              Login
            </LoadingButton>

            <p className="col-12 text-center mt-2">
              Do not have any accounts? <Link to={"/register"}>Register</Link>
            </p>
          </FormGroup>
        </Form>
      </Container>
    </>
  );
}

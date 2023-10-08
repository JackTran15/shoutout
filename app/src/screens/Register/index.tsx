import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  UncontrolledAlert,
} from "reactstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegisterSchema, registerSchema } from "../../schemas/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegister } from "../../hooks";
import { useEffect } from "react";
import { ControlTextInput } from "../../components/ControlTextInput";
import { LoadingButton } from "../../components/LoadingButton";

export function RegisterScreen() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const { register, isLoading, data: registerData, error } = useRegister();

  const submit = (data: RegisterSchema) => register(data);

  useEffect(() => {
    if (registerData) console.log({ registerData });
  }, [registerData]);

  return (
    <Container
      fluid
      className="bg-gray d-flex justify-content-center align-items-center mt-5"
    >
      <Form className="loginForm p-5 d-block" onSubmit={handleSubmit(submit)}>
        <h3 className="text-center">REGISTER NEW ACCOUNT</h3>
        {error?.message && (
          <UncontrolledAlert color="danger mt-2 mb-2">
            {error?.message}
          </UncontrolledAlert>
        )}
        <FormGroup controlId="formBasicEmail">
          <Label>Email address</Label>
          <ControlTextInput
            control={control}
            errors={errors}
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
            errors={errors}
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
            errors={errors}
            type="password"
            placeholder="Confirm password"
            className="form-control"
            name="confirmPassword"
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

import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must not exceed 50 characters"),
});

export type LoginSchema = yup.InferType<typeof loginSchema>;

export const registerSchema = loginSchema.concat(
  yup.object({
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Passwords must match") // Ensure it matches the 'password' field
      .required("Confirm Password is required"),
  })
);

export type RegisterSchema = yup.InferType<typeof registerSchema>;

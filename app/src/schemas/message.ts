import * as yup from "yup";

export const messageSchema = yup.object().shape({
  content: yup.string().max(280).required(),
});

export type MessageSchema = yup.InferType<typeof messageSchema>;

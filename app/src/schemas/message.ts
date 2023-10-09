import * as yup from "yup";

export const messageSchema = yup.object().shape({
  content: yup.string().max(280).required(),
  createdAt: yup.string(),
  updatedAt: yup.string(),
  _id: yup.string(),
});

export type MessageSchema = yup.InferType<typeof messageSchema>;

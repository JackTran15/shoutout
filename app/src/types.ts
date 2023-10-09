import { AxiosError } from "axios";

export type ApiErrorResponse = AxiosError<{
  message: string;
  statusCode: number;
}>;

export type Auth = {
  email: string;
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type MessageDTO = {
  _id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: string;
  content: string;
};

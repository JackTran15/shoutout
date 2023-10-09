import { AxiosError } from "axios";

export type ApiErrorResponse = AxiosError<{
  message: string;
  statusCode: number;
}>;

export type Auth = {
  email: string;
  _id: string;
  createdAt: string;
  udpatedAt: string;
};

export type MessageDTO = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  content: string;
};

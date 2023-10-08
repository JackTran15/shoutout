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

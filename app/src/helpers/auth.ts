import {
  LocalStorageKeys,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "./common";
import { Auth } from "../types";

let accessToken = "";

export const setAccessToken = (token: string) => (accessToken = token);
export const getAccessToken = () => accessToken;

export const saveAuthentication = (params: {
  account: Auth;
  accessToken: string;
}) => {
  accessToken = params.accessToken;
  saveToLocalStorage(LocalStorageKeys.user, params.account);
};

export const clearAuthentication = () => {
  accessToken = "";
  removeFromLocalStorage(LocalStorageKeys.user);
};

export const getAuth = () => {
  const stringData = localStorage[LocalStorageKeys.user];
  try {
    return stringData ? (JSON.parse(stringData) as Auth) : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

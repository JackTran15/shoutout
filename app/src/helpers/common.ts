import { QueryClient } from "react-query";

export enum LocalStorageKeys {
  refreshToken = "app_rt",
  user = "user",
}

export const queryClient = new QueryClient();

export const saveToLocalStorage = (key: LocalStorageKeys, data: any) => {
  localStorage.setItem(
    key,
    typeof data == "string" ? data : JSON.stringify(data)
  );
};

export const removeFromLocalStorage = (key: LocalStorageKeys) => {
  localStorage.removeItem(key);
};

export const sleep = (ms: number) => setTimeout(() => Promise.resolve(), ms);

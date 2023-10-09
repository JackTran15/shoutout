import axios from "axios";
import {
  clearAuthentication,
  getAccessToken,
  setAccessToken,
} from "../helpers";

import { toast } from "react-toastify";

export const authenticatedApiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let unathenticatedRetry = 0;

// Function to refresh the access token (implement this according to your authentication flow)
async function refreshAccessToken() {
  const response = await authenticatedApiClient
    .patch("/auth/refresh")
    .then((res) => res.data);

  setAccessToken(response.accessToken);
  return response.accessToken;
}

authenticatedApiClient.interceptors.request.use((request) => {
  request.headers.Authorization = getAccessToken();
  return request;
});

// Add a response interceptor to handle token expiration and refresh
authenticatedApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !unathenticatedRetry) {
      unathenticatedRetry = 1;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = newToken;
        unathenticatedRetry = 0;
        // Retry the original request
        return authenticatedApiClient(originalRequest);
      } catch (error) {
        clearAuthentication();
        toast.error("Session expried", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: true,
          draggable: false,
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default authenticatedApiClient;

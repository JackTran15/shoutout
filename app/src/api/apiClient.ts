import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    // If the request was successful, return the response
    return response;
  },
  (error) => {
    if (error.code === "ECONNREFUSED") {
      // Handle connection refused error here
      console.error("Connection Refused:", error.message);
      toast.error("Network error", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: true,
        draggable: false,
      });
    }
    return Promise.reject(error); // Propagate the error further
  }
);

import { getAuth } from "../helpers/auth";
import { Navigate } from "react-router-dom";

export const Unauthenticated = (props: any) => {
  const user = getAuth();
  if (user) return <Navigate to={"/"} />;
  return props.children;
};

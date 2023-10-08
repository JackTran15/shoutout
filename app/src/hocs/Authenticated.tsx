import { Navigate } from "react-router-dom";
import { getAuth } from "../helpers";

export const Authenticated = (props: any) => {
  const user = getAuth();
  if (!user) return <Navigate to={"/login"} />;
  return props.children;
};

import { createBrowserRouter } from "react-router-dom";
import { Dashboard, LoginScreen, RegisterScreen } from "../screens";
import { Authenticated } from "../hocs/Authenticated";
import { Unauthenticated } from "../hocs/Unauthenticated";

export const UnauthenticatedRoutes = [
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
].map((e) => {
  return {
    ...e,
    element: <Unauthenticated>{e.element}</Unauthenticated>,
  };
});

export const authenticatedRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
].map((e) => {
  return {
    ...e,
    element: <Authenticated>{e.element}</Authenticated>,
  };
});

export const router = createBrowserRouter([
  ...UnauthenticatedRoutes,
  ...authenticatedRoutes,
]);

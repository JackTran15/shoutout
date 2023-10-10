import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import {
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import * as authHelper from "../../helpers/auth";
import { Authenticated } from "../Authenticated";


describe("Authenticated component", () => {
  it("renders children when authenticated",async () => {
    // Mock getAuth to return a user
    vi.spyOn(authHelper, "getAuth").mockImplementation(() => {
      return {
        _id: "",
        createdAt: new Date(),
        email: "jack@gmail.com",
        updatedAt: new Date(),
        username: "jack",
      };
  })
    const routers = createBrowserRouter([
      {
        path: "/",
        element: <Authenticated>
          <div className="dashboad">DashBoad</div>
        </Authenticated>,
      },
      {
        path: "/login",
        element: <div className="login">Login</div>,
      },
    ]);
    const { container } = render(<></>, {
      wrapper: ({}) => <RouterProvider router={routers} />,
    });

    await act(async () => {});

    const dashboardElement = container.querySelector("div.dashboad");
    expect(dashboardElement).toBeInTheDocument();
    expect(dashboardElement?.innerHTML).toBe("DashBoad");

    const loginElement=container.querySelector("div.login");
    expect(loginElement).not.toBeInTheDocument();

  });

  it("redirects to login when not authenticated", async () => {
    // Mock getAuth to return null (not authenticated)
    vi.spyOn(authHelper, "getAuth").mockImplementation(() => {
      return undefined
  })

    const routers = createBrowserRouter([
      {
        path: "/",
        element: <Authenticated>DashBoad</Authenticated>,
      },
      {
        path: "/login",
        element: <div id="login">Login</div>,
      },
    ]);
    const { container } = render(<></>, {
      wrapper: ({}) => <RouterProvider router={routers} />,
    });

    await act(async () => {});

    const loginPage = container.querySelector("div#login");
    expect(loginPage?.innerHTML).toBe("Login");
  });
});

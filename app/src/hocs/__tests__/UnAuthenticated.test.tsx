import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import * as authHelper from "../../helpers/auth";
import { Unauthenticated } from "../Unauthenticated";

describe("Unauthenticated component", () => {
  it("renders children when Unauthenticated", async () => {
    // Mock getAuth to return a user
    vi.spyOn(authHelper, "getAuth").mockImplementation(() => {
      return undefined;
    });
    const routers = createBrowserRouter([
      {
        path: "/",
        element: (
          <Unauthenticated>
            <div className="unauthenticated">Unauthenticated content</div>
          </Unauthenticated>
        ),
      }
    ]);
    const { container } = render(<></>, {
      wrapper: ({}) => <RouterProvider router={routers} />,
    });

    await act(async () => {});

    const dashboardElement = container.querySelector("div.unauthenticated");
    expect(dashboardElement).toBeInTheDocument();
    expect(dashboardElement?.innerHTML).toBe("Unauthenticated content");
  })
});

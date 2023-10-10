import { render, screen } from "@testing-library/react";
import { LoadingButton } from "../LoadingButton";

describe("LoadingButton", () => {
  it("should render the button correctly", () => {
    render(<LoadingButton loading loaderColor="danger"/>);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should disable the button when loading", () => {
    const {container}=render(<LoadingButton loading loaderColor="danger"/>);
    const button = container.querySelector('button.loading-btn')
    expect(button).toBeDisabled();
  });

  it("should render the children when not loading", () => {
    const children = <div>Hello world!</div>;
    render(<LoadingButton loaderColor="danger" loading={false}>{children}</LoadingButton>);

    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });
});
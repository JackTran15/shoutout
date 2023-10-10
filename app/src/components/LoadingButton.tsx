import { Button, ButtonProps, Spinner } from "reactstrap";

type Props = ButtonProps & {
  loading: boolean;
  loaderColor:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
};

export const LoadingButton = (props: Props) => {
  const { loading, loaderColor, ...restProps } = props;
  return (
    <Button className="loading-btn" {...restProps} disabled={loading}>
      {loading ? (
        <Spinner data-testid="loading-spinner" color={loaderColor} size={"sm"} />
      ) : (
        props.children
      )}
    </Button>
  );
};

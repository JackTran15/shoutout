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
    <Button {...restProps} disabled={loading}>
      {loading ? <Spinner color={loaderColor} /> : props.children}
    </Button>
  );
};

import { Controller } from "react-hook-form";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  control: any;
  name: string;
  showError?: boolean;
};
export const ControlTextInput = (props: Props) => {
  const { control, name, showError = true, ...restProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, formState }) => {
        return (
          <div ref={ref} {...field}>
            <input type="text" value={field.value} {...restProps} name={name} />
            {showError && formState.errors?.[name] && (
              <small className="text-danger mt-1">
                {formState.errors[name]?.message?.toString()}
              </small>
            )}
          </div>
        );
      }}
    />
  );
};

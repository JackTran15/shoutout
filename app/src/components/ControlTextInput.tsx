import { Controller } from "react-hook-form";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  control: any;
  name: string;
  errors: any;
};
export const ControlTextInput = (props: Props) => {
  const { control, name, ...restProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, formState }) => {
        return (
          <div ref={ref} {...field}>
            <input type="text" {...restProps} name={name} />
            {formState.errors?.[name] && (
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

import { TextField, TextFieldProps } from "@mui/material";
import { RegisterOptions, useFormContext } from "react-hook-form";

export type TSTextFieldProps = TextFieldProps & {
  options?: RegisterOptions;
  name: string;
};

export const TSTextField = ({ options, name, ...rest }: TSTextFieldProps) => {
  const methods = useFormContext();
  const { errors } = methods.formState;
  const error = errors[name]?.message as string;
  console.log(error);

  return (
    <TextField
      {...methods.register(name, options)}
      error={!!errors[name]}
      helperText={error}
      {...rest}
    />
  );
};

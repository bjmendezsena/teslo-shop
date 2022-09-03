import { TextField, TextFieldProps } from "@mui/material";
import { RegisterOptions, useFormContext } from "react-hook-form";

export type TSTextFieldProps = TextFieldProps & {
  options?: RegisterOptions;
  name: string;
};

export const TSTextField = ({ options, name, ...rest }: TSTextFieldProps) => {
  const methods = useFormContext();
  const fieldState = methods.getFieldState(name);
  const error = fieldState.error?.message;
  console.log(error);
  
  return (
    <TextField
      {...methods.register(name, options)}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      {...rest}
    />
  );
};

import {
  TextField,
  TextFieldProps,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import { RegisterOptions, useFormContext } from "react-hook-form";

type SelectOption = {
  value: string;
  label: string;
};

export type TSTextFieldProps = TextFieldProps & {
  options?: RegisterOptions;
  name: string;
  as?: "input" | "select";
  label?: string;
  selectOptions?: SelectOption[];
};

export const TSTextField = ({
  options,
  name,
  as = "input",
  selectOptions,
  ...rest
}: TSTextFieldProps) => {
  const methods = useFormContext();
  const { errors } = methods.formState;
  const error = errors[name]?.message as string;

  if (as === "select") {
    return (
      <FormControl fullWidth>
        <TextField
          select
          variant='filled'
          {...methods.register(name, options)}
          error={!!error}
          {...rest}
        >
          {selectOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
  return (
    <TextField
      {...methods.register(name, options)}
      error={!!errors[name]}
      helperText={error}
      {...rest}
    />
  );
};

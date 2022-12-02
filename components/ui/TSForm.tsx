import {
  Children,
  FormHTMLAttributes,
  ReactElement,
  createElement,
  JSXElementConstructor,
} from "react";
import { Box, BoxProps } from "@mui/material";
import {
  FormProvider,
  useForm,
  UseFormProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { TSTextField } from "./TSTextField";

type Props<T> = Omit<BoxProps<"form">, "onSubmit"> & {
  form?: UseFormProps<T & FieldValues, any>;
  onSubmit: (data: T) => unknown;
  children: React.ReactNode;
  methods?: UseFormReturn<T & FieldValues>;
};

export const TSForm = <T extends Object = {}>({
  children,
  onSubmit,
  form,
  methods: receivedMethods,
  ...rest
}: Props<T>) => {
  const methods = useForm<T>(form);

  return (
    <FormProvider {...(receivedMethods || methods)}>
      <Box
        component='form'
        onSubmit={
          receivedMethods
            ? receivedMethods.handleSubmit(onSubmit)
            : methods.handleSubmit(onSubmit)
        }
        {...rest}
      >
        {Children.map(children, (child: any) => {
          return child && child.props.name
            ? createElement<T>(child.type, {
                key: child.props.name,
                ...child.props,
              })
            : child;
        })}
      </Box>
    </FormProvider>
  );
};

TSForm.TSTextField = TSTextField;

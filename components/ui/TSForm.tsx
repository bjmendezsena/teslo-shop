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
  DeepPartial,
  FieldValues,
} from "react-hook-form";

type Props<T> = Omit<BoxProps<"form">, "onSubmit"> & {
  form: UseFormProps<T & FieldValues, any>;
  onSubmit: (data: T) => unknown;
  children: React.ReactNode;
};

export const TSForm = <T extends Object = {}>({
  children,
  onSubmit,
  form,
  ...rest
}: Props<T>) => {
  const methods = useForm<T>(form);

  //   const renderChildren = (child: any) => {
  //     if (!child) return null;

  //     if (typeof child === "function") {
  //       return child(methods);
  //     }

  //     if (child.props.name) {
  //       //   return createElement(child.type, {
  //       //     ...methods.register(child.props.name as any, child.props.options),
  //       //     error: !!methods.formState.errors[child.props.name],
  //       //     helperText: methods.formState.errors[child.props.name]?.message,
  //       //     ...child.props,
  //       //   });
  //     }

  //     if (child.props.children) {
  //       return {
  //         ...child,
  //         props: {
  //           ...child.props,
  //           children: Children.map(child.props.children, renderChildren),
  //         },
  //       };
  //     }

  //     return child;
  //   };
  return (
    <FormProvider {...methods}>
      <Box component='form' onSubmit={methods.handleSubmit(onSubmit)} {...rest}>
        {Children.map(children, (child: any) => {
          return child && child.props.name
            ? createElement<T>(child.type, {
                ...{
                  key: child.props.name,
                  ...child.props,
                },
              })
            : child;
        })}
      </Box>
    </FormProvider>
  );
};

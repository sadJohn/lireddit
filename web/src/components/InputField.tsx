import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  textarea = false,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        as={textarea ? "textarea" : "input"}
      />

      {touched && error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

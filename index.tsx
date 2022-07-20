import { Button, Input, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FocusEventHandler, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  FieldErrorsImpl,
} from "react-hook-form";

interface IFormInput {
  firstName: string;
  lastname: string;
}

type ErrorPropType = {
  message: string | undefined;
  show: boolean;
};

function Error(props: ErrorPropType) {
  const { message, show } = props;
  if (!show) return null;
  return (
    <div
      style={{ border: "1px solid red", padding: "0.5rem 1rem", color: "red" }}
    >
      <Typography variant="body2">{message}</Typography>
    </div>
  );
}

function Form() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: { firstName: "", lastname: "" },
  });

  const [focusedElem, setFocusedElem] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    console.log(errors);
  };

  const onError = (errors: any) => {
    setFocusedElem("");
    renderErrors(errors);
  };

  const handleBlur: FocusEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    const { value, name } = e.target;
    setFocusedElem(name);
  };

  const renderErrors = (errors: FieldErrorsImpl) => {
    const text =
      Object.values(errors).length > 1
        ? "Has multiple errors"
        : Object.values(errors)[0]?.message?.toString;

    const message = focusedElem
      ? errors[focusedElem]?.message?.toString()
      : text?.toString();

    return <Error show={Boolean(message)} message={message} />;
  };

  return (
    <Box sx={{ display: "grid", placeItems: "center" }}>
      {renderErrors(errors)}
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2em",
          minWidth: "50%",
        }}
      >
        <Controller
          name="firstName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...register("firstName", {
                required: {
                  value: true,
                  message: "Please fill First name",
                },
                minLength: {
                  value: 3,
                  message: " Minimum 3 char",
                },
                onBlur: handleBlur,
              })}
              {...field}
              placeholder="First name"
              error={Boolean(errors.firstName?.message)}
            />
          )}
        />

        <Controller
          name="lastname"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...register("lastname", {
                required: {
                  value: true,
                  message: "Please fill Last name",
                },
                onBlur: handleBlur,
              })}
              {...field}
              placeholder="Last name"
              error={Boolean(errors.lastname?.message)}
            />
          )}
        />

        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </Box>
  );
}

export default Form;

import { useTsController } from "@ts-react/form";

interface TextFieldProps {
  type?: string;
  classes?: string;
  placeholder?: string;
}

export function TextField({ type, placeholder, classes }: TextFieldProps) {
  const {
    field: { onChange, value },
    error,
  } = useTsController<string>();

  return (
    <>
      <input
        placeholder={placeholder}
        type={type}
        className={classes}
        onChange={(e) => onChange(e.target.value)}
        value={value ? value : ""}
      />
      {!!error && error.errorMessage}
    </>
  );
}

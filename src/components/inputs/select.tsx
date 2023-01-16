import { useTsController } from "@ts-react/form";

export function SelectField({ options }: { options: string[] }) {
  const { field, error } = useTsController<string>();
  return (
    <>
      <select
        value={!!field.value ? field.value : "none"}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      >
        {!field.value && <option value="none">Please select...</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span>{!!error?.errorMessage && error.errorMessage}</span>
    </>
  );
}

import { useTsController } from "@ts-react/form";

export function CheckboxField({ label }: { label: string }) {
  const {
    field: { onChange, value },
  } = useTsController<boolean>();

  return (
    <label>
      {label}
      <input
        onChange={(e) => onChange(e.target.checked)}
        checked={value ? value : false}
        type="checkbox"
      />
    </label>
  );
}

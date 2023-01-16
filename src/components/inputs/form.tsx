import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import { z } from "zod";
import { CheckboxField } from "./checkbox";
import { MultiCheckboxField } from "./multi-checkbox";
import { NumberField } from "./number-field";
import { SelectField } from "./select";
import { TextField } from "./text-field";

const SelectSchema = createUniqueFieldSchema(
  z.string(),
  "select" // You need to pass a string ID, it can be anything but has to be set explicitly and be unique.
);

// create the mapping
const mapping = [
  [z.string(), TextField] as const,
  [z.boolean(), CheckboxField] as const,
  [z.array(z.string()), MultiCheckboxField] as const,
  [z.number(), NumberField] as const,
  [SelectSchema, SelectField] as const,
] as const; // 👈 `as const` is necessary

// A typesafe React component
export const Form = createTsForm(mapping);

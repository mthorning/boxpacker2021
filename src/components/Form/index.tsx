import { useState, FormEvent, ChangeEvent } from 'react';
import { ID } from '../../types';
import './Form.css';

interface SelectOption {
  label: string;
  value?: string;
}

type InputType = 'number' | 'text' | 'select';

interface FormInputProps {
  value?: number | string | ID;
  onChange: (e: ChangeEvent) => void;
  autoFocus: boolean;
  name: string;
  type: InputType;
  options?: SelectOption[];
}

export interface FormValues {
  name: string;
  quantity?: number;
  box?: ID;
}

export interface FormSchemaItem {
  label: string;
  name: string;
  type: InputType;
  options?: SelectOption[];
  min?: number;
}

interface FormProps {
  schema: FormSchemaItem[];
  handleSubmit: (values: FormValues) => void;
  initialValues: FormValues;
}

function getFormInput({ type, options, ...inputProps }: FormInputProps) {
  switch (type) {
    case 'select':
      return options?.length ? (
        <select {...inputProps}>
          {options.map(({ label, value }) => (
            <option value={value}>{label}</option>
          ))}
        </select>
      ) : null;
    default:
      return <input type={type} {...inputProps} />;
  }
}

function FormElement({ label, ...rest }: FormSchemaItem & FormInputProps) {
  const input = getFormInput(rest);
  return input ? (
    <label>
      <span className="label">{label}</span>
      {input}
    </label>
  ) : null;
}

export function Form({ schema, handleSubmit, initialValues }: FormProps) {
  const [values, setValues] = useState(initialValues);

  let changeHandler: (name: string) => (e: ChangeEvent) => void;
  changeHandler = (name) => (e) => {
    setValues((current) => ({
      ...current,
      [name]: (e.target as HTMLInputElement).value,
    }));
  };
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        handleSubmit(values);
      }}
      className="form"
    >
      {schema.map((schemaItem, i) => (
        <FormElement
          {...schemaItem}
          autoFocus={i === 0}
          key={schemaItem.name}
          value={values[schemaItem.name as keyof FormValues]}
          onChange={changeHandler(schemaItem.name)}
        />
      ))}
      <input type="submit" value="Submit" />
    </form>
  );
}

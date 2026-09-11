import type { ReactNode } from "react";

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  children: ReactNode;
};

export function FieldWrap({ label, name, required, children }: BaseProps) {
  return (
    <label htmlFor={name} className="block">
      <span className="mb-2 block text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-accent";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return <textarea {...props} className={`${inputClass} min-h-32 resize-y`} />;
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select {...props} className={`${inputClass} appearance-none`}>
      {props.children}
    </select>
  );
}

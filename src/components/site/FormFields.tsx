import { Checkbox } from "@/components/ui/checkbox";

const inputCls =
  "w-full bg-background border border-border px-3 py-3 text-sm focus:outline-none focus:border-foreground";

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label}
        {required && <span className="text-foreground"> *</span>}
      </div>
      {children}
    </label>
  );
}

export function TextField({
  label,
  required,
  ...rest
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} required={required}>
      <input required={required} className={inputCls} {...rest} />
    </Field>
  );
}

export function TextAreaField({
  label,
  required,
  rows = 4,
  ...rest
}: {
  label: string;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} required={required}>
      <textarea required={required} rows={rows} className={inputCls} {...rest} />
    </Field>
  );
}

export function SelectField({
  label,
  required,
  children,
  ...rest
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} required={required}>
      <select required={required} className={inputCls} {...rest}>
        {children}
      </select>
    </Field>
  );
}

export function CheckboxRow({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <span>{children}</span>
    </label>
  );
}

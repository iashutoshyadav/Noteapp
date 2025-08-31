import { HTMLProps } from "react";

type Props = HTMLProps<HTMLInputElement> & { label: string; error?: string; hint?: string };
export default function FormField({ label, error, hint, ...rest }: Props) {
  return (
    <label className="block space-y-1 w-full">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <input className="input" {...rest}/>
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-gray-500">{hint}</span>
      ) : null}
    </label>
  );
}

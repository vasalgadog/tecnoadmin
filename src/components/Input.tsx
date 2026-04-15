import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseProps {
  label: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}
interface SelectProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
  as: 'select';
  options: { label: string; value: string }[];
}

type Props = InputProps | SelectProps;

export default function Input(props: Props) {
  const { label, as = 'input', ...rest } = props;

  return (
    <div className="input-group">
      <label>{label}</label>
      {as === 'select' ? (
        <select className="filled-input" {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}>
          {(props as SelectProps).options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input className="filled-input" {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </div>
  );
}

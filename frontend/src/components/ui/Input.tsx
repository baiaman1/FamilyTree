type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = "", ...props }: Props) => (
  <input
    {...props}
    className={`px-2 py-1 border rounded text-sm focus:outline-none focus:ring w-full ${className}`}
  />
);

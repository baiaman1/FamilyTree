type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className = "", ...props }: Props) => (
  <button
    {...props}
    className={`px-2 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200 border ${className}`}
  />
);

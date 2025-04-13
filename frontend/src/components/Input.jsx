export function Input({ className, ...props }) {
    return <input className={`border border-gray-300 rounded px-4 py-2 w-full ${className}`} {...props} />;
  }
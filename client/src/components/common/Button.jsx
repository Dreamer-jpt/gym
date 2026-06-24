import { Loader2 } from "lucide-react";

export default function Button({ children, variant = "primary", loading = false, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-800 dark:text-dark-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "text-gray-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'normal' | 'small';
}

const variantClasses = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-sm focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500',
  secondary: 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-sm focus-visible:outline-indigo-600 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-600 dark:focus-visible:outline-indigo-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm focus-visible:outline-red-600 dark:hover:bg-red-500 dark:focus-visible:outline-red-500',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50 border-transparent text-slate-600 dark:text-slate-300 focus-visible:outline-slate-300 dark:focus-visible:outline-slate-600',
};

const sizeClasses = {
    normal: 'px-4 py-2 text-sm',
    small: 'px-2.5 py-1.5 text-xs'
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'normal', className = '', ...props }) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-md font-semibold border
        transition-all duration-150 ease-in-out
        focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2
        active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
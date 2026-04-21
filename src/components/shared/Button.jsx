const variants = {
  primary: 'bg-[#1E3A5F] hover:bg-[#162d4a] text-white shadow-sm',
  danger:  'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
  warning: 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm',
  ghost:   'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-200',
  outline: 'bg-white hover:bg-slate-50 text-[#1E3A5F] border border-[#1E3A5F]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-150 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

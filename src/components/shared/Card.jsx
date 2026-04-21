export default function Card({ children, className = '', title, action }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

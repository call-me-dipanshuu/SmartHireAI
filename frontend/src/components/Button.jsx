export function Button({ children, onClick, variant = 'default', className = '' }) {
    const base = 'px-4 py-2 rounded text-white font-medium';
    const styles = variant === 'default' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50';
    return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
  }
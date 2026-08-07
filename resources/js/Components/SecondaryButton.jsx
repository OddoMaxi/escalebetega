export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center gap-2 rounded-xl border border-forest-dark/30 px-6 py-3 text-sm font-semibold text-forest-dark transition-colors hover:bg-forest-dark/5 focus:outline-none focus:ring-2 focus:ring-forest/30 disabled:opacity-50 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

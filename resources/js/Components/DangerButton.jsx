export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-6 py-3 text-sm font-semibold text-cream transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-danger/30 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

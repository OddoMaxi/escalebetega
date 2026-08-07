export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center gap-2 rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest focus:outline-none focus:ring-2 focus:ring-forest/30 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block text-xs font-semibold text-muted ` + className}
        >
            {value ? value : children}
        </label>
    );
}

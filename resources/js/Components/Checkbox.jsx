export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-black/20 text-forest focus:ring-forest/30 ' +
                className
            }
        />
    );
}

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'text-xs text-danger ' + className}>
            {message}
        </p>
    ) : null;
}

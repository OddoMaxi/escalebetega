import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest/30 ' +
                className
            }
            ref={localRef}
        />
    );
});

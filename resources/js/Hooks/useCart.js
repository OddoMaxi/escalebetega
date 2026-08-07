import { useCallback, useEffect, useState } from 'react';

function storageKey(salonToken) {
    return `escale_cart_${salonToken}`;
}

function readCart(salonToken) {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(storageKey(salonToken));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCart(salonToken, items) {
    window.localStorage.setItem(storageKey(salonToken), JSON.stringify(items));
}

export default function useCart(salonToken) {
    const [items, setItems] = useState(() => readCart(salonToken));

    useEffect(() => {
        writeCart(salonToken, items);
    }, [salonToken, items]);

    const addItem = useCallback((product, quantity = 1) => {
        setItems((current) => {
            const existing = current.find((item) => item.productId === product.id);

            if (existing) {
                return current.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                );
            }

            return [
                ...current,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                },
            ];
        });
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        setItems((current) => {
            if (quantity <= 0) {
                return current.filter((item) => item.productId !== productId);
            }

            return current.map((item) =>
                item.productId === productId ? { ...item, quantity } : item,
            );
        });
    }, []);

    const removeItem = useCallback((productId) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
    }, []);

    const clear = useCallback(() => {
        setItems([]);
    }, []);

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { items, addItem, updateQuantity, removeItem, clear, count, subtotal };
}

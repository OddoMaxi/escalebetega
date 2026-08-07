import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ChevronLeft, Minus, Plus } from 'lucide-react';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function NewOrder({ salons, categories }) {
    const [salonId, setSalonId] = useState(salons[0]?.id ?? '');
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? null);
    const [cart, setCart] = useState({});
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const currentCategory = categories.find((c) => c.id === activeCategory) ?? categories[0];

    const cartItems = useMemo(() => {
        const allProducts = categories.flatMap((c) => c.products);
        return Object.entries(cart)
            .filter(([, qty]) => qty > 0)
            .map(([productId, qty]) => {
                const product = allProducts.find((p) => p.id === Number(productId));
                return product ? { ...product, quantity: qty } : null;
            })
            .filter(Boolean);
    }, [cart, categories]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const setQuantity = (productId, quantity) => {
        setCart((current) => ({ ...current, [productId]: Math.max(0, quantity) }));
    };

    const handleSubmit = () => {
        if (!salonId || cartItems.length === 0) return;

        setSubmitting(true);
        setError(null);

        router.post(
            '/serveur/commandes',
            {
                salon_id: salonId,
                items: cartItems.map((item) => ({ product_id: item.id, quantity: item.quantity })),
                customer_name: customerName || null,
                customer_phone: customerPhone || null,
            },
            {
                onError: () => setError('Une erreur est survenue. Merci de réessayer.'),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <>
            <Head title="Nouvelle commande" />

            <div className="min-h-screen bg-base pb-40">
                <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-black/5 px-4 py-4 flex items-center gap-3">
                    <Link href="/serveur" className="text-forest-dark">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-base font-bold text-forest-dark">Nouvelle commande</h1>
                </header>

                <div className="mx-4 mt-4">
                    <label className="text-xs font-semibold text-muted">Sélectionner un salon</label>
                    <select
                        value={salonId}
                        onChange={(e) => setSalonId(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forest/30"
                    >
                        {salons.map((salon) => (
                            <option key={salon.id} value={salon.id}>
                                {salon.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mx-4 mt-4 flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                                currentCategory?.id === category.id
                                    ? 'bg-forest-dark text-cream'
                                    : 'bg-cream border border-black/10 text-ink'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="mx-4 mt-4 flex flex-col gap-2">
                    {currentCategory?.products.map((product) => {
                        const quantity = cart[product.id] ?? 0;
                        return (
                            <div
                                key={product.id}
                                className="flex items-center justify-between rounded-xl bg-cream border border-black/5 px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-bold text-ink">{product.name}</p>
                                    <p className="text-xs text-muted">{formatGnf(product.price)}</p>
                                </div>

                                {quantity === 0 ? (
                                    <button
                                        onClick={() => setQuantity(product.id, 1)}
                                        className="h-9 w-9 rounded-full bg-forest-dark text-cream flex items-center justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQuantity(product.id, quantity - 1)}
                                            className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center"
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-5 text-center text-sm font-bold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(product.id, quantity + 1)}
                                            className="h-8 w-8 rounded-full bg-forest-dark text-cream flex items-center justify-center"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mx-4 mt-6">
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="text-xs font-semibold text-forest-dark underline"
                    >
                        {showInfo ? 'Masquer' : 'Ajouter'} les informations client (facultatif)
                    </button>

                    {showInfo && (
                        <div className="mt-3 flex flex-col gap-2">
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Nom du client (facultatif)"
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="+224 620 00 00 00"
                                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                            />
                        </div>
                    )}
                </div>

                {error && <p className="mx-4 mt-4 text-sm text-danger">{error}</p>}

                <div className="fixed bottom-0 inset-x-0 bg-cream border-t border-black/10 px-4 py-4">
                    <div className="mx-auto max-w-md">
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-muted">Sous-total ({count} article{count > 1 ? 's' : ''})</span>
                            <span className="font-bold text-forest-dark">{formatGnf(total)}</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || cartItems.length === 0 || !salonId}
                            className="w-full rounded-xl bg-forest-dark px-6 py-4 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Envoi en cours...' : 'Envoyer la commande'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

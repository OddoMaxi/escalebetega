import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import ClientTopBar from '@/Components/Client/ClientTopBar';
import BottomNav from '@/Components/Client/BottomNav';
import useCart, { clearCartStorage } from '@/Hooks/useCart';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function Cart({ salon }) {
    const cart = useCart(salon.token);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        if (cart.items.length === 0) return;

        setSubmitting(true);
        setError(null);

        router.post(
            `/q/${salon.token}/commandes`,
            {
                items: cart.items.map((item) => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
                customer_name: name || null,
                customer_phone: phone || null,
            },
            {
                onSuccess: () => clearCartStorage(salon.token),
                onError: () => setError('Une erreur est survenue. Merci de réessayer.'),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <>
            <Head title={`Panier — ${salon.name}`} />

            <div className="min-h-screen bg-base pb-24">
                <ClientTopBar
                    token={salon.token}
                    salonName={salon.name}
                    title="Mon Panier"
                    back={`/q/${salon.token}/menu`}
                />

                <div className="mx-auto max-w-md px-4 pt-4">
                    {cart.items.length === 0 ? (
                        <div className="flex flex-col items-center py-20 text-center">
                            <ShoppingBag className="h-10 w-10 text-muted mb-3" strokeWidth={1.5} />
                            <p className="text-sm text-muted">Votre panier est vide.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex items-center gap-3 rounded-2xl bg-cream border border-black/5 p-3"
                                    >
                                        {item.photo ? (
                                            <img
                                                src={item.photo}
                                                alt={item.name}
                                                className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-sun to-forest-dark" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-ink truncate">{item.name}</p>
                                            <p className="text-xs text-muted">{formatGnf(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                                                className="h-7 w-7 rounded-full border border-black/10 flex items-center justify-center"
                                                aria-label="Diminuer"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-5 text-center text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                                                className="h-7 w-7 rounded-full border border-black/10 flex items-center justify-center"
                                                aria-label="Augmenter"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => cart.removeItem(item.productId)}
                                            className="text-danger ml-1"
                                            aria-label="Supprimer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-2xl bg-cream border border-black/5 p-4">
                                <div className="flex justify-between text-sm text-muted">
                                    <span>Sous-total</span>
                                    <span>{formatGnf(cart.subtotal)}</span>
                                </div>
                                <div className="mt-2 flex justify-between text-base font-bold text-forest-dark">
                                    <span>Total</span>
                                    <span>{formatGnf(cart.subtotal)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm font-bold text-ink">Vos informations</p>
                                <p className="text-xs text-muted mt-1">
                                    Facultatif mais recommandé pour recevoir vos notifications.
                                </p>

                                <div className="mt-3 flex flex-col gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-muted">Nom (facultatif)</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ex : Mamadou Camara"
                                            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted">
                                            Téléphone (facultatif)
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+224 620 00 00 00"
                                            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                        />
                                    </div>
                                </div>

                                <p className="mt-2 text-[11px] text-muted">
                                    Ajoutez votre numéro pour recevoir les notifications de votre commande.
                                </p>
                            </div>

                            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="mt-6 w-full rounded-xl bg-forest-dark px-6 py-4 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-60"
                            >
                                {submitting ? 'Envoi en cours...' : 'Valider mon panier'}
                            </button>
                        </>
                    )}
                </div>

                <BottomNav token={salon.token} active="panier" cartCount={cart.count} />
            </div>
        </>
    );
}

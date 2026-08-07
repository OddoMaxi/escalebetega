import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

const METHODS = [
    { value: 'especes', label: 'Espèces' },
    { value: 'orange_money', label: 'Orange Money' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'carte', label: 'Carte' },
    { value: 'autre', label: 'Autre' },
];

export default function Show({ session }) {
    const { data, setData, post, processing, errors } = useForm({
        amount: session.remaining,
        method: 'especes',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/caisse/${session.id}/paiement`);
    };

    return (
        <AdminLayout active="cash" title={`Caisse — ${session.salon}`}>
            <Head title={`Caisse ${session.salon} — Admin`} />

            <Link href="/admin/caisse" className="inline-flex items-center gap-1 text-sm text-forest-dark font-semibold mb-6">
                <ChevronLeft className="h-4 w-4" />
                Retour à la caisse
            </Link>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-card bg-cream border border-black/5 p-6">
                    <p className="text-sm font-bold text-ink mb-4">Commandes de la session</p>

                    <div className="flex flex-col gap-4">
                        {session.orders.map((order, idx) => (
                            <div key={idx} className="border-b border-black/5 last:border-0 pb-4 last:pb-0">
                                <div className="flex justify-between text-sm font-semibold text-forest-dark mb-1">
                                    <span>{order.number}</span>
                                    <span>{formatGnf(order.total)}</span>
                                </div>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-xs text-muted">
                                        <span>{item.quantity}× {item.name}</span>
                                        <span>{formatGnf(item.total)}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {session.payments.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-black/5">
                            <p className="text-sm font-bold text-ink mb-3">Paiements enregistrés</p>
                            {session.payments.map((payment, idx) => (
                                <div key={idx} className="flex justify-between text-sm text-muted">
                                    <span>{payment.time} · {METHODS.find((m) => m.value === payment.method)?.label}</span>
                                    <span className="text-ink font-semibold">{formatGnf(payment.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-card bg-cream border border-black/5 p-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted">Total</span>
                        <span className="text-ink font-semibold">{formatGnf(session.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-muted">Restant</span>
                        <span className="text-danger font-bold">{formatGnf(session.remaining)}</span>
                    </div>

                    {session.closed ? (
                        <p className="text-sm text-success font-semibold">Session encaissée et clôturée.</p>
                    ) : (
                        <form onSubmit={submit} className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs font-semibold text-muted">Montant (GNF)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                />
                                {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted">Mode de paiement</label>
                                <select
                                    value={data.method}
                                    onChange={(e) => setData('method', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                                >
                                    {METHODS.map((method) => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                            >
                                Encaisser
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

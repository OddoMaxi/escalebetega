import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AlertCircle, ArrowLeftRight, ChevronLeft, Combine, Split } from 'lucide-react';
import { salonStatusMeta } from '@/Utils/salonStatus';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

const STATUS_LABELS = {
    nouvelle: 'Nouvelle',
    confirmee: 'Confirmée',
    en_preparation: 'En préparation',
    prete: 'Prête',
    servie: 'Servie',
    a_encaisser: 'À encaisser',
    payee: 'Payée',
    terminee: 'Terminée',
    annulee: 'Annulée',
};

export default function SalonDetail({ salon, session, otherSalons }) {
    const { props } = usePage();
    const error = props.flash?.error;
    const [action, setAction] = useState(null); // 'transfer' | 'merge' | 'split'
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [targetSalonId, setTargetSalonId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const meta = salonStatusMeta(salon.status);
    const freeSalons = otherSalons.filter((s) => s.free);
    const occupiedSalons = otherSalons.filter((s) => !s.free);

    const toggleOrder = (orderId) => {
        setSelectedOrderIds((current) =>
            current.includes(orderId) ? current.filter((id) => id !== orderId) : [...current, orderId],
        );
    };

    const openAction = (next) => {
        setAction(action === next ? null : next);
        setTargetSalonId(null);
        if (next !== 'split') setSelectedOrderIds([]);
    };

    const confirmTransfer = () => {
        if (!targetSalonId) return;
        setSubmitting(true);
        router.post(`/serveur/salons/${salon.id}/transferer`, { to_salon_id: targetSalonId }, {
            onFinish: () => setSubmitting(false),
        });
    };

    const confirmMerge = () => {
        if (!targetSalonId) return;
        setSubmitting(true);
        router.post(`/serveur/salons/${salon.id}/fusionner`, { from_salon_id: targetSalonId }, {
            onFinish: () => setSubmitting(false),
        });
    };

    const confirmSplit = () => {
        if (!targetSalonId || selectedOrderIds.length === 0) return;
        setSubmitting(true);
        router.post(`/serveur/salons/${salon.id}/diviser`, {
            to_salon_id: targetSalonId,
            order_ids: selectedOrderIds,
        }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title={`${salon.name} — Espace Serveur`} />

            <div className="min-h-screen bg-base pb-16">
                <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-black/5 px-4 py-4 flex items-center gap-3">
                    <Link href="/serveur/salons" className="text-forest-dark">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-base font-bold text-forest-dark">{salon.name}</h1>
                    </div>
                    <span className={`text-xs font-bold rounded-full border px-2.5 py-1 ${meta.classes}`}>
                        {meta.label}
                    </span>
                </header>

                {error && (
                    <div className="mx-4 mt-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold px-4 py-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {!session ? (
                    <p className="text-center text-sm text-muted py-16 px-6">
                        Aucune session active sur ce salon.
                    </p>
                ) : (
                    <>
                        <div className="mx-4 mt-4 flex flex-col gap-2">
                            {session.orders.map((order) => (
                                <label
                                    key={order.id}
                                    className={`flex items-start gap-3 rounded-xl border p-3 ${
                                        action === 'split' ? 'bg-cream border-black/10 cursor-pointer' : 'bg-cream border-black/5'
                                    }`}
                                >
                                    {action === 'split' && (
                                        <input
                                            type="checkbox"
                                            checked={selectedOrderIds.includes(order.id)}
                                            onChange={() => toggleOrder(order.id)}
                                            className="mt-1 rounded border-black/20 text-forest focus:ring-forest/30"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-forest-dark">{order.number}</span>
                                            <span className="text-xs font-semibold rounded-full bg-sun/15 text-wood px-2 py-0.5">
                                                {STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        {order.items.map((item, i) => (
                                            <p key={i} className="text-xs text-muted">
                                                {item.quantity}× {item.name}
                                            </p>
                                        ))}
                                        <p className="mt-1 text-sm font-bold text-ink">{formatGnf(order.total)}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="mx-4 mt-3 flex justify-between rounded-xl bg-forest-dark/5 px-4 py-3 text-sm">
                            <span className="font-semibold text-ink">Total session</span>
                            <span className="font-bold text-forest-dark">{formatGnf(session.total)}</span>
                        </div>

                        {session.hasPayments ? (
                            <p className="mx-4 mt-4 text-xs text-muted">
                                Un paiement a déjà été enregistré — fusion et division indisponibles pour cette session.
                            </p>
                        ) : (
                            <>
                                <div className="mx-4 mt-6 grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => openAction('transfer')}
                                        className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-semibold ${
                                            action === 'transfer' ? 'bg-forest-dark text-cream border-forest-dark' : 'border-black/10 text-ink'
                                        }`}
                                    >
                                        <ArrowLeftRight className="h-4 w-4" />
                                        Transférer
                                    </button>
                                    <button
                                        onClick={() => openAction('merge')}
                                        className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-semibold ${
                                            action === 'merge' ? 'bg-forest-dark text-cream border-forest-dark' : 'border-black/10 text-ink'
                                        }`}
                                    >
                                        <Combine className="h-4 w-4" />
                                        Fusionner
                                    </button>
                                    <button
                                        onClick={() => openAction('split')}
                                        className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-semibold ${
                                            action === 'split' ? 'bg-forest-dark text-cream border-forest-dark' : 'border-black/10 text-ink'
                                        }`}
                                    >
                                        <Split className="h-4 w-4" />
                                        Diviser
                                    </button>
                                </div>

                                {action === 'transfer' && (
                                    <div className="mx-4 mt-4 rounded-xl bg-cream border border-black/5 p-4">
                                        <p className="text-sm font-bold text-ink mb-3">
                                            Déplacer toute la session vers :
                                        </p>
                                        {freeSalons.length === 0 ? (
                                            <p className="text-xs text-muted">Aucun salon libre pour l&rsquo;instant.</p>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {freeSalons.map((s) => (
                                                    <label key={s.id} className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="radio"
                                                            name="target"
                                                            checked={targetSalonId === s.id}
                                                            onChange={() => setTargetSalonId(s.id)}
                                                        />
                                                        {s.name}
                                                    </label>
                                                ))}
                                                <button
                                                    onClick={confirmTransfer}
                                                    disabled={!targetSalonId || submitting}
                                                    className="mt-2 rounded-xl bg-forest-dark px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-50"
                                                >
                                                    Confirmer le transfert
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {action === 'merge' && (
                                    <div className="mx-4 mt-4 rounded-xl bg-cream border border-black/5 p-4">
                                        <p className="text-sm font-bold text-ink mb-3">
                                            Fusionner avec la session de :
                                        </p>
                                        {occupiedSalons.length === 0 ? (
                                            <p className="text-xs text-muted">Aucun autre salon occupé pour l&rsquo;instant.</p>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {occupiedSalons.map((s) => (
                                                    <label key={s.id} className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="radio"
                                                            name="target"
                                                            checked={targetSalonId === s.id}
                                                            onChange={() => setTargetSalonId(s.id)}
                                                        />
                                                        {s.name}
                                                    </label>
                                                ))}
                                                <button
                                                    onClick={confirmMerge}
                                                    disabled={!targetSalonId || submitting}
                                                    className="mt-2 rounded-xl bg-forest-dark px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-50"
                                                >
                                                    Confirmer la fusion
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {action === 'split' && (
                                    <div className="mx-4 mt-4 rounded-xl bg-cream border border-black/5 p-4">
                                        <p className="text-sm font-bold text-ink mb-1">
                                            Cochez les commandes à déplacer ci-dessus, puis choisissez la destination :
                                        </p>
                                        {freeSalons.length === 0 ? (
                                            <p className="text-xs text-muted mt-2">Aucun salon libre pour l&rsquo;instant.</p>
                                        ) : (
                                            <div className="flex flex-col gap-2 mt-3">
                                                {freeSalons.map((s) => (
                                                    <label key={s.id} className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="radio"
                                                            name="target"
                                                            checked={targetSalonId === s.id}
                                                            onChange={() => setTargetSalonId(s.id)}
                                                        />
                                                        {s.name}
                                                    </label>
                                                ))}
                                                <button
                                                    onClick={confirmSplit}
                                                    disabled={!targetSalonId || selectedOrderIds.length === 0 || submitting}
                                                    className="mt-2 rounded-xl bg-forest-dark px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-50"
                                                >
                                                    Déplacer {selectedOrderIds.length || ''} commande(s)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

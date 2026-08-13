import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { CheckCircle2, Clock, Receipt } from 'lucide-react';
import ClientTopBar from '@/Components/Client/ClientTopBar';
import BottomNav from '@/Components/Client/BottomNav';
import useCart from '@/Hooks/useCart';
import { storeSessionId } from '@/Hooks/useClientSession';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

const STATUS_LABELS = {
    nouvelle: 'Reçue',
    confirmee: 'Reçue',
    en_preparation: 'En préparation',
    prete: 'Prête',
    servie: 'Servie',
    a_encaisser: 'À encaisser',
    payee: 'Payée',
    terminee: 'Terminée',
    annulee: 'Annulée',
};

const STATUS_CLASSES = {
    nouvelle: 'bg-sun/15 text-wood',
    confirmee: 'bg-sun/15 text-wood',
    en_preparation: 'bg-blue-500/10 text-blue-600',
    prete: 'bg-success/10 text-success',
    servie: 'bg-forest/10 text-forest',
    a_encaisser: 'bg-purple-500/10 text-purple-600',
    payee: 'bg-black/5 text-muted',
    terminee: 'bg-black/5 text-muted',
    annulee: 'bg-danger/10 text-danger',
};

export default function Addition({ salon, session }) {
    const cart = useCart(salon.token);

    useEffect(() => {
        if (session?.id) storeSessionId(salon.token, session.id);
    }, [salon.token, session?.id]);

    const isPaid = session?.closed;

    return (
        <>
            <Head title={`Mon addition — ${salon.name}`} />

            <div className="min-h-screen bg-base pb-24">
                <ClientTopBar token={salon.token} salonName={salon.name} title="Mon addition" />

                <div className="mx-auto max-w-md px-4 pt-4">
                    {!session ? (
                        <div className="flex flex-col items-center py-20 text-center">
                            <Receipt className="h-10 w-10 text-muted mb-3" strokeWidth={1.5} />
                            <p className="text-sm text-muted">Vous n&rsquo;avez pas encore de commande en cours.</p>
                            <Link
                                href={`/q/${salon.token}/menu`}
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-forest-dark px-6 py-3.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                            >
                                Voir le menu
                            </Link>
                        </div>
                    ) : (
                        <>
                            {isPaid ? (
                                <div className="rounded-2xl bg-success/10 border border-success/20 px-4 py-3 flex items-start gap-2.5">
                                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-success leading-snug">
                                        Cette addition a été réglée. Merci pour votre visite &mdash; à bientôt sur la
                                        plage&nbsp;!
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-sun/15 border border-sun/30 px-4 py-3 flex items-start gap-2.5">
                                    <Clock className="h-4 w-4 text-wood flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-wood leading-snug">
                                        Addition ouverte à {session.openedAt}. Toutes vos commandes s&rsquo;ajoutent ici
                                        jusqu&rsquo;au règlement, à faire directement auprès d&rsquo;un serveur.
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex flex-col gap-3">
                                {session.orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="rounded-2xl bg-cream border border-black/5 p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-sm text-forest-dark">{order.number}</p>
                                                <p className="text-xs text-muted">{order.time}</p>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                                                    STATUS_CLASSES[order.status] ?? 'bg-black/5 text-muted'
                                                }`}
                                            >
                                                {STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-col gap-0.5">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-xs text-muted">
                                                    <span>{item.quantity}× {item.name}</span>
                                                    <span>{formatGnf(item.total)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-black/5 flex justify-between text-sm font-bold text-ink">
                                            <span>Sous-total</span>
                                            <span>{formatGnf(order.total)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                className={`mt-4 rounded-2xl px-5 py-4 flex items-center justify-between ${
                                    isPaid ? 'bg-forest' : 'bg-forest-dark'
                                }`}
                            >
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-cream/60">
                                        {isPaid ? 'Total réglé' : 'Total à régler'}
                                    </p>
                                    <p className="text-xl font-extrabold text-cream">{formatGnf(session.total)}</p>
                                </div>
                                <span className="text-xs font-bold rounded-full bg-cream/15 text-cream px-3 py-1.5">
                                    {isPaid ? 'Payée ✓' : 'Non payé'}
                                </span>
                            </div>

                            <Link
                                href={`/q/${salon.token}/menu`}
                                className="mt-4 mb-4 inline-flex w-full items-center justify-center rounded-xl border border-forest-dark/30 px-6 py-3.5 text-sm font-semibold text-forest-dark hover:bg-forest-dark/5 transition-colors"
                            >
                                {isPaid ? 'Commander à nouveau' : 'Ajouter une commande'}
                            </Link>
                        </>
                    )}
                </div>

                <BottomNav token={salon.token} active="addition" cartCount={cart.count} />
            </div>
        </>
    );
}

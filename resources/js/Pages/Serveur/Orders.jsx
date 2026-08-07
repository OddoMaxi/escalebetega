import { Head } from '@inertiajs/react';
import ServeurNav from '@/Components/Serveur/ServeurNav';

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

export default function Orders({ orders }) {
    return (
        <>
            <Head title="Commandes — Espace Serveur" />

            <div className="min-h-screen bg-base pb-24">
                <header className="px-6 pt-8">
                    <h1 className="text-2xl font-extrabold text-forest-dark">Commandes</h1>
                    <p className="text-sm text-muted">Les 30 dernières commandes.</p>
                </header>

                <div className="mx-6 mt-6 flex flex-col gap-3">
                    {orders.length === 0 && (
                        <p className="text-center text-sm text-muted py-10">Aucune commande pour le moment.</p>
                    )}

                    {orders.map((order) => (
                        <div key={order.id} className="rounded-2xl bg-cream border border-black/5 p-4">
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-forest-dark">{order.number}</p>
                                <span className="text-xs font-semibold rounded-full bg-sun/15 text-wood px-3 py-1">
                                    {STATUS_LABELS[order.status] ?? order.status}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm text-muted">
                                <span>{order.salon} · {order.time}</span>
                                <span className="font-semibold text-ink">{formatGnf(order.total)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <ServeurNav active="orders" />
            </div>
        </>
    );
}

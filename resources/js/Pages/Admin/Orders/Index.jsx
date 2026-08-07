import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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

const STATUSES = Object.keys(STATUS_LABELS);
const SOURCES = { client_qr: 'Client QR', serveur: 'Serveur' };

export default function Index({ orders, filters }) {
    const applyFilter = (key, value) => {
        router.get('/admin/commandes', { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout active="orders" title="Commandes">
            <Head title="Commandes — Admin" />

            <div className="flex items-center gap-3 mb-6">
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => applyFilter('status', e.target.value)}
                    className="rounded-xl border border-black/10 bg-cream px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                    <option value="">Tous les statuts</option>
                    {STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.source ?? ''}
                    onChange={(e) => applyFilter('source', e.target.value)}
                    className="rounded-xl border border-black/10 bg-cream px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                    <option value="">Toutes les sources</option>
                    {Object.entries(SOURCES).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="rounded-card bg-cream border border-black/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                            <th className="px-5 py-3 font-semibold">N° Commande</th>
                            <th className="px-5 py-3 font-semibold">Salon</th>
                            <th className="px-5 py-3 font-semibold">Source</th>
                            <th className="px-5 py-3 font-semibold">Heure</th>
                            <th className="px-5 py-3 font-semibold">Montant</th>
                            <th className="px-5 py-3 font-semibold">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.map((order) => (
                            <tr key={order.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                                <td className="px-5 py-3">
                                    <Link
                                        href={`/admin/commandes/${order.id}`}
                                        className="font-semibold text-forest-dark hover:underline"
                                    >
                                        {order.number}
                                    </Link>
                                </td>
                                <td className="px-5 py-3 text-ink">{order.salon}</td>
                                <td className="px-5 py-3 text-muted">{SOURCES[order.source] ?? order.source}</td>
                                <td className="px-5 py-3 text-muted">{order.time}</td>
                                <td className="px-5 py-3 text-ink">{formatGnf(order.total)}</td>
                                <td className="px-5 py-3">
                                    <span className="text-xs font-semibold rounded-full bg-sun/15 text-wood px-2.5 py-1">
                                        {STATUS_LABELS[order.status] ?? order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {orders.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                                    Aucune commande.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {orders.links?.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {orders.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                link.active ? 'bg-forest-dark text-cream' : 'bg-cream text-muted border border-black/10'
                            } ${!link.url ? 'opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}

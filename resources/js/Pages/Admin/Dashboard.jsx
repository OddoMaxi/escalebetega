import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/Admin/StatCard';
import SalesChart from '@/Components/Admin/SalesChart';

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

export default function Dashboard({ stats, salesByHour, topProducts, recentOrders, salonsActive, salonsTotal }) {
    return (
        <AdminLayout active="dashboard" title="Dashboard">
            <Head title="Dashboard — Admin" />

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Chiffre d'affaires" value={formatGnf(stats.revenue)} />
                <StatCard label="Commandes" value={stats.orders} />
                <StatCard label="En attente" value={stats.pending} />
                <StatCard label="Prêtes" value={stats.ready} />
                <StatCard label="Clients servis" value={stats.served} />
            </div>

            <div className="mt-6 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart data={salesByHour} />
                </div>

                <div className="rounded-card bg-cream border border-black/5 p-5">
                    <p className="text-sm font-bold text-ink mb-4">Top produits</p>
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-muted">Aucune vente pour le moment.</p>
                    ) : (
                        <ol className="flex flex-col gap-3">
                            {topProducts.map((product, index) => (
                                <li key={product.name} className="flex items-center justify-between text-sm">
                                    <span className="text-ink">
                                        <span className="text-muted mr-2">{index + 1}.</span>
                                        {product.name}
                                    </span>
                                    <span className="font-bold text-forest-dark">{product.qty} vendus</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>

            <div className="mt-6 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-card bg-cream border border-black/5 p-5">
                    <p className="text-sm font-bold text-ink mb-4">Commandes récentes</p>

                    {recentOrders.length === 0 ? (
                        <p className="text-sm text-muted">Aucune commande pour le moment.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                                        <th className="pb-2 font-semibold">N° Commande</th>
                                        <th className="pb-2 font-semibold">Salon</th>
                                        <th className="pb-2 font-semibold">Heure</th>
                                        <th className="pb-2 font-semibold">Montant</th>
                                        <th className="pb-2 font-semibold">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-black/5 last:border-0">
                                            <td className="py-2.5 font-semibold text-forest-dark">{order.number}</td>
                                            <td className="py-2.5 text-ink">{order.salon}</td>
                                            <td className="py-2.5 text-muted">{order.time}</td>
                                            <td className="py-2.5 text-ink">{formatGnf(order.total)}</td>
                                            <td className="py-2.5">
                                                <span className="text-xs font-semibold rounded-full bg-sun/15 text-wood px-2.5 py-1">
                                                    {STATUS_LABELS[order.status] ?? order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="rounded-card bg-cream border border-black/5 p-5">
                    <p className="text-sm font-bold text-ink mb-4">Salons actifs</p>
                    <p className="text-3xl font-extrabold text-forest-dark">
                        {salonsActive}
                        <span className="text-base font-semibold text-muted">/{salonsTotal}</span>
                    </p>
                    <p className="text-xs text-muted mt-1">salons occupés en ce moment</p>
                </div>
            </div>
        </AdminLayout>
    );
}

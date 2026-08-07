import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/Admin/StatCard';
import BarListChart from '@/Components/Admin/BarListChart';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

const SOURCE_LABELS = { client_qr: 'Client QR', serveur: 'Serveur' };

export default function Index({ sales, topProducts, bySalon, bySource, expensesMonth, marginEstimate }) {
    return (
        <AdminLayout active="reports" title="Rapports">
            <Head title="Rapports — Admin" />

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Ventes jour" value={formatGnf(sales.today)} />
                <StatCard label="Ventes semaine" value={formatGnf(sales.week)} />
                <StatCard label="Ventes mois" value={formatGnf(sales.month)} />
                <StatCard label="Dépenses (mois)" value={formatGnf(expensesMonth)} />
                <StatCard label="Marge estimée" value={formatGnf(marginEstimate)} />
            </div>

            <div className="mt-6 grid lg:grid-cols-2 gap-6">
                <div className="rounded-card bg-cream border border-black/5 p-5">
                    <p className="text-sm font-bold text-ink mb-4">Top produits (par quantité vendue)</p>
                    <BarListChart data={topProducts} dataKey="qty" nameKey="name" />
                </div>

                <div className="rounded-card bg-cream border border-black/5 p-5">
                    <p className="text-sm font-bold text-ink mb-4">Ventes par salon</p>
                    <BarListChart data={bySalon} dataKey="revenue" nameKey="name" />
                </div>
            </div>

            <div className="mt-6 rounded-card bg-cream border border-black/5 p-5">
                <p className="text-sm font-bold text-ink mb-4">Ventes par source</p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {bySource.map((row) => (
                        <div key={row.source} className="flex items-center justify-between rounded-xl bg-white border border-black/5 px-4 py-3">
                            <div>
                                <p className="text-sm font-semibold text-ink">{SOURCE_LABELS[row.source] ?? row.source}</p>
                                <p className="text-xs text-muted">{row.orders_count} commande(s)</p>
                            </div>
                            <p className="text-sm font-bold text-forest-dark">{formatGnf(row.revenue)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

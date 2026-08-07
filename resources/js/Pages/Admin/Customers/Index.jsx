import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function Index({ customers, search }) {
    const applySearch = (value) => {
        router.get('/admin/clients', { search: value || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout active="customers" title="Clients">
            <Head title="Clients — Admin" />

            <div className="relative mb-6 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                    type="text"
                    defaultValue={search}
                    onChange={(e) => applySearch(e.target.value)}
                    placeholder="Rechercher par nom ou téléphone..."
                    className="w-full rounded-xl border border-black/10 bg-cream pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
            </div>

            <div className="rounded-card bg-cream border border-black/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                            <th className="px-5 py-3 font-semibold">Nom</th>
                            <th className="px-5 py-3 font-semibold">Téléphone</th>
                            <th className="px-5 py-3 font-semibold">Visites</th>
                            <th className="px-5 py-3 font-semibold">Total dépensé</th>
                            <th className="px-5 py-3 font-semibold">Dernière visite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.data.map((customer) => (
                            <tr key={customer.id} className="border-b border-black/5 last:border-0">
                                <td className="px-5 py-3 text-ink font-semibold">{customer.name ?? '—'}</td>
                                <td className="px-5 py-3 text-muted">{customer.phone}</td>
                                <td className="px-5 py-3 text-ink">{customer.visits_count}</td>
                                <td className="px-5 py-3 text-ink font-semibold">{formatGnf(customer.total_spent)}</td>
                                <td className="px-5 py-3 text-muted">{customer.last_visit_at ?? '—'}</td>
                            </tr>
                        ))}
                        {customers.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                    Aucun client.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

import { Head, router, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

const CATEGORIES = {
    transport: 'Transport',
    glace: 'Glace',
    eau: 'Eau',
    electricite: 'Électricité',
    nettoyage: 'Nettoyage',
    personnel: 'Personnel',
    reparation: 'Réparation',
    achat_urgent: 'Achat urgent',
    divers: 'Divers',
};

export default function Index({ expenses, totalThisMonth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category: 'divers',
        amount: '',
        spent_at: new Date().toISOString().slice(0, 10),
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/depenses', { onSuccess: () => reset('amount', 'notes') });
    };

    const destroy = (expense) => {
        if (!confirm('Supprimer cette dépense ?')) return;
        router.delete(`/admin/depenses/${expense.id}`);
    };

    return (
        <AdminLayout active="expenses" title="Dépenses">
            <Head title="Dépenses — Admin" />

            <div className="rounded-card bg-cream border border-black/5 p-5 mb-6 inline-block">
                <p className="text-xs uppercase tracking-widest text-muted">Total ce mois</p>
                <p className="text-2xl font-extrabold text-forest-dark">{formatGnf(totalThisMonth)}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-card bg-cream border border-black/5 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                                <th className="px-5 py-3 font-semibold">Date</th>
                                <th className="px-5 py-3 font-semibold">Catégorie</th>
                                <th className="px-5 py-3 font-semibold">Montant</th>
                                <th className="px-5 py-3 font-semibold">Notes</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="border-b border-black/5 last:border-0">
                                    <td className="px-5 py-3 text-muted">{expense.date}</td>
                                    <td className="px-5 py-3 text-ink">{CATEGORIES[expense.category] ?? expense.category}</td>
                                    <td className="px-5 py-3 text-ink font-semibold">{formatGnf(expense.amount)}</td>
                                    <td className="px-5 py-3 text-muted">{expense.notes}</td>
                                    <td className="px-5 py-3 text-right">
                                        <button onClick={() => destroy(expense)} className="rounded-lg p-2 text-danger hover:bg-danger/5">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                        Aucune dépense enregistrée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={submit} className="rounded-card bg-cream border border-black/5 p-5 flex flex-col gap-3 h-fit">
                    <p className="text-sm font-bold text-ink">Nouvelle dépense</p>

                    <div>
                        <label className="text-xs font-semibold text-muted">Catégorie</label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        >
                            {Object.entries(CATEGORIES).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

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
                        <label className="text-xs font-semibold text-muted">Date</label>
                        <input
                            type="date"
                            value={data.spent_at}
                            onChange={(e) => setData('spent_at', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted">Notes (facultatif)</label>
                        <input
                            type="text"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                    >
                        Ajouter
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}

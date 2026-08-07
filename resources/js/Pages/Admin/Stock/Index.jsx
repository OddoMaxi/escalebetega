import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

const UNITS = ['kg', 'g', 'litre', 'ml', 'unite', 'pack', 'bouteille'];

function StockItemRow({ item, suppliers }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        type: 'entree',
        quantity: '',
        notes: '',
    });

    const submitMovement = (e) => {
        e.preventDefault();
        post(`/admin/stock/${item.id}/mouvement`, {
            onSuccess: () => { reset('quantity', 'notes'); setOpen(false); },
        });
    };

    const destroy = () => {
        if (!confirm(`Supprimer "${item.name}" ?`)) return;
        router.delete(`/admin/stock/${item.id}`);
    };

    return (
        <>
            <tr className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3 text-ink font-semibold">
                    {item.name}
                    {item.low && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-danger">
                            <AlertTriangle className="h-3 w-3" />
                            Stock faible
                        </span>
                    )}
                </td>
                <td className="px-5 py-3 text-ink">{item.quantity_current} {item.unit}</td>
                <td className="px-5 py-3 text-muted">{item.alert_threshold} {item.unit}</td>
                <td className="px-5 py-3 text-muted">{item.supplier ?? '—'}</td>
                <td className="px-5 py-3 text-right">
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-xs font-semibold text-forest-dark hover:underline mr-3"
                    >
                        Mouvement
                    </button>
                    <button onClick={destroy} className="rounded-lg p-1.5 text-danger hover:bg-danger/5 inline-flex">
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </td>
            </tr>
            {open && (
                <tr className="bg-black/[0.02]">
                    <td colSpan={5} className="px-5 py-4">
                        <form onSubmit={submitMovement} className="flex flex-wrap items-end gap-3">
                            <div>
                                <label className="text-xs font-semibold text-muted">Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs"
                                >
                                    <option value="entree">Entrée</option>
                                    <option value="sortie_manuelle">Sortie manuelle</option>
                                    <option value="perte">Perte</option>
                                    <option value="ajustement">Ajustement</option>
                                    <option value="inventaire">Inventaire</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted">Quantité</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0.001"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="mt-1 w-24 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs"
                                />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-xs font-semibold text-muted">Notes</label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-forest-dark px-4 py-2 text-xs font-semibold text-cream disabled:opacity-50"
                            >
                                Enregistrer
                            </button>
                        </form>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function Index({ items, suppliers }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        unit: 'unite',
        quantity_current: '0',
        alert_threshold: '0',
        avg_cost: '',
        main_supplier_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/stock', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AdminLayout active="stock" title="Stock">
            <Head title="Stock — Admin" />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="inline-flex items-center gap-2 rounded-xl bg-forest-dark px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nouvel article
                </button>
            </div>

            {showCreate && (
                <form onSubmit={submit} className="rounded-card bg-cream border border-black/5 p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                    <div>
                        <label className="text-xs font-semibold text-muted">Nom</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                        />
                        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-muted">Unité</label>
                        <select
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                        >
                            {UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-muted">Quantité initiale</label>
                        <input
                            type="number"
                            step="0.001"
                            value={data.quantity_current}
                            onChange={(e) => setData('quantity_current', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-muted">Seuil d&rsquo;alerte</label>
                        <input
                            type="number"
                            step="0.001"
                            value={data.alert_threshold}
                            onChange={(e) => setData('alert_threshold', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-forest-dark px-4 py-2.5 text-sm font-semibold text-cream disabled:opacity-50"
                    >
                        Créer
                    </button>
                </form>
            )}

            <div className="rounded-card bg-cream border border-black/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                            <th className="px-5 py-3 font-semibold">Article</th>
                            <th className="px-5 py-3 font-semibold">Quantité</th>
                            <th className="px-5 py-3 font-semibold">Seuil alerte</th>
                            <th className="px-5 py-3 font-semibold">Fournisseur</th>
                            <th className="px-5 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <StockItemRow key={item.id} item={item} suppliers={suppliers} />
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                    Aucun article de stock.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

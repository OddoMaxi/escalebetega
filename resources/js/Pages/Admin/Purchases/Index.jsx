import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

function NewSupplierForm() {
    const [name, setName] = useState('');

    const submit = () => {
        if (!name.trim()) return;
        router.post('/admin/fournisseurs', { name }, { onSuccess: () => setName('') });
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        submit();
                    }
                }}
                placeholder="Nom du fournisseur"
                className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs"
            />
            <button type="button" onClick={submit} className="rounded-lg bg-forest-dark px-3 py-2 text-xs font-semibold text-cream">
                Ajouter
            </button>
        </div>
    );
}

export default function Index({ purchases, suppliers, stockItems }) {
    const [rows, setRows] = useState([{ stock_item_id: stockItems[0]?.id ?? '', quantity: '', unit_cost: '' }]);

    const { data, setData, post, transform, processing, errors, reset } = useForm({
        supplier_id: suppliers[0]?.id ?? '',
        purchased_at: new Date().toISOString().slice(0, 10),
        notes: '',
    });

    useEffect(() => {
        if (!data.supplier_id && suppliers.length > 0) {
            setData('supplier_id', suppliers[0].id);
        }
    }, [suppliers]);

    const addRow = () => setRows([...rows, { stock_item_id: stockItems[0]?.id ?? '', quantity: '', unit_cost: '' }]);
    const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));
    const updateRow = (index, field, value) => {
        setRows(rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    };

    const total = rows.reduce((sum, row) => sum + (Number(row.quantity) || 0) * (Number(row.unit_cost) || 0), 0);

    const submit = (e) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            items: rows.filter((r) => r.stock_item_id && r.quantity && r.unit_cost),
        }));
        post('/admin/achats', {
            onSuccess: () => {
                reset('notes');
                setRows([{ stock_item_id: stockItems[0]?.id ?? '', quantity: '', unit_cost: '' }]);
            },
        });
    };

    return (
        <AdminLayout active="purchases" title="Achats">
            <Head title="Achats — Admin" />

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-card bg-cream border border-black/5 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                                <th className="px-5 py-3 font-semibold">Date</th>
                                <th className="px-5 py-3 font-semibold">Fournisseur</th>
                                <th className="px-5 py-3 font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase) => (
                                <tr key={purchase.id} className="border-b border-black/5 last:border-0">
                                    <td className="px-5 py-3 text-muted">{purchase.date}</td>
                                    <td className="px-5 py-3 text-ink">{purchase.supplier}</td>
                                    <td className="px-5 py-3 text-ink font-semibold">{formatGnf(purchase.total)}</td>
                                </tr>
                            ))}
                            {purchases.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-10 text-center text-muted">
                                        Aucun achat enregistré.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={submit} className="rounded-card bg-cream border border-black/5 p-5 flex flex-col gap-3 h-fit">
                    <p className="text-sm font-bold text-ink">Nouvel achat</p>

                    {suppliers.length === 0 ? (
                        <div>
                            <label className="text-xs font-semibold text-muted">Ajouter un fournisseur</label>
                            <div className="mt-1">
                                <NewSupplierForm />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs font-semibold text-muted">Fournisseur</label>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', Number(e.target.value))}
                                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                            >
                                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplier_id && <p className="mt-1 text-xs text-danger">{errors.supplier_id}</p>}
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-muted">Date</label>
                        <input
                            type="date"
                            value={data.purchased_at}
                            onChange={(e) => setData('purchased_at', e.target.value)}
                            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-muted">Articles</label>
                        {rows.map((row, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <select
                                    value={row.stock_item_id}
                                    onChange={(e) => updateRow(index, 'stock_item_id', Number(e.target.value))}
                                    className="flex-1 rounded-lg border border-black/10 bg-white px-2 py-2 text-xs"
                                >
                                    {stockItems.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    step="0.001"
                                    placeholder="Qté"
                                    value={row.quantity}
                                    onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                                    className="w-16 rounded-lg border border-black/10 bg-white px-2 py-2 text-xs"
                                />
                                <input
                                    type="number"
                                    placeholder="P.U."
                                    value={row.unit_cost}
                                    onChange={(e) => updateRow(index, 'unit_cost', e.target.value)}
                                    className="w-20 rounded-lg border border-black/10 bg-white px-2 py-2 text-xs"
                                />
                                <button type="button" onClick={() => removeRow(index)} className="text-danger">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addRow}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-forest-dark"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Ajouter un article
                        </button>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-forest-dark pt-2 border-t border-black/5">
                        <span>Total</span>
                        <span>{formatGnf(total)}</span>
                    </div>

                    {errors.items && <p className="text-xs text-danger">{errors.items}</p>}

                    <button
                        type="submit"
                        disabled={processing || stockItems.length === 0 || suppliers.length === 0}
                        className="mt-2 rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                    >
                        Enregistrer l&rsquo;achat
                    </button>
                    {stockItems.length === 0 && (
                        <p className="text-xs text-muted">Créez d&rsquo;abord des articles de stock.</p>
                    )}
                </form>
            </div>
        </AdminLayout>
    );
}

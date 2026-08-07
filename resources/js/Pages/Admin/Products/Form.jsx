import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function RecipeEditor({ product, stockItems }) {
    const [rows, setRows] = useState(
        product.recipe.length > 0
            ? product.recipe
            : [{ stock_item_id: stockItems[0]?.id ?? '', quantity: '', unit: stockItems[0]?.unit ?? 'unite' }],
    );
    const [saving, setSaving] = useState(false);

    const addRow = () => setRows([...rows, { stock_item_id: stockItems[0]?.id ?? '', quantity: '', unit: stockItems[0]?.unit ?? 'unite' }]);
    const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));
    const updateRow = (index, field, value) => setRows(rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));

    const save = () => {
        setSaving(true);
        router.put(
            `/admin/produits/${product.id}/recette`,
            { items: rows.filter((r) => r.stock_item_id && r.quantity) },
            { preserveScroll: true, onFinish: () => setSaving(false) },
        );
    };

    if (stockItems.length === 0) {
        return <p className="text-sm text-muted">Créez d&rsquo;abord des articles de stock pour définir une recette.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
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
                        className="w-20 rounded-lg border border-black/10 bg-white px-2 py-2 text-xs"
                    />
                    <input
                        type="text"
                        placeholder="unité"
                        value={row.unit}
                        onChange={(e) => updateRow(index, 'unit', e.target.value)}
                        className="w-20 rounded-lg border border-black/10 bg-white px-2 py-2 text-xs"
                    />
                    <button type="button" onClick={() => removeRow(index)} className="text-danger">
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            <div className="flex items-center gap-3 mt-1">
                <button type="button" onClick={addRow} className="inline-flex items-center gap-1 text-xs font-semibold text-forest-dark">
                    <Plus className="h-3.5 w-3.5" />
                    Ajouter un ingrédient
                </button>
                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="rounded-lg bg-forest-dark px-3 py-1.5 text-xs font-semibold text-cream disabled:opacity-50"
                >
                    Enregistrer la recette
                </button>
            </div>
        </div>
    );
}

export default function Form({ categories, product, stockItems = [] }) {
    const isEdit = !!product;

    const { data, setData, post, put, processing, errors } = useForm({
        category_id: product?.category_id ?? categories[0]?.id ?? '',
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        photo: product?.photo ?? '',
        available: product?.available ?? true,
        visible_menu: product?.visible_menu ?? true,
        stock_tracked: product?.stock_tracked ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/produits/${product.id}`);
        } else {
            post('/admin/produits');
        }
    };

    return (
        <AdminLayout active="products" title={isEdit ? 'Modifier le produit' : 'Nouveau produit'}>
            <Head title={isEdit ? 'Modifier le produit' : 'Nouveau produit'} />

            <form onSubmit={submit} className="max-w-xl rounded-card bg-cream border border-black/5 p-6 flex flex-col gap-5">
                <div>
                    <label className="text-xs font-semibold text-muted">Catégorie</label>
                    <select
                        value={data.category_id}
                        onChange={(e) => setData('category_id', Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-xs text-danger">{errors.category_id}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Nom</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ex : Jus d'Ananas"
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={2}
                        placeholder="Ex : Ananas frais pressé"
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Prix (GNF)</label>
                    <input
                        type="number"
                        min="0"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="25000"
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    {errors.price && <p className="mt-1 text-xs text-danger">{errors.price}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Photo (URL, facultatif)</label>
                    <input
                        type="text"
                        value={data.photo}
                        onChange={(e) => setData('photo', e.target.value)}
                        placeholder="https://..."
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-ink">
                        <input
                            type="checkbox"
                            checked={data.available}
                            onChange={(e) => setData('available', e.target.checked)}
                            className="rounded border-black/20 text-forest focus:ring-forest/30"
                        />
                        Disponible
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-ink">
                        <input
                            type="checkbox"
                            checked={data.visible_menu}
                            onChange={(e) => setData('visible_menu', e.target.checked)}
                            className="rounded border-black/20 text-forest focus:ring-forest/30"
                        />
                        Visible sur le menu
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-ink">
                        <input
                            type="checkbox"
                            checked={data.stock_tracked}
                            onChange={(e) => setData('stock_tracked', e.target.checked)}
                            className="rounded border-black/20 text-forest focus:ring-forest/30"
                        />
                        Suivi de stock
                    </label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                    >
                        {isEdit ? 'Enregistrer' : 'Créer le produit'}
                    </button>
                </div>
            </form>

            {isEdit && data.stock_tracked && (
                <div className="max-w-xl rounded-card bg-cream border border-black/5 p-6 mt-6">
                    <p className="text-sm font-bold text-ink mb-1">Recette</p>
                    <p className="text-xs text-muted mb-4">
                        Ingrédients décomptés du stock à chaque vente de ce produit.
                    </p>
                    <RecipeEditor product={product} stockItems={stockItems} />
                </div>
            )}
        </AdminLayout>
    );
}

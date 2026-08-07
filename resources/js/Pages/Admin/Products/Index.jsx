import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function Index({ products, categories }) {
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filtered = categoryFilter === 'all'
        ? products
        : products.filter((p) => p.category === categoryFilter);

    const destroy = (product) => {
        if (!confirm(`Supprimer "${product.name}" ?`)) return;
        router.delete(`/admin/produits/${product.id}`);
    };

    return (
        <AdminLayout active="products" title="Produits & Menu">
            <Head title="Produits — Admin" />

            <div className="flex items-center justify-between mb-6">
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-black/10 bg-cream px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <Link
                    href="/admin/produits/nouveau"
                    className="inline-flex items-center gap-2 rounded-xl bg-forest-dark px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau produit
                </Link>
            </div>

            <div className="rounded-card bg-cream border border-black/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                            <th className="px-5 py-3 font-semibold">Produit</th>
                            <th className="px-5 py-3 font-semibold">Catégorie</th>
                            <th className="px-5 py-3 font-semibold">Prix</th>
                            <th className="px-5 py-3 font-semibold">Statut</th>
                            <th className="px-5 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((product) => (
                            <tr key={product.id} className="border-b border-black/5 last:border-0">
                                <td className="px-5 py-3 font-semibold text-ink">{product.name}</td>
                                <td className="px-5 py-3 text-muted">{product.category}</td>
                                <td className="px-5 py-3 text-ink">{formatGnf(product.price)}</td>
                                <td className="px-5 py-3">
                                    {product.available && product.visible_menu ? (
                                        <span className="text-xs font-semibold rounded-full bg-success/10 text-success px-2.5 py-1">
                                            Visible
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-black/5 text-muted px-2.5 py-1">
                                            <EyeOff className="h-3 w-3" />
                                            Masqué
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/produits/${product.id}/modifier`}
                                            className="rounded-lg p-2 text-forest-dark hover:bg-forest-dark/5"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => destroy(product)}
                                            className="rounded-lg p-2 text-danger hover:bg-danger/5"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                    Aucun produit.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

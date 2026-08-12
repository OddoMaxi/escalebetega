import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ClientTopBar from '@/Components/Client/ClientTopBar';
import BottomNav from '@/Components/Client/BottomNav';
import CartFloatingBar from '@/Components/Client/CartFloatingBar';
import useCart from '@/Hooks/useCart';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function Menu({ salon, categories }) {
    const cart = useCart(salon.token);
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? null);
    const [search, setSearch] = useState('');

    const filteredCategories = useMemo(() => {
        if (!search.trim()) {
            return categories;
        }

        const term = search.trim().toLowerCase();

        return categories
            .map((category) => ({
                ...category,
                products: category.products.filter((product) =>
                    product.name.toLowerCase().includes(term),
                ),
            }))
            .filter((category) => category.products.length > 0);
    }, [categories, search]);

    const visibleCategories = search.trim() ? filteredCategories : categories;
    const currentCategory = search.trim()
        ? null
        : visibleCategories.find((category) => category.id === activeCategory) ?? visibleCategories[0];

    const productsToShow = search.trim()
        ? visibleCategories.flatMap((category) => category.products)
        : currentCategory?.products ?? [];

    return (
        <>
            <Head title={`Menu — ${salon.name}`} />

            <div className="min-h-screen bg-base pb-36">
                <ClientTopBar token={salon.token} salonName={salon.name} title="Notre Menu" />

                <div className="mx-auto max-w-md px-4 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="w-full rounded-xl border border-black/10 bg-cream pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                        />
                    </div>

                    {!search.trim() && (
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                                        currentCategory?.id === category.id
                                            ? 'bg-forest-dark text-cream'
                                            : 'bg-cream border border-black/10 text-ink'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3">
                        {productsToShow.length === 0 && (
                            <p className="text-center text-sm text-muted py-10">Aucun produit trouvé.</p>
                        )}

                        {productsToShow.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 rounded-2xl bg-cream border border-black/5 p-3"
                            >
                                {product.photo ? (
                                    <img
                                        src={product.photo}
                                        alt={product.name}
                                        loading="lazy"
                                        className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-sun to-forest-dark" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-ink truncate">{product.name}</p>
                                    {product.description && (
                                        <p className="text-xs text-muted truncate">{product.description}</p>
                                    )}
                                    <p className="mt-1 text-sm font-bold text-forest-dark">
                                        {formatGnf(product.price)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => cart.addItem(product, 1)}
                                    aria-label={`Ajouter ${product.name}`}
                                    className="flex-shrink-0 h-9 w-9 rounded-full bg-forest-dark text-cream flex items-center justify-center hover:bg-forest transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <CartFloatingBar token={salon.token} count={cart.count} subtotal={cart.subtotal} />
                <BottomNav token={salon.token} active="menu" cartCount={cart.count} />
            </div>
        </>
    );
}

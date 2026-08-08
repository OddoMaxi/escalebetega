import { Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function CartFloatingBar({ token, count, subtotal }) {
    if (!count) return null;

    return (
        <div className="fixed inset-x-0 bottom-[68px] z-40 px-4">
            <Link
                href={`/q/${token}/panier`}
                className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-forest-dark px-5 py-3.5 text-cream shadow-lg hover:bg-forest transition-colors"
            >
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <span className="relative">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sun px-1 text-[10px] font-bold text-white">
                            {count}
                        </span>
                    </span>
                    Voir mon panier
                </span>
                <span className="text-sm font-bold">{formatGnf(subtotal)}</span>
            </Link>
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { Home, ShoppingBag, User, UtensilsCrossed } from 'lucide-react';

export default function BottomNav({ token, active, cartCount = 0 }) {
    const items = [
        { key: 'accueil', label: 'Accueil', icon: Home, href: `/q/${token}` },
        { key: 'menu', label: 'Menu', icon: UtensilsCrossed, href: `/q/${token}/menu` },
        { key: 'panier', label: 'Panier', icon: ShoppingBag, href: `/q/${token}/panier`, badge: cartCount },
        { key: 'moi', label: 'Moi', icon: User, href: `/q/${token}/moi` },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-black/5 pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto max-w-md grid grid-cols-4">
                {items.map((item) => {
                    const isActive = active === item.key;
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`relative flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                                isActive ? 'text-forest-dark' : 'text-muted'
                            }`}
                        >
                            <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
                            {item.label}
                            {!!item.badge && (
                                <span className="absolute top-1.5 right-[calc(50%-20px)] flex h-4 min-w-4 items-center justify-center rounded-full bg-sun px-1 text-[10px] font-bold text-white">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

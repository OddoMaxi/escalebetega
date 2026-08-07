import { Link } from '@inertiajs/react';
import { Home, ListOrdered, MoreHorizontal, Plus, Store } from 'lucide-react';

export default function ServeurNav({ active }) {
    const items = [
        { key: 'home', label: 'Accueil', icon: Home, href: '/serveur' },
        { key: 'orders', label: 'Commandes', icon: ListOrdered, href: '/serveur/commandes' },
        { key: 'new', icon: Plus, href: '/serveur/commandes/nouvelle', central: true },
        { key: 'salons', label: 'Salons', icon: Store, href: '/serveur/salons' },
        { key: 'more', label: 'Plus', icon: MoreHorizontal, href: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-black/5 pb-[env(safe-area-inset-bottom)]">
            <div className="mx-auto max-w-md grid grid-cols-5 items-end">
                {items.map((item) =>
                    item.central ? (
                        <Link
                            key={item.key}
                            href={item.href}
                            className="flex flex-col items-center -mt-6"
                        >
                            <span className="h-14 w-14 rounded-full bg-forest-dark text-cream flex items-center justify-center shadow-lg">
                                <item.icon className="h-6 w-6" />
                            </span>
                        </Link>
                    ) : (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                                active === item.key ? 'text-forest-dark' : 'text-muted'
                            }`}
                        >
                            <item.icon className="h-5 w-5" strokeWidth={active === item.key ? 2.25 : 1.75} />
                            {item.label}
                        </Link>
                    ),
                )}
            </div>
        </nav>
    );
}

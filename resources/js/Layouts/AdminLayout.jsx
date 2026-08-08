import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    BarChart3,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Package,
    Receipt,
    Settings,
    ShoppingCart,
    Store,
    UserCog,
    Users,
    UtensilsCrossed,
    Wallet,
    CheckCircle2,
} from 'lucide-react';
import Logo from '@/Components/Site/Logo';

const NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin', available: true },
    { key: 'orders', label: 'Commandes', icon: ClipboardList, href: '/admin/commandes', available: true },
    { key: 'salons', label: 'Salons / Tables', icon: Store, href: '/admin/salons', available: true },
    { key: 'products', label: 'Produits & Menu', icon: UtensilsCrossed, href: '/admin/produits', available: true },
    { key: 'stock', label: 'Stock', icon: Package, href: '/admin/stock', available: true },
    { key: 'purchases', label: 'Achats', icon: ShoppingCart, href: '/admin/achats', available: true },
    { key: 'customers', label: 'Clients', icon: Users, href: '/admin/clients', available: true },
    { key: 'cash', label: 'Caisse & Finances', icon: Wallet, href: '/admin/caisse', available: true },
    { key: 'expenses', label: 'Dépenses', icon: Receipt, href: '/admin/depenses', available: true },
    { key: 'reports', label: 'Rapports', icon: BarChart3, href: '/admin/rapports', available: true },
    { key: 'users', label: 'Utilisateurs', icon: UserCog, href: '/admin/utilisateurs', available: true },
    { key: 'settings', label: 'Paramètres', icon: Settings, href: '/admin/parametres', available: true },
];

export default function AdminLayout({ active, title, children }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const success = props.flash?.success;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (success) {
            setToast(success);
            const timeout = setTimeout(() => setToast(null), 3500);
            return () => clearTimeout(timeout);
        }
    }, [success]);

    return (
        <div className="min-h-screen bg-base flex">
            <aside className="w-64 flex-shrink-0 bg-forest-dark text-cream flex flex-col hidden lg:flex">
                <div className="px-6 py-6">
                    <Logo variant="light" size="sm" showTagline={false} />
                </div>

                <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
                    {NAV.map((item) =>
                        item.available ? (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                    active === item.key
                                        ? 'bg-cream/10 text-cream'
                                        : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                                }`}
                            >
                                <item.icon className="h-4 w-4" strokeWidth={1.75} />
                                {item.label}
                            </Link>
                        ) : (
                            <div
                                key={item.key}
                                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cream/30 cursor-not-allowed"
                            >
                                <span className="flex items-center gap-3">
                                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                                    {item.label}
                                </span>
                                <span className="text-[9px] uppercase tracking-wide bg-cream/10 rounded-full px-1.5 py-0.5">
                                    Bientôt
                                </span>
                            </div>
                        ),
                    )}
                </nav>

                <div className="px-3 pb-6 pt-3 border-t border-cream/10">
                    <div className="px-3 py-2">
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-xs text-cream/50">{user?.role}</p>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cream/70 hover:bg-cream/5 hover:text-cream"
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.75} />
                        Déconnexion
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-cream border-b border-black/5 px-6 lg:px-10 py-5">
                    <h1 className="text-xl font-extrabold text-forest-dark">{title}</h1>
                </header>

                <main className="flex-1 px-6 lg:px-10 py-8">{children}</main>
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-forest-dark text-cream px-5 py-3 shadow-lg text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-sun" />
                    {toast}
                </div>
            )}
        </div>
    );
}

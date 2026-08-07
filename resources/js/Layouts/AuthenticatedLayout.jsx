import Logo from '@/Components/Site/Logo';
import { Link, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-base">
            <header className="border-b border-black/5 bg-cream">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
                    <Link href="/dashboard">
                        <Logo size="sm" showTagline={false} />
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-ink">{user.name}</span>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest-dark"
                        >
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </Link>
                    </div>
                </div>
            </header>

            {header && (
                <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">{header}</div>
            )}

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
        </div>
    );
}

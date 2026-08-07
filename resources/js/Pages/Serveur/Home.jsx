import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Plus, Store } from 'lucide-react';
import ServeurNav from '@/Components/Serveur/ServeurNav';
import Logo from '@/Components/Site/Logo';

export default function Home({ stats }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const success = props.flash?.success;

    return (
        <>
            <Head title="Espace Serveur" />

            <div className="min-h-screen bg-base pb-24">
                <header className="px-6 pt-8">
                    <Logo size="sm" showTagline={false} />
                    <h1 className="mt-6 text-2xl font-extrabold text-forest-dark">
                        Bonjour, {user?.name?.split(' ')[0] ?? 'Serveur'} !
                    </h1>
                    <p className="text-sm text-muted">Voici votre activité aujourd&rsquo;hui.</p>
                </header>

                {success && (
                    <div className="mx-6 mt-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-semibold px-4 py-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {success}
                    </div>
                )}

                <div className="mx-6 mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-cream border border-black/5 p-4">
                        <p className="text-xs uppercase tracking-widest text-muted">Commandes</p>
                        <p className="mt-1 text-2xl font-extrabold text-forest-dark">{stats.ordersToday}</p>
                        <p className="text-xs text-muted">aujourd&rsquo;hui</p>
                    </div>
                    <div className="rounded-2xl bg-cream border border-black/5 p-4">
                        <p className="text-xs uppercase tracking-widest text-muted">Salons</p>
                        <p className="mt-1 text-2xl font-extrabold text-forest-dark">
                            {stats.salonsOccupied}/{stats.salonsTotal}
                        </p>
                        <p className="text-xs text-muted">occupés</p>
                    </div>
                </div>

                <div className="mx-6 mt-8 flex flex-col gap-3">
                    <Link
                        href="/serveur/commandes/nouvelle"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-dark px-6 py-4 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Nouvelle commande
                    </Link>
                    <Link
                        href="/serveur/salons"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-forest-dark/30 px-6 py-4 text-sm font-semibold text-forest-dark hover:bg-forest-dark/5 transition-colors"
                    >
                        <Store className="h-4 w-4" />
                        Voir les salons
                    </Link>
                </div>

                <ServeurNav active="home" />
            </div>
        </>
    );
}

import { Head, Link, usePage } from '@inertiajs/react';
import { Phone, ShoppingBag, UtensilsCrossed, Waves } from 'lucide-react';
import Logo from '@/Components/Site/Logo';
import PhotoPlaceholder from '@/Components/Site/PhotoPlaceholder';

export default function Home({ salon }) {
    const { settings } = usePage().props;

    return (
        <>
            <Head title={`Bienvenue au ${salon.name}`} />

            <div className="min-h-screen bg-base flex flex-col">
                <div className="flex-1 flex flex-col px-6 pt-10 pb-8 mx-auto w-full max-w-md">
                    <Logo size="sm" />

                    <div className="mt-10 text-center">
                        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-wood">
                            Bienvenue au
                        </p>
                        <h1 className="mt-1 text-4xl font-extrabold text-forest-dark">{salon.name}</h1>
                        <p className="mt-3 text-muted">Savourez la nature, vivez l&rsquo;escale.</p>
                    </div>

                    <PhotoPlaceholder
                        icon={Waves}
                        gradient="sunset"
                        className="mt-8 aspect-[4/3] rounded-card shadow-lg"
                    />

                    <div className="mt-8 flex flex-col gap-3">
                        <Link
                            href={`/q/${salon.token}/menu`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-dark px-6 py-4 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Passer commande
                        </Link>
                        <Link
                            href={`/q/${salon.token}/menu`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-forest-dark/30 px-6 py-4 text-sm font-semibold text-forest-dark hover:bg-forest-dark/5 transition-colors"
                        >
                            <UtensilsCrossed className="h-4 w-4" />
                            Voir le menu
                        </Link>
                    </div>

                    <div className="mt-auto pt-10 text-center">
                        <p className="text-xs text-muted mb-2">Besoin d&rsquo;aide ?</p>
                        <a
                            href={`tel:${(settings.phone ?? '').replace(/\s/g, '')}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-dark"
                        >
                            <Phone className="h-4 w-4" />
                            Appeler un serveur
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

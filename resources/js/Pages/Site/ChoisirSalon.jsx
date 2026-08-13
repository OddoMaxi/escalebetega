import { Head, Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import Header from '@/Components/Site/Header';
import Footer from '@/Components/Site/Footer';

export default function ChoisirSalon({ salons }) {
    return (
        <>
            <Head title="Choisir mon salon — Escale BETEGA" />

            <div className="bg-base font-sans text-ink min-h-screen flex flex-col">
                <Header />

                <main className="flex-1">
                    <section className="mx-auto max-w-3xl px-6 lg:px-8 py-14 lg:py-20 text-center">
                        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-forest">
                            Commander sur place
                        </span>
                        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-forest-dark leading-tight">
                            Vous êtes installé·e à l&rsquo;Escale ? Touchez votre salon pour ouvrir le menu.
                        </h1>
                        <p className="mt-3 text-sm text-muted max-w-md mx-auto">
                            Pas besoin de scanner &mdash; choisissez simplement la table où vous êtes assis·e.
                        </p>

                        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {salons.map((salon) => (
                                <Link
                                    key={salon.token}
                                    href={`/q/${salon.token}/menu`}
                                    className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-cream border border-black/5 py-6 px-4 hover:border-forest-dark/30 hover:bg-forest-dark/5 transition-colors"
                                >
                                    <MapPin className="h-5 w-5 text-forest-dark" strokeWidth={1.75} />
                                    <span className="font-bold text-sm text-forest-dark">{salon.name}</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted group-hover:text-forest-dark">
                                        Commander
                                        <ArrowRight className="h-3 w-3" />
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {salons.length === 0 && (
                            <p className="mt-10 text-sm text-muted">
                                Aucun salon n&rsquo;est disponible pour le moment. Merci de demander à un serveur.
                            </p>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}

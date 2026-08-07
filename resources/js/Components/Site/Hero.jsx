import { MapPin, Menu as MenuIcon, Waves } from 'lucide-react';
import BrandMark from './BrandMark';
import PhotoPlaceholder from './PhotoPlaceholder';

export default function Hero() {
    return (
        <section id="accueil" className="relative bg-base">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-6">
                            <span className="h-px w-8 bg-sun" />
                            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-wood">
                                Takonko Beach
                            </span>
                            <span className="h-px w-8 bg-sun" />
                        </div>

                        <div className="flex items-center gap-4 mb-2">
                            <BrandMark className="h-14 w-14 hidden sm:block" />
                            <div>
                                <div className="font-script text-5xl sm:text-6xl text-forest leading-none">
                                    Escale
                                </div>
                                <h1 className="font-sans font-extrabold text-5xl sm:text-6xl text-forest-dark tracking-tight leading-none">
                                    BETEGA
                                </h1>
                            </div>
                        </div>

                        <p className="mt-6 text-lg sm:text-xl font-semibold text-ink uppercase tracking-wide">
                            Savourez la nature,
                            <br />
                            vivez l&rsquo;escale.
                        </p>

                        <p className="mt-4 max-w-md text-muted leading-relaxed">
                            Un cadre unique en bord de mer à Takonko. Jus frais, cocktails,
                            cuisine locale et ambiance détente toute la journée.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#experience"
                                className="inline-flex items-center gap-2 rounded-xl bg-forest-dark px-6 py-3.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                            >
                                <MenuIcon className="h-4 w-4" />
                                Voir le menu
                            </a>
                            <a
                                href="#infos"
                                className="inline-flex items-center gap-2 rounded-xl border border-forest-dark/30 px-6 py-3.5 text-sm font-semibold text-forest-dark hover:bg-forest-dark/5 transition-colors"
                            >
                                <MapPin className="h-4 w-4" />
                                Nous trouver
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <PhotoPlaceholder
                            gradient="sunset"
                            icon={Waves}
                            iconClassName="h-12 w-12"
                            className="aspect-[4/5] sm:aspect-[5/4] rounded-card shadow-xl"
                        />
                        <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-cream shadow-lg px-6 py-4 border border-black/5">
                            <p className="text-xs uppercase tracking-widest text-muted font-semibold">
                                10 salons
                            </p>
                            <p className="text-lg font-bold text-forest-dark">Face à la plage</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Armchair, Leaf, Sun } from 'lucide-react';
import PhotoPlaceholder from './PhotoPlaceholder';

const ITEMS = [
    {
        icon: Leaf,
        gradient: 'sand',
        title: 'Jus naturels & cocktails',
        description: 'Des recettes fraîches et naturelles préparées chaque jour.',
    },
    {
        icon: Armchair,
        gradient: 'sunset',
        title: '10 salons face à la plage',
        description: "Profitez d'un espace confortable avec vue imprenable sur la mer.",
    },
    {
        icon: Sun,
        gradient: 'night',
        title: 'Ambiance journée & soirée',
        description: 'Détente le jour, atmosphère chaleureuse et musicale le soir.',
    },
];

export default function Experience() {
    return (
        <section id="experience" className="bg-base py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-wood">
                        L&rsquo;expérience
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
                        Escale Betega
                    </h2>
                    <span className="mt-4 inline-block h-1 w-16 rounded-full bg-sun" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ITEMS.map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-card overflow-hidden bg-cream shadow-sm hover:shadow-md transition-shadow border border-black/5"
                        >
                            <PhotoPlaceholder
                                icon={item.icon}
                                gradient={item.gradient}
                                className="aspect-[4/3]"
                            />
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-forest-dark uppercase tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

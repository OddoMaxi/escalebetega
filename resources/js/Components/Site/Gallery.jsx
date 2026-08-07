import { Image, Palmtree, GlassWater, Sunset, Store, Citrus, Lamp } from 'lucide-react';
import PhotoPlaceholder from './PhotoPlaceholder';

const PHOTOS = [
    { icon: Palmtree, gradient: 'sand' },
    { icon: GlassWater, gradient: 'sunset' },
    { icon: Sunset, gradient: 'night' },
    { icon: Store, gradient: 'forest' },
    { icon: Citrus, gradient: 'sand' },
    { icon: Lamp, gradient: 'night' },
];

export default function Gallery() {
    return (
        <section id="galerie" className="bg-base pb-20 lg:pb-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight uppercase">
                        Un aperçu de notre univers
                    </h2>
                    <span className="mt-4 inline-block h-1 w-16 rounded-full bg-sun" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {PHOTOS.map((photo, index) => (
                        <PhotoPlaceholder
                            key={index}
                            icon={photo.icon}
                            gradient={photo.gradient}
                            iconClassName="h-6 w-6"
                            className="aspect-square rounded-2xl"
                        />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a
                        href="#galerie"
                        className="inline-flex items-center gap-2 rounded-xl border border-forest-dark/30 px-6 py-3.5 text-sm font-semibold text-forest-dark hover:bg-forest-dark/5 transition-colors"
                    >
                        <Image className="h-4 w-4" />
                        Découvrir la galerie
                    </a>
                </div>
            </div>
        </section>
    );
}

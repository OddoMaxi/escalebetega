import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function ClientTopBar({ token, salonName, title, back }) {
    return (
        <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-black/5">
            <div className="mx-auto max-w-md flex items-center gap-3 px-4 h-16">
                {back && (
                    <Link href={back} className="text-forest-dark">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                )}
                <div className="flex-1">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-wood">
                        {salonName}
                    </p>
                    <h1 className="text-base font-bold text-forest-dark leading-tight">{title}</h1>
                </div>
            </div>
        </header>
    );
}

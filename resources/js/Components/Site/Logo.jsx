import BrandMark from './BrandMark';

export default function Logo({ variant = 'dark', size = 'md', showTagline = true }) {
    const isLight = variant === 'light';

    const sizes = {
        sm: { mark: 'h-8 w-8', script: 'text-lg', bold: 'text-xl' },
        md: { mark: 'h-10 w-10', script: 'text-xl', bold: 'text-2xl' },
        lg: { mark: 'h-16 w-16', script: 'text-3xl', bold: 'text-4xl' },
    };

    const s = sizes[size];

    return (
        <div className="inline-flex flex-col">
            {showTagline && (
                <span
                    className={`text-[11px] font-semibold tracking-[0.2em] uppercase mb-0.5 ${
                        isLight ? 'text-sun' : 'text-sun'
                    }`}
                >
                    Takonko Beach
                </span>
            )}
            <div className="inline-flex items-center gap-2">
                <BrandMark className={s.mark} />
                <div className="leading-none">
                    <div className={`font-script ${s.script} leading-none ${isLight ? 'text-cream' : 'text-forest'}`}>
                        Escale
                    </div>
                    <div
                        className={`font-sans font-extrabold tracking-tight ${s.bold} leading-none ${
                            isLight ? 'text-cream' : 'text-forest-dark'
                        }`}
                    >
                        BETEGA
                    </div>
                </div>
            </div>
        </div>
    );
}

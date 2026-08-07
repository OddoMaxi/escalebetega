import { useState } from 'react';
import { QrCode, Menu, X } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Notre concept', href: '#experience' },
    { label: 'Menu', href: '#experience' },
    { label: 'Nos espaces', href: '#galerie' },
    { label: 'Galerie', href: '#galerie' },
    { label: 'Contact', href: '#infos' },
];

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-black/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#accueil">
                        <Logo size="sm" />
                    </a>

                    <nav className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-ink hover:text-forest transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="#qr-cta"
                        className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-forest-dark px-5 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                    >
                        Commander par QR code
                        <QrCode className="h-4 w-4" strokeWidth={2} />
                    </a>

                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden text-forest-dark"
                        aria-label="Ouvrir le menu"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {open && (
                    <nav className="lg:hidden pb-6 flex flex-col gap-4">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-ink hover:text-forest"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#qr-cta"
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-dark px-5 py-3 text-sm font-semibold text-cream"
                        >
                            Commander par QR code
                            <QrCode className="h-4 w-4" />
                        </a>
                    </nav>
                )}
            </div>
        </header>
    );
}

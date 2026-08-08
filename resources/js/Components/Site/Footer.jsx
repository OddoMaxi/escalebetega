import { usePage } from '@inertiajs/react';
import { Camera, MessageCircle, Users } from 'lucide-react';
import Logo from './Logo';

const LINKS = ['Notre concept', 'Menu', 'Nos espaces', 'Galerie', 'Contact'];

export default function Footer() {
    const { settings } = usePage().props;

    return (
        <footer className="bg-forest-dark text-cream">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <Logo variant="light" size="sm" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sun mb-4">
                            Escale Betega
                        </p>
                        <ul className="space-y-2">
                            {LINKS.map((link) => (
                                <li key={link}>
                                    <a href="#experience" className="text-sm text-cream/70 hover:text-cream">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sun mb-4">
                            Informations
                        </p>
                        <ul className="space-y-2 text-sm text-cream/70">
                            {settings.address && <li>{settings.address}</li>}
                            {settings.phone && <li>{settings.phone}</li>}
                            {settings.email && <li>{settings.email}</li>}
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sun mb-4">
                            Suivez-nous
                        </p>
                        <p className="text-sm text-cream/70 mb-4">
                            Restez connectés pour découvrir nos nouveautés et nos événements.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href={settings.facebook_url || '#'}
                                aria-label="Facebook"
                                className="rounded-lg bg-cream/10 p-2 hover:bg-cream/20"
                            >
                                <Users className="h-4 w-4" />
                            </a>
                            <a
                                href={settings.instagram_url || '#'}
                                aria-label="Instagram"
                                className="rounded-lg bg-cream/10 p-2 hover:bg-cream/20"
                            >
                                <Camera className="h-4 w-4" />
                            </a>
                            {settings.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                                    aria-label="WhatsApp"
                                    className="rounded-lg bg-cream/10 p-2 hover:bg-cream/20"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream/50">
                    <p>&copy; {new Date().getFullYear()} {settings.business_name} — Tous droits réservés.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-cream/80">
                            Mentions légales
                        </a>
                        <a href="#" className="hover:text-cream/80">
                            Politique de confidentialité
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

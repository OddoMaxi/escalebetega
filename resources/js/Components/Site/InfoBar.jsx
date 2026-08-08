import { usePage } from '@inertiajs/react';
import { MapPin, Clock, Phone, Gift } from 'lucide-react';

export default function InfoBar() {
    const { settings } = usePage().props;

    const items = [
        {
            icon: MapPin,
            title: 'Localisation',
            lines: [settings.address, 'En bord de mer'].filter(Boolean),
        },
        {
            icon: Clock,
            title: 'Horaires',
            lines: [settings.hours_label].filter(Boolean),
        },
        {
            icon: Phone,
            title: 'Réservations',
            lines: [settings.phone, 'WhatsApp disponible'].filter(Boolean),
        },
        {
            icon: Gift,
            title: 'Événements',
            lines: ['Anniversaires, sorties,', 'privatisations & plus'],
        },
    ];

    return (
        <section id="infos" className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 lg:pb-20">
            <div className="rounded-card bg-cream border border-black/5 shadow-sm px-6 py-10 lg:px-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                            <div className="rounded-xl bg-forest-dark/10 p-2.5">
                                <item.icon className="h-5 w-5 text-forest-dark" strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink uppercase tracking-tight">
                                    {item.title}
                                </p>
                                {item.lines.map((line) => (
                                    <p key={line} className="text-sm text-muted leading-snug">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

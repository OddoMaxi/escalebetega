import { MapPin, Clock, Phone, Gift } from 'lucide-react';

const ITEMS = [
    {
        icon: MapPin,
        title: 'Takonko Beach',
        lines: ['Conakry, Guinée', 'En bord de mer'],
    },
    {
        icon: Clock,
        title: 'Ouvert tous les jours',
        lines: ['09h00 – 23h00', 'Lundi à Dimanche'],
    },
    {
        icon: Phone,
        title: 'Réservations',
        lines: ['+224 620 00 00 00', 'WhatsApp disponible'],
    },
    {
        icon: Gift,
        title: 'Événements',
        lines: ['Anniversaires, sorties,', 'privatisations & plus'],
    },
];

export default function InfoBar() {
    return (
        <section id="infos" className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 lg:pb-20">
            <div className="rounded-card bg-cream border border-black/5 shadow-sm px-6 py-10 lg:px-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ITEMS.map((item) => (
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

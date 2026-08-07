import { ArrowRight, Bell, Repeat, Zap } from 'lucide-react';
import Logo from './Logo';
import QrPattern from './QrPattern';

const POINTS = [
    { icon: Zap, title: 'Commande rapide', description: 'depuis votre table' },
    { icon: Repeat, title: 'Suivi en temps réel', description: 'de votre commande' },
    { icon: Bell, title: 'Notification SMS', description: 'à chaque étape' },
];

export default function QrCta() {
    return (
        <section id="qr-cta" className="mx-auto max-w-7xl px-6 lg:px-8 pb-20 lg:pb-28">
            <div className="relative overflow-hidden rounded-card bg-forest-dark px-6 py-14 sm:px-12 lg:px-16">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-forest opacity-40" />
                <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-sun opacity-10" />

                <div className="relative grid lg:grid-cols-[1.2fr_auto_1fr] gap-10 items-center">
                    <div>
                        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-sun">
                            Envie de vivre l&rsquo;escale ?
                        </span>
                        <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-cream leading-tight">
                            Scannez le QR code de votre salon et commandez en quelques clics.
                        </h2>
                        <a
                            href="#experience"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cream px-6 py-3.5 text-sm font-semibold text-forest-dark hover:bg-white transition-colors"
                        >
                            En savoir plus
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-48 rounded-[2rem] border-4 border-cream/20 bg-forest p-4 shadow-2xl">
                            <div className="rounded-2xl bg-cream p-4">
                                <Logo size="sm" showTagline={false} />
                                <div className="mt-4">
                                    <QrPattern className="w-full h-auto" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {POINTS.map((point) => (
                            <div key={point.title} className="flex items-start gap-3">
                                <div className="rounded-xl bg-cream/10 p-2.5">
                                    <point.icon className="h-5 w-5 text-sun" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-cream">{point.title}</p>
                                    <p className="text-sm text-cream/60">{point.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

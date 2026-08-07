import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Bell, Check, ChefHat, PackageCheck, Utensils } from 'lucide-react';
import ClientTopBar from '@/Components/Client/ClientTopBar';

const STEPS = [
    { key: 'nouvelle', label: 'Reçue', icon: Check },
    { key: 'en_preparation', label: 'En préparation', icon: ChefHat },
    { key: 'prete', label: 'Prête', icon: PackageCheck },
    { key: 'servie', label: 'Servie', icon: Utensils },
];

function stepIndex(status) {
    if (status === 'nouvelle' || status === 'confirmee') return 0;
    if (status === 'en_preparation') return 1;
    if (status === 'prete' || status === 'a_encaisser') return 2;
    return 3;
}

export default function OrderStatus({ salon, order }) {
    const [status, setStatus] = useState(order.status);

    useEffect(() => {
        if (['servie', 'payee', 'terminee', 'annulee'].includes(status)) return;

        const interval = setInterval(() => {
            fetch(`/q/${salon.token}/commandes/${order.id}/poll`)
                .then((res) => res.json())
                .then((data) => setStatus(data.status))
                .catch(() => {});
        }, 5000);

        return () => clearInterval(interval);
    }, [salon.token, order.id, status]);

    const isReady = status === 'prete' || status === 'servie';

    if (isReady) {
        return (
            <>
                <Head title={`Commande prête — ${salon.name}`} />
                <div className="min-h-screen bg-forest-dark flex flex-col items-center justify-center px-6 text-center text-cream">
                    <div className="rounded-full bg-cream/10 p-6 animate-pulse">
                        <Bell className="h-14 w-14 text-sun" strokeWidth={1.5} />
                    </div>
                    <h1 className="mt-6 text-2xl font-extrabold">
                        {status === 'servie' ? 'Commande servie !' : 'Votre commande est prête !'}
                    </h1>
                    <p className="mt-1 text-sm font-semibold text-sun uppercase tracking-wide">{salon.name}</p>
                    <p className="mt-4 max-w-xs text-sm text-cream/70">
                        {status === 'servie'
                            ? 'Merci et bonne dégustation !'
                            : 'Rendez-vous avec un serveur pour récupérer votre commande.'}
                    </p>

                    <div className="mt-8 rounded-2xl bg-cream/10 px-8 py-4">
                        <p className="text-xs uppercase tracking-widest text-cream/60">N&deg; Commande</p>
                        <p className="text-xl font-extrabold">{order.number}</p>
                    </div>

                    <Link
                        href={`/q/${salon.token}`}
                        className="mt-10 inline-flex items-center justify-center rounded-xl bg-cream px-8 py-3.5 text-sm font-semibold text-forest-dark"
                    >
                        Merci !
                    </Link>
                </div>
            </>
        );
    }

    const active = stepIndex(status);

    return (
        <>
            <Head title={`Suivi de commande — ${salon.name}`} />

            <div className="min-h-screen bg-base">
                <ClientTopBar
                    token={salon.token}
                    salonName={salon.name}
                    title="Suivi de commande"
                    back={`/q/${salon.token}`}
                />

                <div className="mx-auto max-w-md px-6 pt-8">
                    <div className="rounded-2xl bg-cream border border-black/5 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-muted">Commande</p>
                                <p className="text-lg font-extrabold text-forest-dark">{order.number}</p>
                            </div>
                            <span className="rounded-full bg-sun/15 text-wood text-xs font-bold px-3 py-1">
                                {STEPS[active].label}
                            </span>
                        </div>
                    </div>

                    <div className="mt-10">
                        <p className="text-sm font-bold text-ink mb-6">Statut actuel</p>
                        <div className="flex flex-col gap-0">
                            {STEPS.map((step, index) => {
                                const done = index <= active;
                                const isLast = index === STEPS.length - 1;
                                return (
                                    <div key={step.key} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                                    done ? 'bg-forest-dark text-cream' : 'bg-cream border border-black/10 text-muted'
                                                }`}
                                            >
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            {!isLast && (
                                                <div
                                                    className={`w-px flex-1 min-h-8 ${
                                                        index < active ? 'bg-forest-dark' : 'bg-black/10'
                                                    }`}
                                                />
                                            )}
                                        </div>
                                        <div className="pb-8">
                                            <p
                                                className={`text-sm font-semibold ${
                                                    done ? 'text-ink' : 'text-muted'
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                            {index === active && (
                                                <p className="text-xs text-muted mt-0.5">
                                                    {index === 0 && 'Nous préparons votre commande avec soin.'}
                                                    {index === 1 && 'Votre commande est en cours de préparation.'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <p className="text-xs text-muted text-center">
                        Dès qu&rsquo;elle sera prête, vous recevrez une notification.
                    </p>

                    <Link
                        href={`/q/${salon.token}/menu`}
                        className="mt-6 mb-10 inline-flex w-full items-center justify-center rounded-xl bg-forest-dark px-6 py-3.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                    >
                        Voir le menu
                    </Link>
                </div>
            </div>
        </>
    );
}

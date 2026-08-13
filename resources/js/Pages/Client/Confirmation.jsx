import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { storeSessionId } from '@/Hooks/useClientSession';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function Confirmation({ salon, order, session }) {
    const isRepeatOrder = session && session.ordersCount > 1;

    useEffect(() => {
        if (session?.id) storeSessionId(salon.token, session.id);
    }, [salon.token, session?.id]);

    return (
        <>
            <Head title={`Commande confirmée — ${salon.name}`} />

            <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 text-center">
                <div className="rounded-full bg-success/10 p-5">
                    <CheckCircle2 className="h-14 w-14 text-success" strokeWidth={1.5} />
                </div>

                <h1 className="mt-6 text-2xl font-extrabold text-forest-dark">
                    {isRepeatOrder ? 'Commande ajoutée à votre addition !' : 'Commande confirmée !'}
                </h1>
                <p className="mt-1 text-sm font-semibold text-wood uppercase tracking-wide">{salon.name}</p>

                <div className="mt-6 rounded-2xl bg-cream border border-black/5 px-8 py-4">
                    <p className="text-xs uppercase tracking-widest text-muted">N&deg; Commande</p>
                    <p className="text-xl font-extrabold text-forest-dark">{order.number}</p>
                </div>

                {isRepeatOrder ? (
                    <p className="mt-6 max-w-xs text-sm text-muted">
                        C&rsquo;est votre {session.ordersCount}e commande de la visite. Elle s&rsquo;ajoute à votre
                        addition en cours, pour un total de{' '}
                        <span className="font-bold text-ink">{formatGnf(session.total)}</span> — à régler en une
                        seule fois auprès d&rsquo;un serveur.
                    </p>
                ) : (
                    <p className="mt-6 max-w-xs text-sm text-muted">
                        Nous avons bien reçu votre commande. Vous serez notifié dès qu&rsquo;elle sera prête.
                    </p>
                )}

                <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
                    <Link
                        href={`/q/${salon.token}/commandes/${order.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-forest-dark px-6 py-3.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                    >
                        Suivre ma commande
                    </Link>
                    {session && (
                        <Link
                            href={`/q/${salon.token}/addition?session=${session.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-forest-dark/30 px-6 py-3.5 text-sm font-semibold text-forest-dark hover:bg-forest-dark/5 transition-colors"
                        >
                            Voir mon addition
                        </Link>
                    )}
                    <Link
                        href={`/q/${salon.token}/menu`}
                        className="inline-flex items-center justify-center rounded-xl text-sm font-semibold text-muted hover:text-forest-dark transition-colors"
                    >
                        Retour au menu
                    </Link>
                </div>
            </div>
        </>
    );
}

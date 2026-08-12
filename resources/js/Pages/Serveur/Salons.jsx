import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import ServeurNav from '@/Components/Serveur/ServeurNav';
import { salonStatusMeta } from '@/Utils/salonStatus';

export default function Salons({ salons }) {
    const { props } = usePage();
    const success = props.flash?.success;

    return (
        <>
            <Head title="Salons — Espace Serveur" />

            <div className="min-h-screen bg-base pb-24">
                <header className="px-6 pt-8">
                    <h1 className="text-2xl font-extrabold text-forest-dark">Salons</h1>
                    <p className="text-sm text-muted">Statut en temps réel des 10 salons. Touchez un salon pour le gérer.</p>
                </header>

                {success && (
                    <div className="mx-6 mt-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-semibold px-4 py-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {success}
                    </div>
                )}

                <div className="mx-6 mt-6 grid grid-cols-2 gap-3">
                    {salons.map((salon) => {
                        const meta = salonStatusMeta(salon.status);
                        return (
                            <Link
                                key={salon.id}
                                href={`/serveur/salons/${salon.id}`}
                                className={`rounded-2xl border p-4 ${meta.classes}`}
                            >
                                <p className="text-lg font-extrabold">{salon.code}</p>
                                <p className="text-sm font-semibold mt-1">{meta.label}</p>
                            </Link>
                        );
                    })}
                </div>

                <ServeurNav active="salons" />
            </div>
        </>
    );
}

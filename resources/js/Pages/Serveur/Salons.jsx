import { Head } from '@inertiajs/react';
import ServeurNav from '@/Components/Serveur/ServeurNav';
import { salonStatusMeta } from '@/Utils/salonStatus';

export default function Salons({ salons }) {
    return (
        <>
            <Head title="Salons — Espace Serveur" />

            <div className="min-h-screen bg-base pb-24">
                <header className="px-6 pt-8">
                    <h1 className="text-2xl font-extrabold text-forest-dark">Salons</h1>
                    <p className="text-sm text-muted">Statut en temps réel des 10 salons.</p>
                </header>

                <div className="mx-6 mt-6 grid grid-cols-2 gap-3">
                    {salons.map((salon) => {
                        const meta = salonStatusMeta(salon.status);
                        return (
                            <div
                                key={salon.id}
                                className={`rounded-2xl border p-4 ${meta.classes}`}
                            >
                                <p className="text-lg font-extrabold">{salon.code}</p>
                                <p className="text-sm font-semibold mt-1">{meta.label}</p>
                            </div>
                        );
                    })}
                </div>

                <ServeurNav active="salons" />
            </div>
        </>
    );
}

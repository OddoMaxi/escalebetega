import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

export default function Index({ sessions }) {
    return (
        <AdminLayout active="cash" title="Caisse & Finances">
            <Head title="Caisse — Admin" />

            <p className="text-sm text-muted mb-6">Sessions de salon ouvertes en attente d&rsquo;encaissement.</p>

            {sessions.length === 0 ? (
                <div className="rounded-card bg-cream border border-black/5 p-10 text-center text-sm text-muted">
                    Aucune session ouverte pour le moment.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/admin/caisse/${session.id}`}
                            className="rounded-card bg-cream border border-black/5 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-extrabold text-forest-dark">{session.salon}</p>
                                <span className="text-xs text-muted">Ouvert {session.opened_at}</span>
                            </div>
                            <p className="text-xs text-muted mt-1">{session.ordersCount} commande(s)</p>

                            <div className="mt-4 pt-4 border-t border-black/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Total</span>
                                    <span className="text-ink font-semibold">{formatGnf(session.total)}</span>
                                </div>
                                {session.paid > 0 && (
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-muted">Déjà payé</span>
                                        <span className="text-success font-semibold">{formatGnf(session.paid)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-muted">Restant</span>
                                    <span className="text-danger font-bold">{formatGnf(session.remaining)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}

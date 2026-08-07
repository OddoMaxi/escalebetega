import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

const STATUS_LABELS = {
    nouvelle: 'Nouvelle',
    confirmee: 'Confirmée',
    en_preparation: 'En préparation',
    prete: 'Prête',
    servie: 'Servie',
    a_encaisser: 'À encaisser',
    payee: 'Payée',
    terminee: 'Terminée',
    annulee: 'Annulée',
};

export default function Show({ order }) {
    return (
        <AdminLayout active="orders" title={`Commande ${order.number}`}>
            <Head title={`${order.number} — Admin`} />

            <Link href="/admin/commandes" className="inline-flex items-center gap-1 text-sm text-forest-dark font-semibold mb-6">
                <ChevronLeft className="h-4 w-4" />
                Retour aux commandes
            </Link>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-card bg-cream border border-black/5 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-muted">Commande</p>
                            <p className="text-xl font-extrabold text-forest-dark">{order.number}</p>
                        </div>
                        <span className="text-xs font-semibold rounded-full bg-sun/15 text-wood px-3 py-1.5">
                            {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                    </div>

                    <table className="w-full text-sm mt-4">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                                <th className="pb-2 font-semibold">Produit</th>
                                <th className="pb-2 font-semibold">Qté</th>
                                <th className="pb-2 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index} className="border-b border-black/5 last:border-0">
                                    <td className="py-2.5 text-ink">
                                        {item.name}
                                        {item.notes && <p className="text-xs text-muted">{item.notes}</p>}
                                    </td>
                                    <td className="py-2.5 text-ink">{item.quantity}</td>
                                    <td className="py-2.5 text-right text-ink">{formatGnf(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 pt-4 border-t border-black/5 flex flex-col gap-1 items-end text-sm">
                        <div className="flex justify-between w-48">
                            <span className="text-muted">Sous-total</span>
                            <span className="text-ink">{formatGnf(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between w-48">
                                <span className="text-muted">Réduction</span>
                                <span className="text-ink">-{formatGnf(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between w-48 font-bold text-forest-dark text-base">
                            <span>Total</span>
                            <span>{formatGnf(order.total)}</span>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="mt-4 pt-4 border-t border-black/5 text-sm">
                            <p className="text-xs uppercase tracking-widest text-muted mb-1">Notes</p>
                            <p className="text-ink">{order.notes}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-card bg-cream border border-black/5 p-6 flex flex-col gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted">Salon</p>
                        <p className="text-sm font-semibold text-ink">{order.salon}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted">Source</p>
                        <p className="text-sm font-semibold text-ink">
                            {order.source === 'client_qr' ? 'Client QR' : 'Serveur'}
                        </p>
                    </div>
                    {order.created_by && (
                        <div>
                            <p className="text-xs uppercase tracking-widest text-muted">Créée par</p>
                            <p className="text-sm font-semibold text-ink">{order.created_by}</p>
                        </div>
                    )}
                    {order.customer_name && (
                        <div>
                            <p className="text-xs uppercase tracking-widest text-muted">Client</p>
                            <p className="text-sm font-semibold text-ink">{order.customer_name}</p>
                        </div>
                    )}
                    {order.customer_phone && (
                        <div>
                            <p className="text-xs uppercase tracking-widest text-muted">Téléphone</p>
                            <p className="text-sm font-semibold text-ink">{order.customer_phone}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted">Heure</p>
                        <p className="text-sm font-semibold text-ink">{order.created_at}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

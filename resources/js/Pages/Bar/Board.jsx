import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import Logo from '@/Components/Site/Logo';
import OrderCard from '@/Components/Bar/OrderCard';

const COLUMNS = [
    { key: 'nouvelles', title: 'Nouvelles' },
    { key: 'en_preparation', title: 'En préparation' },
    { key: 'pretes', title: 'Prêtes' },
];

export default function Board({ columns }) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['columns'], preserveScroll: true });
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    const start = (orderId) => {
        router.patch(`/bar/commandes/${orderId}/commencer`, {}, { preserveScroll: true });
    };

    const ready = (orderId) => {
        router.patch(`/bar/commandes/${orderId}/pret`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Bar — Kitchen Display" />

            <div className="min-h-screen bg-base">
                <header className="px-6 py-6 flex items-center justify-between border-b border-black/5 bg-cream">
                    <Logo size="sm" showTagline={false} />
                    <h1 className="text-lg font-extrabold text-forest-dark">Écran de préparation</h1>
                </header>

                <div className="grid md:grid-cols-3 gap-4 p-4 md:p-6">
                    {COLUMNS.map((column) => (
                        <div key={column.key} className="flex flex-col">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h2 className="text-sm font-extrabold text-forest-dark uppercase tracking-wide">
                                    {column.title}
                                </h2>
                                <span className="text-xs font-bold text-muted bg-black/5 rounded-full px-2 py-0.5">
                                    {columns[column.key].length}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {columns[column.key].length === 0 && (
                                    <p className="text-xs text-muted text-center py-8">Aucune commande.</p>
                                )}

                                {columns[column.key].map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        action={
                                            column.key === 'nouvelles'
                                                ? { label: 'Commencer', onClick: () => start(order.id) }
                                                : column.key === 'en_preparation'
                                                    ? { label: 'Marquer prête', onClick: () => ready(order.id) }
                                                    : null
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

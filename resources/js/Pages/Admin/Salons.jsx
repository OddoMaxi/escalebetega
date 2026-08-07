import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import QrCodeCard from '@/Components/Admin/QrCodeCard';

export default function Salons({ salons }) {
    return (
        <AdminLayout active="salons" title="Salons / Tables">
            <Head title="Salons — Admin" />

            <p className="text-sm text-muted mb-6">
                Génère, télécharge ou imprime le QR code de chaque salon. Régénérer un code invalide immédiatement l&rsquo;ancien lien.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {salons.map((salon) => (
                    <QrCodeCard key={salon.id} salon={salon} />
                ))}
            </div>
        </AdminLayout>
    );
}

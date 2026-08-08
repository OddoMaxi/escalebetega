import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        business_name: settings.business_name ?? '',
        tagline: settings.tagline ?? '',
        phone: settings.phone ?? '',
        whatsapp: settings.whatsapp ?? '',
        email: settings.email ?? '',
        address: settings.address ?? '',
        hours_label: settings.hours_label ?? '',
        facebook_url: settings.facebook_url ?? '',
        instagram_url: settings.instagram_url ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/parametres');
    };

    const field = (key, label, options = {}) => (
        <div>
            <label className="text-xs font-semibold text-muted">{label}</label>
            <input
                type={options.type ?? 'text'}
                value={data[key]}
                onChange={(e) => setData(key, e.target.value)}
                placeholder={options.placeholder}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
            {errors[key] && <p className="mt-1 text-xs text-danger">{errors[key]}</p>}
        </div>
    );

    return (
        <AdminLayout active="settings" title="Paramètres">
            <Head title="Paramètres — Admin" />

            <p className="text-sm text-muted mb-6 max-w-xl">
                Ces informations alimentent le site vitrine (pied de page, bandeau d&rsquo;infos pratiques) et le
                bouton &laquo; Appeler un serveur &raquo; côté client.
            </p>

            <form onSubmit={submit} className="max-w-xl rounded-card bg-cream border border-black/5 p-6 flex flex-col gap-5">
                {field('business_name', 'Nom du restaurant')}
                {field('tagline', 'Slogan')}
                {field('phone', 'Téléphone', { placeholder: '+224 620 00 00 00' })}
                {field('whatsapp', 'WhatsApp', { placeholder: '+224 620 00 00 00' })}
                {field('email', 'Email de contact', { type: 'email' })}
                {field('address', 'Adresse', { placeholder: 'Takonko Beach, Conakry' })}
                {field('hours_label', 'Horaires', { placeholder: 'Tous les jours, 09h00 – 23h00' })}
                {field('facebook_url', 'Lien Facebook (facultatif)', { placeholder: 'https://facebook.com/...' })}
                {field('instagram_url', 'Lien Instagram (facultatif)', { placeholder: 'https://instagram.com/...' })}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

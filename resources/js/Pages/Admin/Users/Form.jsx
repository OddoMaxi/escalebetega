import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ roles, user }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        role: user?.role ?? roles[0]?.value ?? '',
        password: '',
        active: user?.active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/utilisateurs/${user.id}`);
        } else {
            post('/admin/utilisateurs');
        }
    };

    return (
        <AdminLayout active="users" title={isEdit ? 'Modifier l’utilisateur' : 'Nouvel utilisateur'}>
            <Head title={isEdit ? 'Modifier utilisateur' : 'Nouvel utilisateur'} />

            <form onSubmit={submit} className="max-w-xl rounded-card bg-cream border border-black/5 p-6 flex flex-col gap-5">
                <div>
                    <label className="text-xs font-semibold text-muted">Nom</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Téléphone (facultatif)</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="+224 620 00 00 00"
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">Rôle</label>
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-danger">{errors.role}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-muted">
                        {isEdit ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                    {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input
                        type="checkbox"
                        checked={data.active}
                        onChange={(e) => setData('active', e.target.checked)}
                        className="rounded border-black/20 text-forest focus:ring-forest/30"
                    />
                    Compte actif
                </label>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-forest-dark px-6 py-3 text-sm font-semibold text-cream hover:bg-forest transition-colors disabled:opacity-50"
                    >
                        {isEdit ? 'Enregistrer' : 'Créer l’utilisateur'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

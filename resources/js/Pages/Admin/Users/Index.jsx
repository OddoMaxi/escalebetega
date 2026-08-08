import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Power, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users, roles }) {
    const { props } = usePage();
    const currentUserId = props.auth?.user?.id;
    const roleLabel = (value) => roles.find((r) => r.value === value)?.label ?? value;

    const destroy = (user) => {
        if (!confirm(`Supprimer "${user.name}" ?`)) return;
        router.delete(`/admin/utilisateurs/${user.id}`);
    };

    const toggle = (user) => {
        router.patch(`/admin/utilisateurs/${user.id}/toggle`);
    };

    return (
        <AdminLayout active="users" title="Utilisateurs">
            <Head title="Utilisateurs — Admin" />

            <div className="flex justify-end mb-6">
                <Link
                    href="/admin/utilisateurs/nouveau"
                    className="inline-flex items-center gap-2 rounded-xl bg-forest-dark px-5 py-2.5 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nouvel utilisateur
                </Link>
            </div>

            <div className="rounded-card bg-cream border border-black/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-black/5">
                            <th className="px-5 py-3 font-semibold">Nom</th>
                            <th className="px-5 py-3 font-semibold">Email</th>
                            <th className="px-5 py-3 font-semibold">Rôle</th>
                            <th className="px-5 py-3 font-semibold">Statut</th>
                            <th className="px-5 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-black/5 last:border-0">
                                <td className="px-5 py-3 font-semibold text-ink">
                                    {user.name}
                                    {user.id === currentUserId && (
                                        <span className="ml-2 text-xs text-muted">(vous)</span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-muted">{user.email}</td>
                                <td className="px-5 py-3">
                                    <span className="text-xs font-semibold rounded-full bg-sun/15 text-wood px-2.5 py-1">
                                        {roleLabel(user.role)}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    {user.active ? (
                                        <span className="text-xs font-semibold rounded-full bg-success/10 text-success px-2.5 py-1">
                                            Actif
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold rounded-full bg-black/5 text-muted px-2.5 py-1">
                                            Désactivé
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/utilisateurs/${user.id}/modifier`}
                                            className="rounded-lg p-2 text-forest-dark hover:bg-forest-dark/5"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        {user.id !== currentUserId && (
                                            <>
                                                <button
                                                    onClick={() => toggle(user)}
                                                    className="rounded-lg p-2 text-wood hover:bg-sun/10"
                                                    title={user.active ? 'Désactiver' : 'Activer'}
                                                >
                                                    <Power className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => destroy(user)}
                                                    className="rounded-lg p-2 text-danger hover:bg-danger/5"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                                    Aucun utilisateur.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

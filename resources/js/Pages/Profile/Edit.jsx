import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl font-bold text-forest-dark">Mon profil</h1>
            }
        >
            <Head title="Profil" />

            <div className="space-y-6">
                <div className="rounded-card border border-black/5 bg-cream p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="rounded-card border border-black/5 bg-cream p-6">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="rounded-card border border-black/5 bg-cream p-6">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

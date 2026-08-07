import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Vérification de l'email" />

            <h1 className="text-lg font-bold text-forest-dark">Vérifiez votre email</h1>
            <p className="mt-2 text-sm text-muted">
                Merci de votre inscription ! Cliquez sur le lien que nous venons de vous envoyer par email pour
                confirmer votre adresse. Vous ne l&rsquo;avez pas reçu ? Nous pouvons vous en renvoyer un.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mt-4 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm font-medium text-success">
                    Un nouveau lien de vérification a été envoyé à l&rsquo;adresse indiquée lors de votre inscription.
                </div>
            )}

            <form onSubmit={submit} className="mt-6">
                <div className="flex items-center justify-between gap-4">
                    <PrimaryButton disabled={processing}>
                        Renvoyer l&rsquo;email
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-muted underline hover:text-forest-dark focus:outline-none"
                    >
                        Déconnexion
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <h1 className="text-lg font-bold text-forest-dark">Mot de passe oublié</h1>
            <p className="mt-2 text-sm text-muted">
                Indiquez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {status && (
                <div className="mt-4 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-6">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-6 flex items-center justify-end">
                    <PrimaryButton disabled={processing}>
                        Envoyer le lien
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <h1 className="text-lg font-bold text-forest-dark">Connexion</h1>
            <p className="mt-1 text-sm text-muted">Accédez à votre espace Escale Betega.</p>

            {status && (
                <div className="mt-4 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-ink">
                            Se souvenir de moi
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-muted underline hover:text-forest-dark focus:outline-none"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}

                    <PrimaryButton className="ms-auto" disabled={processing}>
                        Connexion
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

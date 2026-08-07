import { Head } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import ClientTopBar from '@/Components/Client/ClientTopBar';
import BottomNav from '@/Components/Client/BottomNav';
import Logo from '@/Components/Site/Logo';
import useCart from '@/Hooks/useCart';

export default function Moi({ salon }) {
    const cart = useCart(salon.token);

    return (
        <>
            <Head title={`Moi — ${salon.name}`} />

            <div className="min-h-screen bg-base pb-24">
                <ClientTopBar token={salon.token} salonName={salon.name} title="Moi" />

                <div className="mx-auto max-w-md px-6 pt-10 flex flex-col items-center text-center">
                    <Logo size="md" />

                    <div className="mt-8 rounded-2xl bg-cream border border-black/5 px-8 py-5 w-full">
                        <p className="text-xs uppercase tracking-widest text-muted">Vous êtes au</p>
                        <p className="text-xl font-extrabold text-forest-dark">{salon.name}</p>
                    </div>

                    <a
                        href="tel:+224620000000"
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest-dark px-6 py-4 text-sm font-semibold text-cream hover:bg-forest transition-colors"
                    >
                        <Phone className="h-4 w-4" />
                        Appeler un serveur
                    </a>

                    <p className="mt-8 text-xs text-muted">Savourez la nature, vivez l&rsquo;escale.</p>
                </div>

                <BottomNav token={salon.token} active="moi" cartCount={cart.count} />
            </div>
        </>
    );
}

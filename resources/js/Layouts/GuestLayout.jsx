import { Link } from '@inertiajs/react';
import Logo from '@/Components/Site/Logo';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 py-10">
            <Link href="/">
                <Logo size="md" />
            </Link>

            <div className="mt-8 w-full overflow-hidden rounded-card border border-black/5 bg-cream px-6 py-8 shadow-sm sm:max-w-md sm:px-8">
                {children}
            </div>
        </div>
    );
}

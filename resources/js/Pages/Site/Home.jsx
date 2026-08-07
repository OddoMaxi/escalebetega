import { Head } from '@inertiajs/react';
import Header from '@/Components/Site/Header';
import Hero from '@/Components/Site/Hero';
import Experience from '@/Components/Site/Experience';
import Gallery from '@/Components/Site/Gallery';
import InfoBar from '@/Components/Site/InfoBar';
import QrCta from '@/Components/Site/QrCta';
import Footer from '@/Components/Site/Footer';

export default function Home() {
    return (
        <>
            <Head title="Escale BETEGA | Takonko Beach Conakry">
                <meta
                    name="description"
                    content="Jus naturels, cocktails et espace détente face à la plage à Takonko, Conakry."
                />
            </Head>

            <div className="bg-base font-sans text-ink">
                <Header />
                <Hero />
                <Experience />
                <Gallery />
                <InfoBar />
                <QrCta />
                <Footer />
            </div>
        </>
    );
}

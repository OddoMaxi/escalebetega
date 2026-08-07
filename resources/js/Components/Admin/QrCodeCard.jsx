import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import QRCode from 'qrcode';
import { Download, Power, Printer, RefreshCw } from 'lucide-react';
import { salonStatusMeta } from '@/Utils/salonStatus';

export default function QrCodeCard({ salon }) {
    const [dataUrl, setDataUrl] = useState(null);
    const [busy, setBusy] = useState(false);

    const url = `${window.location.origin}/q/${salon.token}`;
    const meta = salonStatusMeta(salon.status);

    useEffect(() => {
        QRCode.toDataURL(url, { width: 480, margin: 1, color: { dark: '#153B2D', light: '#FFFFFF' } }).then(
            setDataUrl,
        );
    }, [url]);

    const download = () => {
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `escale-betega-qr-salon-${salon.code}.png`;
        link.click();
    };

    const print = () => {
        if (!dataUrl) return;
        const win = window.open('', '_blank', 'width=420,height=560');
        win.document.write(`
            <html>
                <head><title>QR ${salon.name}</title></head>
                <body style="font-family: sans-serif; text-align:center; padding:32px;">
                    <p style="letter-spacing:0.2em; text-transform:uppercase; font-size:11px; color:#8B5A2B; margin-bottom:4px;">Escale Betega</p>
                    <h1 style="font-size:22px; color:#153B2D; margin:0 0 20px;">${salon.name}</h1>
                    <img src="${dataUrl}" width="280" height="280" />
                    <p style="margin-top:20px; font-size:13px; color:#1E2823;">Scannez pour commander</p>
                    <script>window.onload = () => window.print();</script>
                </body>
            </html>
        `);
        win.document.close();
    };

    const regenerate = () => {
        if (!confirm(`Régénérer le QR code du ${salon.name} ? L'ancien code ne fonctionnera plus.`)) return;
        setBusy(true);
        router.patch(`/admin/salons/${salon.id}/regenerate`, {}, { onFinish: () => setBusy(false) });
    };

    const toggleActive = () => {
        setBusy(true);
        router.patch(`/admin/salons/${salon.id}/toggle`, {}, { onFinish: () => setBusy(false) });
    };

    return (
        <div className="rounded-card bg-cream border border-black/5 p-5 flex flex-col items-center text-center">
            <div className="flex items-center justify-between w-full mb-3">
                <span className="text-lg font-extrabold text-forest-dark">{salon.name}</span>
                <span className={`text-[10px] font-bold rounded-full border px-2 py-0.5 ${meta.classes}`}>
                    {meta.label}
                </span>
            </div>

            <div className="rounded-xl border border-black/10 p-3 bg-white">
                {dataUrl ? (
                    <img src={dataUrl} alt={`QR ${salon.name}`} className="h-32 w-32" />
                ) : (
                    <div className="h-32 w-32 animate-pulse bg-black/5 rounded" />
                )}
            </div>
            <p className="mt-2 text-[11px] text-muted break-all">{url}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                <button
                    onClick={download}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-forest-dark/20 px-3 py-2 text-xs font-semibold text-forest-dark hover:bg-forest-dark/5"
                >
                    <Download className="h-3.5 w-3.5" />
                    Télécharger
                </button>
                <button
                    onClick={print}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-forest-dark/20 px-3 py-2 text-xs font-semibold text-forest-dark hover:bg-forest-dark/5"
                >
                    <Printer className="h-3.5 w-3.5" />
                    Imprimer
                </button>
                <button
                    onClick={regenerate}
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-sun/30 px-3 py-2 text-xs font-semibold text-wood hover:bg-sun/10 disabled:opacity-50"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Régénérer
                </button>
                <button
                    onClick={toggleActive}
                    disabled={busy}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                        salon.active
                            ? 'border-danger/30 text-danger hover:bg-danger/5'
                            : 'border-success/30 text-success hover:bg-success/5'
                    }`}
                >
                    <Power className="h-3.5 w-3.5" />
                    {salon.active ? 'Désactiver' : 'Activer'}
                </button>
            </div>
        </div>
    );
}

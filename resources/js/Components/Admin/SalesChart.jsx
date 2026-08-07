import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function formatGnf(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(amount)} GNF`;
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg bg-forest-dark text-cream text-xs font-semibold px-3 py-2 shadow-lg">
            <p className="text-cream/60 mb-0.5">{label}</p>
            <p>{formatGnf(payload[0].value)}</p>
        </div>
    );
}

export default function SalesChart({ data }) {
    const hasSales = data.some((d) => d.total > 0);

    return (
        <div className="rounded-card bg-cream border border-black/5 p-5">
            <p className="text-sm font-bold text-ink mb-4">Ventes aujourd&rsquo;hui</p>

            {!hasSales ? (
                <div className="h-56 flex items-center justify-center text-sm text-muted">
                    Aucune vente enregistrée aujourd&rsquo;hui.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={224}>
                    <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1F4D3A" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#1F4D3A" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#1E2823" strokeOpacity={0.06} />
                        <XAxis
                            dataKey="hour"
                            interval={3}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#747A76' }}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1F4D3A', strokeOpacity: 0.15 }} />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#1F4D3A"
                            strokeWidth={2}
                            strokeLinecap="round"
                            fill="url(#salesFill)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

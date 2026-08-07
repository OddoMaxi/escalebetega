import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

export default function BarListChart({ data, dataKey = 'revenue', nameKey = 'name', height = 240 }) {
    if (data.length === 0) {
        return <div className="h-40 flex items-center justify-center text-sm text-muted">Aucune donnée.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid horizontal={false} stroke="#1E2823" strokeOpacity={0.06} />
                <XAxis type="number" hide />
                <YAxis
                    type="category"
                    dataKey={nameKey}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    tick={{ fontSize: 12, fill: '#1E2823' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1F4D3A', fillOpacity: 0.06 }} />
                <Bar dataKey={dataKey} fill="#1F4D3A" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
        </ResponsiveContainer>
    );
}

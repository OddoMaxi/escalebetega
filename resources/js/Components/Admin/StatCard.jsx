export default function StatCard({ label, value, suffix }) {
    return (
        <div className="rounded-card bg-cream border border-black/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
            <p className="mt-2 text-2xl font-extrabold text-forest-dark">
                {value}
                {suffix && <span className="text-sm font-semibold text-muted ml-1">{suffix}</span>}
            </p>
        </div>
    );
}

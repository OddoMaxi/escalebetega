export default function OrderCard({ order, action }) {
    return (
        <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
            <div className="flex items-center justify-between">
                <p className="font-extrabold text-forest-dark">{order.number}</p>
                <span className="text-xs font-semibold text-muted">{order.time}</span>
            </div>
            <p className="text-xs font-semibold text-wood uppercase tracking-wide mt-0.5">{order.salon}</p>

            <ul className="mt-3 flex flex-col gap-1">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                        <span className="text-ink">{item.name}</span>
                        <span className="font-bold text-forest-dark">×{item.quantity}</span>
                    </li>
                ))}
            </ul>

            {order.notes && (
                <p className="mt-2 text-xs text-muted italic border-t border-black/5 pt-2">{order.notes}</p>
            )}

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 w-full rounded-xl bg-forest-dark px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-cream hover:bg-forest transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

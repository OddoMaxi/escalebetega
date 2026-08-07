const GRADIENTS = {
    sunset: 'from-[#F5A623] via-[#E8935A] to-[#1F4D3A]',
    forest: 'from-[#1F4D3A] via-[#16382A] to-[#0F241B]',
    sand: 'from-[#F2E6D2] via-[#E8CFA0] to-[#C99B5E]',
    night: 'from-[#153B2D] via-[#0F241B] to-[#0A1712]',
};

export default function PhotoPlaceholder({ icon: Icon, gradient = 'sunset', className = '', iconClassName = 'h-8 w-8' }) {
    return (
        <div
            className={`relative overflow-hidden bg-gradient-to-br ${GRADIENTS[gradient]} ${className}`}
        >
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
            {Icon && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/15 backdrop-blur-sm p-4">
                        <Icon className={`${iconClassName} text-white`} strokeWidth={1.5} />
                    </div>
                </div>
            )}
        </div>
    );
}

const SEED = [
    1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1,
    0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0,
    1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1,
    1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1,
];

const SIZE = 13;

export default function QrPattern({ className = 'h-40 w-40' }) {
    const cell = 100 / SIZE;

    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white" rx="4" />
            {SEED.map((value, index) => {
                if (!value) return null;
                const x = (index % SIZE) * cell;
                const y = Math.floor(index / SIZE) * cell;
                return <rect key={index} x={x} y={y} width={cell} height={cell} fill="#153B2D" />;
            })}
        </svg>
    );
}

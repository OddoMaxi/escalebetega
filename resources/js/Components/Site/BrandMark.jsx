export default function BrandMark({ className = 'h-10 w-10' }) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle cx="40" cy="26" r="12" fill="#F5A623" />
            <path
                d="M26 18c-2-6-9-9-15-7 4 2 6 6 6 10-5-2-11 0-13 5 6-1 11 2 13 6-6 1-10 6-10 12 4-4 9-6 14-5-2 5-1 11 3 15 1-6 5-10 10-12-1 5 1 10 6 12 0-6-3-11-8-13 5-1 9-5 10-10-5 2-10 0-13-4 4-1 7-4 8-8-5 0-9 2-11 6-1-3 0-6 0-7z"
                fill="#1F4D3A"
            />
            <path
                d="M4 46c6-4 14-4 20 0s14 4 20 0s14-4 16 0"
                stroke="#1F4D3A"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M4 52c6-4 14-4 20 0s14 4 20 0s14-4 16 0"
                stroke="#1F4D3A"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
}

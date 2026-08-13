function storageKey(salonToken) {
    return `escale_session_${salonToken}`;
}

export function getStoredSessionId(salonToken) {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(storageKey(salonToken));
        return raw ? JSON.parse(raw).sessionId ?? null : null;
    } catch {
        return null;
    }
}

export function storeSessionId(salonToken, sessionId) {
    if (typeof window === 'undefined' || !sessionId) return;
    window.localStorage.setItem(storageKey(salonToken), JSON.stringify({ sessionId, savedAt: Date.now() }));
}

export function additionHref(salonToken) {
    const sessionId = getStoredSessionId(salonToken);
    return sessionId ? `/q/${salonToken}/addition?session=${sessionId}` : `/q/${salonToken}/addition`;
}

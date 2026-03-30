export const tests = new Map(); //on server memory to improve performance...

export function getTestState(id) {
    return tests.get(id);
}
export function addTestState(testState) {
    tests.set(testState.id, testState);
}
export function deleteTestState(id) {
    tests.delete(id);
}

// Memory Management: Cleanup old sessions every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
const SESSION_TTL = 30 * 60 * 1000;    // 30 minutes

setInterval(() => {
    const now = Date.now();
    let deletedCount = 0;

    for (const [id, state] of tests.entries()) {
        const age = now - (state.startTime || state.createdAt || now);
        if (age > SESSION_TTL) {
            tests.delete(id);
            deletedCount++;
        }
    }

    if (deletedCount > 0) {
        console.log(`[Memory Cleanup] Purged ${deletedCount} expired sessions.`);
    }
}, CLEANUP_INTERVAL);
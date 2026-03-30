export default function getLoadTestInfo(id, getTestState, getMetrics) {
    const testState = getTestState(id);
    if (!testState) {
        return { error: "testID no longer exists in the server memory" };
    }
    const metrics = getMetrics(testState);
    return metrics;
}
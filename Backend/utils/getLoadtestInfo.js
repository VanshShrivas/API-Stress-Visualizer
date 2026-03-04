
export default function getLoadTestInfo(id,getTestState,getMetrics){
    const testState= getTestState(id);
    const metrics=getMetrics(testState);
    return metrics;
}
/*
Compares two historical test runs and produces regression analysis.
For each metric, computes:
  - valueA / valueB
  - diff (B - A)
  - pctChange (percentage change from A to B)
  - verdict: "improved" | "regressed" | "no_change"
verdicts:
  - Latency metrics: decrease = improved, increase = regressed
  - Throughput / Success Rate: increase = improved, decrease = regressed
  - Error Rate: decrease = improved, increase = regressed
  - Changes under 2% absolute = "no_change"
 */

const NO_CHANGE_THRESHOLD = 2; //(%)

function computeMetricDiff(valueA, valueB, lowerIsBetter) {
    const diff = valueB - valueA;
    const pctChange = valueA !== 0
        ? (diff / Math.abs(valueA)) * 100
        : (valueB !== 0 ? 100 : 0);

    let verdict;
    if (Math.abs(pctChange) < NO_CHANGE_THRESHOLD) {
        verdict = 'no_change';
    } else if (lowerIsBetter) {
        verdict = diff < 0 ? 'improved' : 'regressed';
    } else {
        verdict = diff > 0 ? 'improved' : 'regressed';
    }

    return {
        valueA: round(valueA),
        valueB: round(valueB),
        diff: round(diff),
        pctChange: round(pctChange),
        verdict
    };
}

function round(num) {
    return Math.round(num * 100) / 100;
}

export default function compareRuns(runA, runB) {
    const a = runA.metrics;
    const b = runB.metrics;

    return {
        avgLatency: computeMetricDiff(a.avgLatency, b.avgLatency, true),
        p95Latency: computeMetricDiff(a.p95Latency, b.p95Latency, true),
        minLatency: computeMetricDiff(a.minLatency, b.minLatency, true),
        maxLatency: computeMetricDiff(a.maxLatency, b.maxLatency, true),
        throughput: computeMetricDiff(a.throughput, b.throughput, false),
        successRate: computeMetricDiff(a.successRate, b.successRate, false),
        errorRate: computeMetricDiff(a.errorRate, b.errorRate, true)
    };
}

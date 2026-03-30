export default async function runScheduler(testState) {

    const { totalRequests, concurrency } = testState;

    let running = 0;
    let index = 0;

    return new Promise((resolve) => {

        function launchNext() {
            while (running < concurrency && index < totalRequests) {
                running++;
                index++;

                executeRequest(testState)
                    .finally(() => {
                        running--;
                        testState.completed++;

                        if (testState.aborted || testState.completed === totalRequests) {
                            if (testState.aborted)
                                testState.status = "aborted";
                            else
                                testState.status = "completed";

                            testState.endTime = Date.now();
                            resolve();
                        } else {
                            launchNext();
                        }
                    });
            }
        }

        launchNext();
    });
}


async function executeRequest(testState) {
    const start = Date.now();
    const method = (testState.config.method || "GET").toUpperCase();

    try {
        const response = await fetch(testState.config.url, {
            method,
            headers: testState.config.headers,
            body: ["POST", "PUT", "PATCH"].includes(method) && testState.config.body
                ? JSON.stringify(testState.config.body)
                : undefined,
        });
        const status = response.status;

        if (response.ok) {
            testState.success++;
        } else {
            testState.errors++;
        }

        if (status >= 200 && status < 300) {
            testState.errorStats.success2xx++;
        } else if (status >= 300 && status < 400) {
            testState.errorStats.redirect3xx++;
        } else if (status >= 400 && status < 500) {
            testState.errorStats.client4xx++;
        } else if (status >= 500) {
            testState.errorStats.server5xx++;
        }

    } catch (err) {
        testState.errors++;
        testState.errorStats.networkErrors++;

    } finally {
        const latency = Date.now() - start;
        let placed = false;
        for (let i = 1; i < testState.buckets.length; i++) {
            if (latency < testState.buckets[i]) {
                testState.counts[i - 1]++;
                placed = true;
                break;
            }
        }
        if (!placed) {
            testState.counts[testState.counts.length - 1]++;
        }
        testState.latencies.push(latency);
    }
}
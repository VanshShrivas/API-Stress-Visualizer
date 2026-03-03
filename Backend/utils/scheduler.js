export default async function runScheduler(testState) {

    const { totalRequests, concurrency, config } = testState;

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

                        if (testState.completed === totalRequests) {
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
        const response = await fetch(testState.config.url,{
            method,
            headers: testState.config.headers,
            body: ["POST", "PUT", "PATCH"].includes(method) && testState.config.body
                ? JSON.stringify(testState.config.body)
                : undefined,
        });

        if (response.ok) {
            testState.success++;
        } else {
            testState.errors++;
        }

    } catch (err) {
        testState.errors++;
    } finally {
        const latency = Date.now() - start;
        testState.latencies.push(latency);
    }
}
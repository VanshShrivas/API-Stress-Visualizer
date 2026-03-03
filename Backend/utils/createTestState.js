//this creates a new testState for the user 
import { randomUUID } from "crypto";
export default function createTestState(config){
    let testState= {
        id:randomUUID(),
        config,
        status: "running",
        totalRequests: config.totalRequests,
        concurrency: config.concurrency,
        completed: 0,
        success: 0,
        errors: 0,
        latencies: [],
        startTime: Date.now(),
        endTime: null
    }
    return testState;
}
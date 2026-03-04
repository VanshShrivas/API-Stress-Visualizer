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
        buckets:[0,100,200,400,800,1000,1500,2000,3000],
        counts:[0,0,0,0,0,0,0,0,0],
        aborted:false,
        startTime: Date.now(),
        endTime: null
    }
    return testState;
}
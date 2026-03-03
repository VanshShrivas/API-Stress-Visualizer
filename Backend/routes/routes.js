import express from 'express'
import startLoadTest from '../services/loadEngine';

export const router=express.Router();

router.post("/start-load-test", async(req,res)=>{

    const {url,method,headers,body,totalRequests,concurrency}=req.body;
    const config={url,method,headers,body,totalRequests,concurrency};

    try {
        const response = await startLoadTest(config);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: "Load test failed" });
    }

    res.send(response);
    console.log("this will do all tests")
})

router.get("/send-test-info",()=>{
    console.log("sending the data!!");
})


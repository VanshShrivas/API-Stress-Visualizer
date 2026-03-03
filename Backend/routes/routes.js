import express from 'express'
import startLoadTest from '../services/loadEngine';

export const router=express.Router();

router.post("/start-load-test",(req,res)=>{

    const {url,method,headers,auth,body,totalRequests,concurrency}=req.body;
    const config={url,method,headers,auth,body,totalRequests,concurrency};

    const response = startLoadTest(config);

    res.send(response);
    console.log("this will do all tests")
})

router.get("/send-test-info",()=>{
    console.log("sending the data!!");
})


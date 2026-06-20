import express, { json } from 'express'
import Redis from 'ioredis'

const app=express()
app.use(express.json())
const redis=new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const QUEUE_KEY='queue:emails';

app.post('/emails',async(req,res)=>{
    const job={
        to:req.body.to,
        subject:req.body.subject || 'No Subject',
        content:req.body.body  || 'No Content',
        createdAt:new Date().toISOString()
    }
    await redis.lpush(QUEUE_KEY,JSON.stringify(job));
    res.json({
        queued:true,
        job
    })
});

app.get('/email/process-one',async(req,res)=>{
    const rawjob=await redis.rpop(QUEUE_KEY);
    if(!rawjob){
        return res.status(400).json({
            message:'No Jobs in the queue'
        })
    }
    const job=JSON.parse(rawjob);
    res.json({message:'Email Sent',job})
})
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})

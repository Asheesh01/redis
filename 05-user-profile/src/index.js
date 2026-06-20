import express, { json } from 'express'
import Redis from 'ioredis'

const app=express()
app.use(express.json())
const redis=new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

app.post('/user/:id/json',async(req,res)=>{
    await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body));
    res.json({savedAs:"json"})
})

app.get("/user/:id/json",async(req,res)=>{
    const raw=await redis.get(`user:${req.params.id}:json`);
    res.json({user: raw ? JSON.parse(raw): null})
})

app.post('/user/:id/hash',async(req,res)=>{
    await redis.hset(`user:${req.params.id}:hset`,JSON.stringify(req.body));
    res.json({savedAs:"hset"})
})

app.get("/user/:id/hset",async(req,res)=>{
    const user=redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user})
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})

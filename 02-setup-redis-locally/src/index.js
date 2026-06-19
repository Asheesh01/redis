import express from "express"
import Redis from "ioredis"
import mongoose from "mongoose"

const app=express();
const redis=new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});
app.get('/redis',async(req,res)=>{
    const reply=await redis.ping();
    res.json({redis:reply})
})

app.get('/mongo',async(req,res)=>{
    const url=process.env.MONGO_URL || 'mongodb://localhost:27017/chai_aur_redis';

    if(mongoose.connection.readyState===0){
        await mongoose.connect(url)
    }
    res.json({mongo:"connected",database:mongoose.connection.db.databaseName})
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})
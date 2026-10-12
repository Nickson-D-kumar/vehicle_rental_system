import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {createProxyMiddleware} from 'http-proxy-middleware';
const app=express();
app.use(helmet());
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:40,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many attempts. Try again in 15 minutes.'}}));
app.use(createProxyMiddleware({target:process.env.FLASK_URL||'http://127.0.0.1:5000',pathFilter:'/api',changeOrigin:true,on:{error:(err,req,res)=>{res.writeHead(502,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Flask API is unavailable. Start the backend.'}));}}}));
app.use((req,res)=>res.status(404).json({error:'Not found'}));
app.listen(Number(process.env.PORT || 4000), '0.0.0.0', () => {
console.log('Express gateway running on port ' + (process.env.PORT || 4000));
});

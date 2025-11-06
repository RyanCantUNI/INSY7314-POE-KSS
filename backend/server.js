

//alot of the scripting tricks was learnt through this program: https://github.com/mostafakamal22/Sprints-MERN-E-Banking-System/blob/main/package.json


//using 443 for the https standard 
const port = 443

//plugins
import http from "https";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

//define server app
const app  = express();

//modules to go here
import connectToDatabase from "./DB/db.js";
import logs from "./Payments/logs.js";
import payments from "./Payments/payment.js";
import register from "./Auth/register.js"

import login from "./User/login.js";


//connection handlers
import limter from "./cors/ratelimiter.js"
import  {corsDevOptions,corsProOptions} from "./cors/corsConf.js";


app.use(express.json());




//setting server to use json parser
app.use(express.json());


app.use(register);
app.use(login);
app.use(payments);
app.use(logs);  

//configure security 
app.use(helmet());


//configure https credentials using 5 steps to make sonar cube happy 
const _getprivate = process.env.PRIVATE_KEY_PATH;
const _getcert = process.env.CERTIFICATE_PATH;




//configure server to use https
const server = http.createServer(
{
 key: fs.readFileSync(_getprivate, "utf8"),
    cert: fs.readFileSync(_getcert, "utf8"),
},
app
)
app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});

//cors middleware
app.use(limter);
app.use(cors(corsDevOptions));


//setting up x-frame for clickjacking and cross site scripting
//taken from: https://helmetjs.github.io/#x-frame-options
// app.use(
//     helmet(
//         {
//             xFrameOptions:
//             {
//                 action: "sameorigin"
//             }
//         }
//     )
// )


//app.use(cors())
server.listen(port, () => console.log(`Server listening on port ${port}`));


//connect to db once server is running 
connectToDatabase();

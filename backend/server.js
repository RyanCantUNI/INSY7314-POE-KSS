
//using 443 for the https standard 
const port = 443

//plugins
import http from "https";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";

//modules to go here
import {connectToDatabase} from "./DB/db.js";
import makePayment from "./Payments/payment.js"
import getlogs from "./Payments/logs.js"
import login from "./Auth/login.js"
import register from "./Auth/register.js"
import manageUsers from "./routes/managerUsers.js";


app.use("/api/manager", manageUsers);

//define server app
const app  = express();

//test


//setting server to use json parser
app.use(express.json());

//user modules here
app.use(makePayment);
app.use(getlogs);

app.use(login);
app.use(register);

//configure security 
app.use(helmet());

//configure server to use https
const server = http.createServer(
{
    key: fs.readFileSync("../key/privatekey.pem"),
    cert: fs.readFileSync("../key/certificate.pem"),
},
app
)
app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});


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

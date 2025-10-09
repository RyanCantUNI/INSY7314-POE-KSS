
//using 443 for the https standard 
const port = 443

//plugins

import https from "https";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";

//modules to go here


//define server app
const app  = express();

//setting server to use json parser
app.use(express.json());

//use modules here

//configure security 
app.use(helmet());
app.use(cors());

//configure server to use https
const server = https.createServer(
{
    key: fs.readFileSync("../key/key.pem"),
    cert: fs.readFileSync("../key/certificate.pem"),
},
app
)

//setting up x-frame for clickjacking and cross site scripting
//taken from: https://helmetjs.github.io/#x-frame-options
app.use(
    helmet(
        {
            xFrameOptions:
            {
                action: "sameorigin"
            }
        }
    )
)

server.listen(port, () => console.log(`Server listening on port ${port}`));

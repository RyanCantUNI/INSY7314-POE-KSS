import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { client } from "../DB/db.js";


const app = express();

// Middleware
app.use(bodyParser.json());

//db collection
let collection = client.db("APDS").collection("users");

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await collection.findOne({ email: email });
        if (!user) {
            return res.status(401).send("Ensure name and password are correct.");
        }
        else{
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Ensure name and password are correct.");
        }
        else {
            //get UUID from db for token
            const tokenID = user.UUID;
            console.log(tokenID);
            const token = jwt.sign({tokenID}, "User token", { expiresIn: '2h' });
            res.status(200).send("Successfully logged in");
            console.log(token);
        }
        }
    }
    catch (error) {
        console.error(error);
        res.status(401).send("Failed login attempt.");
    }
})

export default app;
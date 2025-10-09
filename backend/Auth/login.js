import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(bodyParser.json());

// Login route
app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await collection.findOne({ name: name });
        if (!user) {
            return res.status(401).send("Ensure name and password are correct.");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Ensure name and password are correct.");
        }
        else {
            const token = jwt.sign({ name: name }, "User token", { expiresIn: '2h' });
            res.status(200).send("Successfully logged in");
            console.log(token);
        }
    } catch (error) {
        console.error(error);
        res.status(401).send("Failed login attempt.");
    }
})

export default app;
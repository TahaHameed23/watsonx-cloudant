import express from "express";
import morgan from "morgan";
import cors from "cors";

import { registerUser, authUser } from "./cloudant.js";
const app = express();

app.use(cors());
app.use(express.json({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json("Hello World!");
});

app.post("/", (req, res) => {
    res.json(req.body);
});

app.post("/login", (req, res) => {
    authUser(req.body, res);
    // res.redirect("/");
});

app.post("/signup", (req, res) => {
    registerUser(req.body).then((response) => {
        res.json(response);
    });
});

app.get("/webhooks", (req, res) => {
    res.json("Hello World!");
});

export default app;

import express from "express";
import dotenv from "dotenv";
import Passport  from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import pg from "pg";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render('home.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.get('/login', (req, res) => {   
    res.render('login.ejs');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
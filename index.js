import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import session from "express-session";
import  passport  from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const saltRounds = 10;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session
    ({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

// GET ROUTES

app.get("/", (req, res) => {
    res.render('home.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.get('/login', (req, res) => {   
    res.render('login.ejs');
});

app.get('/batman', (req, res) => {
    req.isAuthenticated() ? res.render('batman.ejs') : res.redirect('/login');
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

app.get('/auth/google/gradit', passport.authenticate('google', {
    successRedirect: '/batman',
    failureRedirect: '/login'
}));

// POST ROUTES

app.post('/register', async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try{
        const queryCheck = `SELECT * FROM users WHERE email = '${email}'`;
        const resultCheck = await db.query(queryCheck);
        if (resultCheck.rows.length > 0) {
            res.send('User already exists');
            return;
        }
        const HashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `INSERT INTO users (email, password) VALUES ('${email}', '${HashedPassword}') RETURNING *`;
        const result= await db.query(query);
        const user = result.rows[0];
        req.login(user, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/batman');
        });
    }catch(err){
        console.log(err);
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/batman',
    failureRedirect: '/login'
}));

passport.use("local",new Strategy(
    async (username, password, cb) => {
        try{
            const query = `SELECT * FROM users WHERE email = '${username}'`;
            const result = await db.query(query);
            if (result.rows.length === 0) {
                return cb(null, false);
            }
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return cb(null, user);
            } else {
                return cb(null, false);
            }
        }catch(err){
            console.log(err);
        }
    }
));

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, cb) => {
        try{
            const queryCheck = `SELECT * FROM users WHERE email = '${profile.email}'`;
            const resultCheck = await db.query(queryCheck);
            if (resultCheck.rows.length > 0) {
                return cb(null, resultCheck.rows[0]);
            }
            const query = `INSERT INTO users (email,password) VALUES ('${profile.email}','google') RETURNING *`;
            const result = await db.query(query);
            const user = result.rows[0];
            return cb(null, user);
        }catch(err){
            console.log(err);
        }
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
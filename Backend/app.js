const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const User = require("./model/user");
const Mechanic = require("./model/mechanic");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const dotenv = require("dotenv");
const user=require("./routes/user");
const mechanic=require("./routes/mechanic");

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 20 * 24 * 60 * 60 * 1000,
        maxAge: 20 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Custom authentication strategy for both Users and Mechanics
passport.use(
    "user-local",
    new LocalStrategy(User.authenticate())
);
passport.use(
    "mechanic-local",
    new LocalStrategy(Mechanic.authenticate())
);

// Serialize & Deserialize Users and Mechanics separately
passport.serializeUser((entity, done) => {
    done(null, { id: entity.id, type: entity.constructor.modelName });
});

passport.deserializeUser(async (obj, done) => {
    try {
        if (obj.type === "User") {
            const user = await User.findById(obj.id);
            done(null, user);
        } else if (obj.type === "Mechanic") {
            const mechanic = await Mechanic.findById(obj.id);
            done(null, mechanic);
        } else {
            done(new Error("Unknown user type"));
        }
    } catch (err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use("/user",user);
app.use("/mechanic",mechanic);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

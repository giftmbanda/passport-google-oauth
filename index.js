const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
//const GOOGLE = require("./config/KEYS");

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.get("/", function (req, res) {
  res.render("auth");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));


/*  PASSPORT SETUP  */
app.use(passport.initialize());
app.use(passport.session());
app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


/*  Google AUTH  */
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE.CLIENT_ID, //replace this with your GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE.CLIENT_SECRET, //replace this with your GOOGLE_CLIENT_SECRET
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  (req, res) => {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);

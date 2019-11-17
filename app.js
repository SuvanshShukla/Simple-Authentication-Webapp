var app = require("express")(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User= require("./models/user"),
passportLocalMongooe = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/simple-auth");


app.use(require("express-session")({
    secret: "This is the secret pass-phrase",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); /* ###encodes the data */
passport.deserializeUser(User.deserializeUser());   /* ###decodes the data  */ 

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/secret",isloggedIN, function(req, res) {
  res.render("secret");
});

app.get("/register", function(req, res) {
    res.render("registerForm");
  });

app.post("/register", function(req, res) {
    // res.render("");
    var fusername = req.body.username;
    var fpassword = req.body.password; 
    User.register(new User({username: fusername}), fpassword, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secret");
        })
    });
});

app.get("/login", function(req, res) {
    res.render("loginForm");
});

//OKK passport.authenticate is the middleware

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
}) ,function(req, res) {
    // res.render("");
    var fusername = req.body.username;
    var fpassword = req.body.password; 
});


app.get("/logout", function(req, res) {
    req.logout();
    res.render("home");
});

function isloggedIN(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen("3000", () => {
  console.log("server has started............");
});

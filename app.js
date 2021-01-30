if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET);
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const joi = require('joi');
const flash = require('connect-flash')
const catchAsync = require("./utils/catchAsync");
const methodOverride = require('method-override');
const CampGround = require('./models/campgrounds');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const { join } = require('path');
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const { MongoStore } = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/myCamp';
const MongoDBStore = require('connect-mongo')(session);
// mongodb://localhost:27017/myCamp
// DB_URL = "mongodb+srv://viveklad:27vivek1995@cluster0.mtfhu.mongodb.net/<dbname>?w=majority&retryWrites=true"
const secret = process.env.SECRET;
// console.log(dbUrl);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600
});

store.on("error", function (e) {
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log("currentUser is ", res.locals.currentUser);
    next();
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.render('home')
});

app.get("/makeCampGround", catchAsync(async (req, res) => {
    const camp = new CampGround({ title: 'My yard' });
    await camp.save();
    res.send(camp);
}))




app.use('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went Wrong!'
    res.status(statusCode);
    // console.log(err);
    res.render('error', { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("serving on port", port);
});
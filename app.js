const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const catchAsync = require("./utils/catchAsync");
const methodOverride = require('method-override');
const CampGround = require('./models/campgrounds');
const ExpressError = require('./utils/ExpressError');
const { join } = require('path');
const { campgroundSchema } = require('./schema')
mongoose.connect('mongodb://localhost:27017/myCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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

const validateCampground = (req, res, next) => {


    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
        next();
}

app.get("/", (req, res) => {
    res.render('home')
});

app.get("/makeCampGround", catchAsync(async (req, res) => {
    const camp = new CampGround({ title: 'My yard' });
    await camp.save();
    res.send(camp);
}))

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findByIdAndUpdate(id, { title: req.body.campground.title, location: req.body.campground.location, price: req.body.campground.price, description: req.body.campground.description, image: req.body.campground.image });
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.use('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went Wrong!'
    res.status(statusCode);
    res.render('error', { err });
});
app.listen(3000, () => {
    console.log("serving on port 3000");
});
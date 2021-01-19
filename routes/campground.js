const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/campgrounds');
const Review = require('../models/review')
const { campgroundSchema, reviewSchema } = require('../schema')
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {


    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
        next();
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new');
})
router.post('/', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash('success', "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await CampGround.findByIdAndUpdate(id, { title: req.body.campground.title, location: req.body.campground.location, price: req.body.campground.price, description: req.body.campground.description, image: req.body.campground.image });
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/campgrounds');
const Review = require('../models/review')
const { campgroundSchema, reviewSchema } = require('../schema');
const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware');



router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    console.log("Hello from delete")
    const { id, reviewId } = req.params;
    await CampGround.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate();
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports = router;
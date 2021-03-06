const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');
const Attraction = require('../models/attractions');
const Review = require('../models/review')
const { attractionSchema, reviewSchema } = require('../schema');
const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

module.exports = router;
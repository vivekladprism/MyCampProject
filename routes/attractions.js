const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/attractions');
const Review = require('../models/review')
const { attractionSchema, reviewSchema } = require('../schema')
const { isLoggedIn, isAuthor, validateAttraction } = require('../middleware');
const attractions = require('../controllers/attractions')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route("/")
    .get(catchAsync(attractions.index))
    .post(isLoggedIn, upload.array('image'), validateAttraction, catchAsync(attractions.createAttraction));

router.get('/new', isLoggedIn, attractions.renderNewForm)

router.route("/:id")
    .get(catchAsync(attractions.showAttraction))
    .put(isLoggedIn, isAuthor, validateAttraction, catchAsync(attractions.updateAttraction))
    .delete(isLoggedIn, isAuthor, catchAsync(attractions.deleteAttraction));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(attractions.renderEditForm))


module.exports = router;
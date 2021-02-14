const Attraction = require('../models/attractions');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const attraction = await Attraction.findById(req.params.id).populate();
    const review = new Review(req.body.review)
    review.author = req.user._id;
    attraction.reviews.push(review)
    await review.save()
    await attraction.save()
    res.redirect(`/attractions/${attraction._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Attraction.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/attractions/${id}`);
}
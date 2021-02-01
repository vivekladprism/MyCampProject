const joi = require('joi');

module.exports.attractionSchema = joi.object({
    attraction: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required()
    }).required(),
    deleteImages: joi.array()
});

module.exports.reviewSchema = joi.object(
    {
        review: joi.object({
            rating: joi.number().required(),
            body: joi.string().required()
        }).required()
    }
)
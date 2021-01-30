const { ref } = require('joi');
const Review = require('./review')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    this.url.replace('/upload/', '/upload/w_200/');
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, ref: 'Review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    // this.url.replace('/upload/', '/upload/w_200/');
    return { id: this.id, location: this.location, title: this.title };
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
module.exports = mongoose.model('Campground', campgroundSchema)

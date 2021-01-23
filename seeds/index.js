const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://localhost:27017/myCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Campground({
            author: '600270e5f96728496c30eb86',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "asfanksgnkaf afnskdjngsdk ngsd snfk sdfnksd",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/p2vcloud/image/upload/v1611179132/P2V/evhsutmor2nu42vbznqw.jpg',
                    filename: 'P2V/evhsutmor2nu42vbznqw'
                },
                {
                    url: 'https://res.cloudinary.com/p2vcloud/image/upload/v1611179132/P2V/pql38ieotedz4z8jk9tl.jpg',
                    filename: 'P2V/pql38ieotedz4z8jk9tl'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
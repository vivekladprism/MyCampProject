const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const CampGround = require('./models/campgrounds');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", (req, res) => {
    res.render('home')
});

app.get("/makeCampGround", async (req, res) => {
    const camp = new CampGround({ title: 'My yard' });
    await camp.save();
    res.send(camp);
})
app.listen(3000, () => {
    console.log("serving on port 3000");
});
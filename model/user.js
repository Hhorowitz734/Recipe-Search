const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    deck: {
        cardList: [{
            Name: {type: String},
            Image: {type: String},
            Mealtype: {type: Array},
            Cuisinetype: {type: Array},
            Dishtype: {type: Array},
            Calories: {type: Number},
            Link: {type: String}
        }]
    }
}, {collection: 'users'})

const model = mongoose.model('userSchema', userSchema)

module.exports = model;
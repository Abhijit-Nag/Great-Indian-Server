const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        min: 5,
        max: 20,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        min: 5,
        max: 20,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 5,
        max: 20,
    },
    password: {
        type: String,
        required: true,
        trim: true,

    },
    phone: {
        type: String,
        required: true
    },
    address:[Object],
    boughtProduct: [Object],
    cartProduct: [{
        id: String,
        url: String,
        detailUrl: String,
        title: Object,
        price: Object,
        quantity: Number,
        description: String,
        discount: String,
        tagline: String
    }]

});
module.exports = new mongoose.model("User", userSchema);
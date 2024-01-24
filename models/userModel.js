const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    score: {
        html: {
            type: Number
        },
        node: {
            type: Number
        },
        css: {
            type: Number
        },
        javascript: {
            type: Number
        },
    },
    blacklist : {
        type: Array,
        default: [],
    }
}, {timestamps: true})

const myModel = mongoose.model("user", mySchema)

module.exports = myModel
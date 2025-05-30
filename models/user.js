const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: false },
    verified: Boolean
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
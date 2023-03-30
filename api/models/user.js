const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true},
    uuid: {type: String, required: true}
})

module.exports = mongoose.model('User', userSchema)
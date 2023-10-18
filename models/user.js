const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    is_member: {
        type: Boolean,
        required: true,
    },
});

userSchema.virtual('name').get(function() {
    return `${this.first_name} ${this.last_name}`;
});

userSchema.virtual('url').get(function() {
    return `/users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);
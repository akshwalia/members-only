const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

messageSchema.virtual('url').get(function() {
    return `/messages/${this._id}`;
});

module.exports = mongoose.model('Message', messageSchema);
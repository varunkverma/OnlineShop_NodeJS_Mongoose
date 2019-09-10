const mongoose = require('mongoose');

// import Schema constructor
const Schema = mongoose.Schema;

// create a new Schema instance. Define the schema.
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    imageUrl: {
        type: String,
        required:true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
// Schema is just a blueprint

// Mongoose also allows to create models. And models are used to manipulate collections in the code.

module.exports = mongoose.model('Product', productSchema);

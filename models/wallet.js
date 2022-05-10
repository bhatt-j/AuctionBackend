const mongoose = require('mongoose')
const Schema = mongoose.Schema

const walletSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model("wallet", walletSchema);
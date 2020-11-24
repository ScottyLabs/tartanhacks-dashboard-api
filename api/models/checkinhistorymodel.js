const mongoose = require('mongoose');

const checkinHistorySchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: String, required: true},
    checkin_item_id: {type: String, required: true},
    timestamp: {type: String, required: true}

});

module.exports = mongoose.model('CheckinHistory', checkinHistorySchema);
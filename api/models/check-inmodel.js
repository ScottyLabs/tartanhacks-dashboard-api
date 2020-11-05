const mongoose = require('mongoose');

const checkInSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: true},
    date: { type: String, required: true},
    lat: { type: Number, required: false},
    lng: { type: Number, required: false},
    available_units: { type: Number, required: true},
    checkin_limit: { type: Number, required: true},
    access_code: { type: Number, required: true},
    active_status: { type: Number, required: true},

    user_id: { type: String, required: true},
    check_in_item_id: { type: String, required: true},
    timestamp: { type: String, required: true}

});

module.exports = mongoose.model('Check-In Items and History', checkInSchema);
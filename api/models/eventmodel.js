const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: true},
    timestamp: { type: String, required: true},
    zoom_access_enabled: { type: Boolean, required: true},
    gcal_event_url: { type: String, required: true},
    zoom_link: { type: String, required: false},
    is_in_person: { type: Boolean, required: true},
    access_code: { type: Number, required: false},
    zoom_id: { type: String, required: false},
    zoom_password: { type: String, default: 1, required: false}

});

module.exports = mongoose.model('Events', eventsSchema);
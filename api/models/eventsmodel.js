const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: false},
    timestamp: { type: String, required: true},
    zoom_access_enabled: {type: Boolean, default: false, required: true},
    gcal_event_url: { type: String, required: false},
    zoom_link: {type:String, required: false},
    is_in_person: {type: Boolean, default: false, required: true},
    access_code: {type: Number, required: true},
    zoom_id: {type:String, required: false},
    zoom_password: {type: String, required: false},
    created_at:{type:String,required:true}

});

module.exports = mongoose.model('Events', eventsSchema);
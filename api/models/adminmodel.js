const mongoose = require('mongoose');

const adminsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    email: { type: String, required: true},
    dp_url: { type: String, required: false},
    create_time: { type: String, required: false},
    creator_id: { type: String, required: true},
    password: { type: String, required: true},
    is_active: { type: Boolean, required: true},
    is_on_mobile: { type: Boolean, default: false, required: true},
    github_profile_url: { type: String, required: false},
    zoom_auth: { type:String, required: false},
    last_login_time: { type: String, required: false},
    resume_url: { type:String, required: false},
    bio: { type:String, required: false}

});

module.exports = mongoose.model('Admins', adminsSchema);
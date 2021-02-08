const mongoose = require('mongoose');

const participantsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    email: { type: String, required: true},
    reg_system_id: { type: String, required: true},
    team_id: { type: String, required: false},
    dp_url: { type: String, required: false},
    is_active: {type:Boolean, required: true},
    is_on_mobile: {type: Boolean, default: false, required: true},
    github_profile_url: {type: String, required: false},
    zoom_auth: {type:String, required: false},
    last_login_time: {type: String, required: false},
    resume_url: {type:String, required: false},
    bio: {type:String, required:false},
    account_creation_time: {type: String, required: true},
    is_admin: {type: Boolean, default: false, required: true},
    total_points:{type: Number, default: 0, required: true}

});

module.exports = mongoose.model('Participants', participantsSchema);
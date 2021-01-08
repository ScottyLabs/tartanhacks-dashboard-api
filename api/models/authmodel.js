const mongoose = require('mongoose');

const authSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    access_token: { type: String, required: true},
    user_id: { type: String, required: true},
    last_login_time: { type: String, required: true},
    is_admin: { type: Boolean, required: true}
});

module.exports = mongoose.model('Auth', authSchema);
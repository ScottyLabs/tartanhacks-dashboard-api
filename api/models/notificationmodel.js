const mongoose = require('mongoose');

const notificationsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true},
    message: { type: String, required: true},
    recipients: { type: Number, required: true},
    on_discord: { type: Boolean, required: true},
    on_mobile: { type: Boolean, required: true},
    on_web: { type: Boolean, required: true}

});

module.exports = mongoose.model('Notifications', notificationsSchema);
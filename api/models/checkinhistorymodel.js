const mongoose = require('mongoose');
const Participants = require('../models/participantmodel');
const Checkin = require('../models/checkinmodel');


const checkinHistorySchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    timestamp: {type: String, required: true},
    user: {type:mongoose.Schema.Types.ObjectId,ref:'Participants', required: true},
    checkin_item: {type:mongoose.Schema.Types.ObjectId,ref:'Checkin', required: true},

});

module.exports = mongoose.model('CheckinHistory', checkinHistorySchema);
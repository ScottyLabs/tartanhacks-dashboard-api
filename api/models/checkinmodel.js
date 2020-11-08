const mongoose = require('mongoose')

const checkinSchema = mongoose.Schema({

    _id: mongooose.Scheme.Types.ObjectId,
    name: {type: String, required: true},
    desc: {type: String, required: true},
    date: {type: String, required: true},
    lat: {type: Number, required: false}, 
    long: {type: Number, required: false},
    units: {type: Number, required: false}, 
    checkin_limit: {type: Number, required: false, default: 1},
    access_code: {type: Number, required: true},
    active_status: {type: Number, required: true}
});

module.exports = mongoose.model('Checkin', checkinScheme);
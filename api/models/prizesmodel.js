const mongoose = require('mongoose');

const prizesSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: true},
    eligibility_criteria: { type: String, required: true},
    provider: { type: String, required: false},
    contestants:{type:Number, requires: true},
    winner:{type:mongoose.Schema.Types.ObjectId,ref:'Projects', required: false},
    is_active:{type:Boolean, required: true}

});

module.exports = mongoose.model('Prizes', prizesSchema);
const mongoose = require('mongoose');
const Prizes = require('../models/prizesmodel');

const projectsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: false},
    github_repo_url: { type: String, required: false},
    slides_url: { type: String, required: false},
    video_url: { type: String, required: false},
    team_id: {type:String, required: true},
    status: {type:Number, required: true},
    eligible_prizes:[{type:mongoose.Schema.Types.ObjectId,ref:'Prizes'}]
});

module.exports = mongoose.model('Projects', projectsSchema);
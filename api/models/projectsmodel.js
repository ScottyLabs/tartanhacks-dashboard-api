const mongoose = require('mongoose');

const projectsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: false},
    github_repo_url: { type: String, required: false},
    slides_url: { type: String, required: false},
    video_url: { type: String, required: false},
    team_id: {type:Number, required: true},
    status: {type:Number, required: true}
});

module.exports = mongoose.model('Projects', projectsSchema);
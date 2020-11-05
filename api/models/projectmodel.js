const mongoose = require('mongoose');

const projectsSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: true},
    github_repo_url: { type: String, required: true},
    slides_url: { type: String, required: false},
    youtube_video_url: { type: String, required: false},
    status: { type: Number, default: 1, required: true},
    team_id: { type: String, required: true}

});

module.exports = mongoose.model('Projects', projectsSchema);
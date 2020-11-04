const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Participants = require('../models/participantmodel');

router.get('/', (req, res, next)=>{
    const participant = new Participants({
        _id: new mongoose.Types.ObjectId(),
        name: "Scotty",
        email: "scotty@scottylabs.org",
        reg_system_id: "1",
        is_active: true,
        bio: "Hi"
    });
    participant.save()
        .then(result =>{
            console.log(result);
            res.status(200).json({
                message:"Successfully saved New Content",
                createdPost:participant
            });
        })
        .catch(err=>{
            res.status(500).json({
                message: "Error saving participant",
                error: err
            });
        });

});

module.exports = router;
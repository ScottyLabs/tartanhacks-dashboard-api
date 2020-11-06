const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Participants = require('../models/participantmodel');

router.post('/new', (req, res, next)=>{

    const name = req.body.name;
    const email = req.body.email;
    const regSystemId = req.body.reg_system_id;
    const teamId = req.body.team_id;
    const dpUrl = req.body.dp_url;
    const githubProfileUrl = req.body.github_profile_url;
    const resumeUrl = req.body.resume_url;


    Participants.find({email: email})
        .then(results =>{
            if(results.length != 0){

                res.status(400).json(
                    {
                        message: "A user with this email address already exists"
                    }
                );

            }else{
                const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();

                const participant = new Participants({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    reg_system_id: regSystemId,
                    team_id: teamId,
                    dp_url: dpUrl,
                    is_active: true,
                    is_on_mobile: false,
                    github_profile_url: githubProfileUrl,
                    resume_url: resumeUrl,
                    account_creation_time: currentTime
                });

                participant.save()
                    .then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message:"Successfully saved new participant",
                            createdPost:participant
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "We encountered an error while creating participant with e-mail "+email,
                            error: err
                        });
                    });
            }
        })
        .catch(err=>{
        res.status(500).json({
            message: "We encountered an error while creating participant with e-mail "+email,
            error: err
        });
    });

});

module.exports = router;
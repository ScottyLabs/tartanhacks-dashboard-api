const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Participants = require('../models/participantmodel');

/**
 * @swagger
 * tags:
 *  name: Participants Module
 *  description: Endpoints to manage THD user data.
 */

//Create participants endpoint - /participant/new

/**
 * @swagger
 * /participants/new:
 *   post:
 *     summary: Add a new participant
 *     tags: [Participants Module]
 *     description: Adds participant to database. Assumes that participant already exists in the registration system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               reg_system_id:
 *                 type: string
 *                 description: The user's ID on the registration system.
 *               team_id:
 *                 type: string
 *                 description: ID from the teams table.
 *               dp_url:
 *                 type: string
 *                 description: URL to user's display picture.
 *               github_profile_url:
 *                 type: string
 *                 description: URL to user's github profile.
 *               resume_url:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *          description: Success.
 *       400:
 *          description: A user with this email address already exists.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/new', (req, res, next)=>{

    const name = req.body.name;
    const email = req.body.email;
    const regSystemId = req.body.reg_system_id;
    const teamId = req.body.team_id;
    const dpUrl = req.body.dp_url;
    const githubProfileUrl = req.body.github_profile_url;
    const resumeUrl = req.body.resume_url;
    const isAdmin = req.body.is_admin;


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
                    account_creation_time: currentTime,
                    is_admin: isAdmin
                });

                participant.save()
                    .then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message:"Successfully saved new participant",
                            participantInfo:participant
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

//Get participants endpoint - /participant/get

/**
 * @swagger
 * /participants/get:
 *   post:
 *     summary: Retrieve a list of Participants
 *     tags: [Participants Module]
 *     description: Searches participant database and retrieves list of participants. Specify optional search parameters in request body
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The user's ID.
 *               name:
 *                 type: string
 *                 description: The user's name.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               reg_system_id:
 *                 type: string
 *                 description: The user's ID on the registration system.
 *               team_id:
 *                 type: string
 *                 description: ID from the teams table.
 *               dp_url:
 *                 type: string
 *                 description: URL to user's display picture.
 *               is_active:
 *                 type: boolean
 *                 description: True if the participant account is active.
 *               is_on_mobile:
 *                 type: boolean
 *                 description: True if the participant account is actively using the mobile app.
 *               github_profile_url:
 *                 type: string
 *                 description: URL to user's github profile.
 *               zoom_auth:
 *                 type: string
 *                 description: Auth info for user's zoom account.
 *               last_login_time:
 *                 type: string
 *               resume_url:
 *                 type: string
 *               bio:
 *                 type: string
 *               account_creation_time:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Participants not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/get', (req, res, next)=>{
    Participants.find(req.body)
        .then(results=>{
            if(results.length != 0){
                res.status(200).json(results);
            }else{
                res.status(404).json({
                    message: "We couldn't find any participant data that matched your query."
                });
            }
        })
        .catch(err=> {

            res.status(500).json({
                message: "We encountered an error while finding participants that matched your query.",
                error: err
            });
    });
});

//Edit participants endpoint - /participant/edit

/**
 * @swagger
 * /participants/edit:
 *   post:
 *     summary: Edit data associated with existing participant
 *     tags: [Participants Module]
 *     description: Include Participant's ID in request body along with the fields with updated data. EMail cannot be edited.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: participant's ID.
 *               name:
 *                 type: string
 *                 description: The user's name.
 *               reg_system_id:
 *                 type: string
 *                 description: The user's ID on the registration system.
 *               team_id:
 *                 type: string
 *                 description: ID from the teams table.
 *               dp_url:
 *                 type: string
 *                 description: URL to user's display picture.
 *               is_active:
 *                 type: boolean
 *                 description: True if the participant account is active.
 *               is_on_mobile:
 *                 type: boolean
 *                 description: True if the participant account is actively using the mobile app.
 *               github_profile_url:
 *                 type: string
 *                 description: URL to user's github profile.
 *               zoom_auth:
 *                 type: string
 *                 description: Auth info for user's zoom account.
 *               last_login_time:
 *                 type: string
 *               resume_url:
 *                 type: string
 *               bio:
 *                 type: string
 *               account_creation_time:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Participant not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/edit', (req, res, next)=>{

    const id = req.body._id;

    if(id === undefined){
        res.status(400).json({
            message: "Please specify the id of the participant you wish to edit"
        });
    }else{
        Participants.find({_id: id})
            .then(results => {

                if(results.length === 0){
                    res.status(404).json({
                        message: "We couldn't find records of a participant with id:"+id
                    });
                }else{
                    let participant = results[0];


                    if(req.body.name !== undefined){
                        participant.name = req.body.name;
                    }

                    if(req.body.team_id !== undefined){
                        participant.team_id = req.body.team_id;
                    }

                    if(req.body.dp_url !== undefined){
                        participant.dp_url = req.body.dp_url;
                    }

                    if(req.body.is_active !== undefined){
                        participant.is_active = req.body.is_active;
                    }

                    if(req.body.is_on_mobile !== undefined){
                        participant.is_on_mobile = req.body.is_on_mobile;
                    }

                    if(req.body.github_profile_url !== undefined){
                        participant.github_profile_url = req.body.github_profile_url;
                    }

                    if(req.body.zoom_auth !== undefined){
                        participant.zoom_auth = req.body.zoom_auth;
                    }

                    if(req.body.resume_url !== undefined){
                        participant.resume_url = req.body.resume_url;
                    }

                    if(req.body.bio !== undefined){
                        participant.bio = req.body.bio;
                    }

                    if(req.body.is_admin !== undefined){
                        participant.is_admin = req.body.is_admin;
                    }

                    participant.save()
                        .then(result =>{
                            console.log(result);
                            res.status(200).json({
                                message:"Successfully saved new information",
                                participantInfo:participant
                            });
                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: "We encountered an error while editing participant with id: "+id,
                                error: err
                            });
                        });


                }

            })
            .catch(err=>{
                res.status(500).json({
                    message: "We encountered an error while editing participant with id:  "+id,
                    error: err
                });
            });
    }


});

module.exports = router;
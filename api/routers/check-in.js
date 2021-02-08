const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Checkin = require('../models/checkinmodel');
const CheckinHistory = require('../models/checkinhistorymodel');
const Participants = require('../models/participantmodel');
const Auth = require('../models/authmodel');
const AuthHelper = require('../helpers/auth_helper');


/**
 * @swagger
 * tags:
 *  name: Check In Module
 *  description: Endpoints to manage participant check-in data.
 */


//Create check-in item endpoint - /checkin/new

/**
 * @swagger
 * /checkin/new:
 *   post:
 *     summary: Create a new Check In Item
 *     tags: [Check In Module]
 *     description: Adds a new check-in item to database. Access - Admin Users only.
 *     parameters:
 *      - in: header
 *        name: Token
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               date:
 *                 type: string
 *               lat:
 *                 type: number
 *               long:
 *                 type: number
 *               units:
 *                 type: number
 *               checkin_limit:
 *                 type: number
 *               access_code:
 *                 type: number
 *               active_status:
 *                 type: number
 *               self_checkin_enabled:
 *                 type: boolean
 *               points:
 *                  type: number
 *     responses:
 *       200:
 *          description: Success.
 *       400:
 *          Bad request.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/new', (req, res, next)=>{

    const access_token = req.header('Token');
    const adminOnly = true;
    const selfOnly = false;
    const userId = 0;
    const teamOnly = false;
    const teamId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
    .then(results=>{

        auth_res = AuthHelper(adminOnly, selfOnly, userId, results, teamOnly, teamId);

        if(auth_res.result){
            const name = req.body.name;
            const desc = req.body.desc;
            const date = req.body.date;
            const lat = req.body.lat;
            const long = req.body.long;
            const units = req.body.units;
            const limit = req.body.checkin_limit;
            const access = req.body.access_code;
            const status = req.body.active_status;
            const self_checkin_enabled = req.body.self_checkin_enabled;
            const points = req.body.points;



            console.log(name);
            Checkin.find({name: name})
                .then(results =>{
                    if(results.length != 0){

                        res.status(400).json(
                            {
                                message: "A check-in item with this name already exists"
                            }
                        );
                    }else{
                        const checkin = new Checkin({
                            _id: new mongoose.Types.ObjectId(),
                            name: name,
                            desc: desc,
                            date: date,
                            lat: lat,
                            long: long,
                            units: units,
                            checkin_limit: limit,
                            access_code: access,
                            active_status: status,
                            self_checkin_enabled: self_checkin_enabled,
                            points: points
                        });
                        console.log(checkin);
                        checkin.save()
                            .then(result =>{
                                console.log(result);
                                res.status(200).json({
                                    message: "Checkin item successfully created!",
                                    checkinInfo:checkin
                                });
                            })
                            .catch(err=>{
                                res.status(500).json({
                                    message: "Unknown error occurred while creating this checkin item.",
                                    error: err
                                });
                            });
                    }
                })
                .catch(err=>{
                    res.status(500).json({
                        message: "Unknown error occurred while creating this checkin item.",
                        error: err
                    });
                });
        }else{
            res.status(401).json({
                message: auth_res.message,
            });
        }
    })
    .catch(err=> {

        res.status(500).json({
               message: "We encountered an error while verifying your authentication token",
        });
    });


});

// Get checkin items endpoint - /checkin/get

/**
 * @swagger
 * /checkin/get:
 *   post:
 *     summary: Retrieve a list of Check-In items
 *     tags: [Check In Module]
 *     description: Searches check in item database and retrieves list of check in items. Specify optional search parameters in request body. Access - All Users.
 *     parameters:
 *      - in: header
 *        name: Token
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               date:
 *                 type: string
 *               lat:
 *                 type: number
 *               long:
 *                 type: number
 *               units:
 *                 type: number
 *               checkin_limit:
 *                 type: number
 *               access_code:
 *                 type: number
 *               active_status:
 *                 type: number
 *               self_checkin_enabled:
 *                 type: boolean
 *               points:
 *                  type: number
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/get', (req, res, next)=>{

    const access_token = req.header('Token');
    const adminOnly = false;
    const selfOnly = false;
    const userId = 0;
    const teamOnly = false;
    const teamId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
        .then(results=>{

            auth_res = AuthHelper(adminOnly, selfOnly, userId, results, teamOnly, teamId);

        if(auth_res.result){
            Checkin.find(req.body).sort('date')
                .then(results=>{
                    if(results.length != 0){
                        res.status(200).json(results);
                    }else{
                        res.status(404).json({
                            message: "No checkin items matching query."
                        });
                    }
                })
                .catch(err=> {
                    res.status(500).json({
                        message: "Unknown error occurred.",
                        error: err
                    });
                });
        }else{
            res.status(401).json({
                message: auth_res.message,
            });
        }
    })
    .catch(err=> {

        res.status(500).json({
               message: "We encountered an error while verifying your authentication token",
        });
    });


});

//Edit check items endpoint - /checkin/edit

/**
 * @swagger
 * /checkin/edit:
 *   post:
 *     summary: Edit existing Check In Items
 *     tags: [Check In Module]
 *     description: Include Check In Item ID in request body along with the fields with updated data. Access - Admin Users only.
 *     parameters:
 *      - in: header
 *        name: Token
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               date:
 *                 type: string
 *               lat:
 *                 type: number
 *               long:
 *                 type: number
 *               units:
 *                 type: number
 *               checkin_limit:
 *                 type: number
 *               access_code:
 *                 type: number
 *               active_status:
 *                 type: number
 *               self_checkin_enabled:
 *                 type: boolean
 *               points:
 *                  type: number
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: check in item not found.
 *       400:
 *          description: Bad Request.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/edit', (req, res, next)=>{

    const access_token = req.header('Token');
    const adminOnly = true;
    const selfOnly = false;
    const userId = 0;
    const teamOnly = false;
    const teamId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
        .then(results=>{

            auth_res = AuthHelper(adminOnly, selfOnly, userId, results, teamOnly, teamId);

        if(auth_res.result){
            const id = req.body._id;

            if(id === undefined){
                res.status(400).json({
                    message: "Please specify the id of the checkin item you wish to edit"
                });
            }else{
                Checkin.find({_id: id})
                    .then(results => {

                        if(results.length === 0){
                            res.status(404).json({
                                message: "We couldn't find records of a checkin item with id:"+id
                            });
                        }else{
                            let item = results[0];


                            if(req.body.name !== undefined){
                                item.name = req.body.name;
                            }

                            if(req.body.desc !== undefined){
                                item.desc = req.body.desc;
                            }

                            if(req.body.date !== undefined){
                                item.date = req.body.date;
                            }

                            if(req.body.lat !== undefined){
                                item.lat = req.body.lat;
                            }

                            if(req.body.long !== undefined){
                                item.long = req.body.long;
                            }

                            if(req.body.units !== undefined){
                                item.units = req.body.units;
                            }

                            if(req.body.checkin_limit !== undefined){
                                item.checkin_limit = req.body.checkin_limit;
                            }

                            if(req.body.access_code !== undefined){
                                item.access_code = req.body.access_code;
                            }

                            if(req.body.active_status !== undefined){
                                item.active_status = req.body.active_status;
                            }

                            if(req.body.self_checkin_enabled !== undefined){
                                item.self_checkin_enabled = req.body.self_checkin_enabled;
                            }

                            if(req.body.points !== undefined){
                                item.points = req.body.points;
                            }

                            item.save()
                                .then(result =>{
                                    console.log(result);
                                    res.status(200).json({
                                        message:"Successfully saved new information",
                                        checkinItemInfo:item
                                    });
                                })
                                .catch(err=>{
                                    res.status(500).json({
                                        message: "We encountered an error while editing the check-in item with id: "+id,
                                        error: err
                                    });
                                });


                        }

                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "We encountered an error while editing the check-in item with id: "+id,
                            error: err
                        });
                    });
            }
        }else{
            res.status(401).json({
                message: auth_res.message,
            });
        }
    })
    .catch(err=> {

        res.status(500).json({
               message: "We encountered an error while verifying your authentication token",
        });
    });




});

//Check People in for a checkin item - /checkin/user

/**
 * @swagger
 * /checkin/user:
 *   post:
 *     summary: Check a User In
 *     tags: [Check In Module]
 *     description: Checks in a user to a check in item. Access - Admin Users can check in any user for any check in item. Participants can only check themselves in for check-in items that have self check-in enabled.
 *     parameters:
 *      - in: header
 *        name: Token
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               checkin_item_id:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: check in item or user not found.
 *       400:
 *          description: Bad Request.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/user', (req, res, next)=>{

    const access_token = req.header('Token');
    let adminOnly = false;
    let selfOnly = false;
    const userId = req.body.user_id;
    const teamOnly = false;
    const teamId = 0;
    let auth_res;
    const checkin_item_id = req.body.checkin_item_id;


    Auth.find({access_token:access_token})
        .then(results=>{

            if(results.length === 0){
                res.status(401).json({
                    message:"Invalid Access Token."
                });
            }else{

                Checkin.find({_id: checkin_item_id})
                    .then(checkin_results =>{
                        if(checkin_results.length === 0){
                            res.status(404).json({
                                message: "We couldn't find records of a checkin item with id:"+checkin_item_id
                            });
                        }else{
                            if(checkin_results[0].self_checkin_enabled){
                                adminOnly = false;
                                selfOnly = true;
                            }else{
                                adminOnly = true;
                                selfOnly = false;
                            }

                            auth_res = AuthHelper(adminOnly, selfOnly, userId, results, teamOnly, teamId);
                            if(auth_res.result){
                                const user_id = req.body.user_id;


                                if(checkin_item_id === undefined || user_id === undefined){
                                    res.status(401).json({
                                        message: "Please specify the id of the checkin item and the id of the user you wish to check in"
                                    });
                                }else{
                                    Checkin.find({_id: checkin_item_id})
                                        .then(results => {

                                            if(results.length === 0){
                                                res.status(404).json({
                                                    message: "We couldn't find records of a checkin item with id:"+checkin_item_id
                                                });
                                            }else{

                                                let checkinItem = results[0];

                                                if(checkinItem.units === 0){
                                                    res.status(400).json({
                                                        message: "Checkin limit reached for checkin item with ID: "+checkin_item_id
                                                    });
                                                }else {

                                                    Participants.find({_id: user_id})
                                                        .then(participants => {

                                                            if(participants.length === 0){
                                                                res.status(404).json({
                                                                    message: "We couldn't find records of a user with id:"+user_id
                                                                });
                                                            }else {

                                                                let participant = participants[0];

                                                                CheckinHistory.find({user:user_id,checkin_item:checkin_item_id})
                                                                    .then(history =>{
                                                                        if(history.length === 0){
                                                                            checkinItem.units = checkinItem.units - 1;

                                                                            checkinItem.save()
                                                                                .then(result => {

                                                                                    const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();

                                                                                    const checkinHistoryItem = new CheckinHistory({
                                                                                        _id: new mongoose.Types.ObjectId(),
                                                                                        timestamp: currentTime,
                                                                                        checkin_item: checkinItem._id,
                                                                                        user:participants[0]._id
                                                                                    });

                                                                                    checkinHistoryItem.save()
                                                                                        .then(result => {
                                                                                            participant.total_points = participant.total_points + checkinItem.points;
                                                                                            participant.save()
                                                                                                .then(result => {

                                                                                                    res.status(200).json({
                                                                                                        message: "Successfully Checked In!",
                                                                                                    });
                                                                                                })
                                                                                                .catch(err => {
                                                                                                    res.status(500).json({
                                                                                                        message: "Unknown error occurred while checking this user in",
                                                                                                        error: err
                                                                                                    });
                                                                                                });
                                                                                        })
                                                                                        .catch(err => {
                                                                                            res.status(500).json({
                                                                                                message: "Unknown error occurred while checking this user in",
                                                                                                error: err
                                                                                            });
                                                                                        });

                                                                                })
                                                                                .catch(err => {
                                                                                    res.status(500).json({
                                                                                        message: "Unknown error occurred while checking this user in",
                                                                                        error: err
                                                                                    });
                                                                                });

                                                                        }else{
                                                                            res.status(400).json({
                                                                                message: "This user has already been checked in for this check in item."
                                                                            });
                                                                        }
                                                                    })
                                                                    .catch(err => {
                                                                        res.status(500).json({
                                                                            message: "Unknown error occurred while checking this user in",
                                                                            error: err
                                                                        });
                                                                    });


                                                            }

                                                        })
                                                        .catch(err=>{
                                                            res.status(500).json({
                                                                message: "We encountered an error while checking user with id:"+user_id+" to check in item with id:"+checkin_item_id,
                                                                error: err
                                                            });
                                                        });


                                                }
                                            }

                                        })
                                        .catch(err=>{
                                            res.status(500).json({
                                                message: "We encountered an error while checking user with id:"+user_id+" to check in item with id:"+checkin_item_id,
                                                error: err
                                            });
                                        });
                                }
                            }else{
                                res.status(401).json({
                                    message: auth_res.message,
                                });
                            }
                        }
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "We encountered an error while checking user with id:"+user_id+" to check in item with id:"+checkin_item_id,
                            error: err
                        });
                    });



            }
    })
    .catch(err=> {

        res.status(500).json({
               message: "We encountered an error while verifying your authentication token",
        });
    });




});

// Get checkin history for a participant

/**
 * @swagger
 * /checkin/history:
 *   get:
 *     summary: Get a User's Check in history
 *     tags: [Check In Module]
 *     description: Get list of check-in items that user has checked in for. Access - Admin Users can see check in history associated with any account, others can only view data tied to their own account.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: Token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: check in item not found.
 *       400:
 *          description: Bad Request.
 *       500:
 *          description: Internal Server Error.
 */

router.get('/history', (req, res, next)=>{
    const user_id = req.query.user_id;

    const access_token = req.header('Token');
    const adminOnly = false;
    const selfOnly = true;
    const userId = user_id;
    const teamOnly = false;
    const teamId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
        .then(results=>{

            auth_res = AuthHelper(adminOnly, selfOnly, userId, results, teamOnly, teamId);

        if(auth_res.result){
            if(user_id === undefined){
                res.status(400).json({
                    message: "Please specify the id of the user you wish to check in"
                });
            }else{
                Participants.find({_id:user_id})
                    .then(results=>{
                        if(results.length === 0){
                            res.status(404).json({
                                message: "We couldn't find any participants with the provided ID"
                            });
                        }else{
                            const participant = results[0];

                            CheckinHistory.find({user:user_id})
                                .populate('checkin_item')
                                .then(results2=>{


                                    res.status(200).json({
                                        user: participant,
                                        checkin_history:results2
                                    });


                                })
                                .catch(err=> {

                                    res.status(500).json({
                                        message: "BWe encountered an error while getting check-in history for the participant with ID " + user_id,
                                        error: err
                                    });
                                });

                        }
                    })
                    .catch(err=> {

                        res.status(500).json({
                            message: "We encountered an error while getting check-in history for the participant with ID " + user_id,
                            error: err
                        });
                    });
            }
        }else{
            res.status(401).json({
                message: auth_res.message,
            });
        }
    })
    .catch(err=> {

        res.status(500).json({
               message: "We encountered an error while verifying your authentication token",
        });
    });



});

/**
 * @swagger
 * /checkin/leaderboard:
 *   get:
 *     summary: Retrieve the participant leaderboard based on checkin points.
 *     tags: [Check In Module]
 *     description: Returns leaderboard based on points awarded to participants for checking in. Access - All Users.
 *     parameters:
 *      - in: header
 *        name: Token
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Not found.
 *       500:
 *          description: Internal Server Error.
 */

router.get('/leaderboard', (req, res, next)=>{

    const access_token = req.header('Token');
    const adminOnly = false;
    const selfOnly = false;
    const userId = 0;
    const teamOnly = false;
    const teamId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
        .then(results=>{

            auth_res = AuthHelper(adminOnly, selfOnly, userId, results, teamOnly, teamId);

            if(auth_res.result){
                Participants.find().sort('total_points')
                    .then(results=>{
                        res.status(200).json(results.reverse());

                    })
                    .catch(err=> {
                        res.status(500).json({
                            message: "Unknown error occurred.",
                            error: err
                        });
                    });
            }else{
                res.status(401).json({
                    message: auth_res.message,
                });
            }
        })
        .catch(err=> {

            res.status(500).json({
                message: "We encountered an error while verifying your authentication token",
            });
        });


});

module.exports = router;
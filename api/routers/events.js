const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Events = require('../models/eventsmodel');
const Auth = require('../models/authmodel');


/**
 * @swagger
 * tags:
 *  name: Events Module
 *  description: Endpoints to manage event data.
 */

//Create Events endpoint - /events/new

/**
 * @swagger
 * /events/new:
 *   post:
 *     summary: Create a new event
 *     tags: [Events Module]
 *     description: Adds event to database. Access - Admin Users only.
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
 *               description:
 *                 type: string
 *               timestamp:
 *                 type: string
 *               zoom_access_enabled:
 *                 type: boolean
 *               gcal_event_url:
 *                 type: string
 *               zoom_link:
 *                 type: string
 *               is_in_person:
 *                 type: boolean
 *               access_code:
 *                 type: number
 *               zoom_id:
 *                 type: string
 *               zoom_password:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/new', (req, res, next)=>{

    const access_token = req.header('Token');
    const adminOnly = true;
    const selfOnly = false;
    const userId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
        .then(results=>{

            auth_res = AuthHelper(adminOnly, selfOnly, userId, results);

            if(auth_res.result){
                const name = req.body.name;
                const description = req.body.description;
                const timestamp = req.body.timestamp;
                const zoom_access_enabled = req.body.zoom_access_enabled;
                const gcal_event_url = req.body.gcal_event_url;
                const zoom_link = req.body.zoom_link;
                const is_in_person = req.body.is_in_person;
                const access_code = req.body.access_code;
                const zoom_id = req.body.zoom_id;
                const zoom_password = req.body.zoom_password;

                //TODO: gcal and zoom integration

                const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();


                const event = new Events({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    description: description,
                    timestamp: timestamp,
                    zoom_access_enabled: zoom_access_enabled,
                    gcal_event_url: gcal_event_url,
                    zoom_link: zoom_link,
                    is_in_person: is_in_person,
                    access_code: access_code,
                    zoom_id: zoom_id,
                    zoom_password: zoom_password,
                    created_at:currentTime
                });

                event.save()
                    .then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message:"Successfully saved new event",
                            eventInfo:event
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "We encountered an error while creating participant with e-mail "+email,
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

//Get events endpoint - /events

/**
 * @swagger
 * /events/get:
 *   post:
 *     summary: Retrieve a list of Events
 *     tags: [Events Module]
 *     description: Searches events database and retrieves list of events. Specify optional search parameters in request body. Access - Open
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
 *               description:
 *                 type: string
 *               timestamp:
 *                 type: string
 *               zoom_access_enabled:
 *                 type: boolean
 *               gcal_event_url:
 *                 type: string
 *               zoom_link:
 *                 type: string
 *               is_in_person:
 *                 type: boolean
 *               access_code:
 *                 type: number
 *               zoom_id:
 *                 type: string
 *               zoom_password:
 *                 type: string
 *               created_at:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       404:
 *          description: Events not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/get', (req, res, next)=>{
    Events.find(req.body)
        .then(results=>{
            if(results.length != 0){
                res.status(200).json(results);
            }else{
                res.status(404).json({
                    message: "We couldn't find any event data that matched your query."
                });
            }
        })
        .catch(err=> {

            res.status(500).json({
                message: "We encountered an error while finding events that matched your query.",
                error: err
            });
        });
});

//Edit participants endpoint - /events/edit

/**
 * @swagger
 * /events/edit:
 *   post:
 *     summary: Edit existing events
 *     tags: [Events Module]
 *     description: Include Event ID in request body along with the fields with updated data. Access - Admin Users only.
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
 *               description:
 *                 type: string
 *               timestamp:
 *                 type: string
 *               zoom_access_enabled:
 *                 type: boolean
 *               gcal_event_url:
 *                 type: string
 *               zoom_link:
 *                 type: string
 *               is_in_person:
 *                 type: boolean
 *               access_code:
 *                 type: number
 *               zoom_id:
 *                 type: string
 *               zoom_password:
 *                 type: string
 *     responses:
 *       200:
 *          description: Success.
 *       400:
 *          description: Bad Request.
 *       404:
 *          description: Event not found.
 *       500:
 *          description: Internal Server Error.
 */

router.post('/edit', (req, res, next)=>{

    const id = req.body._id;

    const access_token = req.header('Token');
    const adminOnly = true;
    const selfOnly = false;
    const userId = 0;
    let auth_res;

    Auth.find({access_token:access_token})
        .then(results=>{

            auth_res = AuthHelper(adminOnly, selfOnly, userId, results);

            if(auth_res.result){
                if(id === undefined){
                    res.status(400).json({
                        message: "Please specify the id of the event you wish to edit"
                    });
                }else{
                    Events.find({_id: id})
                        .then(results => {

                            if(results.length === 0){
                                res.status(404).json({
                                    message: "We couldn't find records of an event with id:"+id
                                });
                            }else{
                                let event = results[0];


                                if(req.body.name !== undefined){
                                    event.name = req.body.name;
                                }

                                if(req.body.description !== undefined){
                                    event.description = req.body.description;
                                }

                                if(req.body.timestamp !== undefined){
                                    event.timestamp = req.body.timestamp;
                                }

                                if(req.body.zoom_access_enabled !== undefined){
                                    event.zoom_access_enabled = req.body.zoom_access_enabled;
                                }

                                if(req.body.gcal_event_url !== undefined){
                                    event.gcal_event_url = req.body.gcal_event_url;
                                }

                                if(req.body.zoom_link !== undefined){
                                    event.zoom_link = req.body.zoom_link;
                                }

                                if(req.body.is_in_person !== undefined){
                                    event.is_in_person = req.body.is_in_person;
                                }

                                if(req.body.access_code !== undefined){
                                    event.access_code = req.body.access_code;
                                }

                                if(req.body.zoom_id !== undefined){
                                    event.zoom_id = req.body.zoom_id;
                                }

                                if(req.body.zoom_password !== undefined){
                                    event.zoom_password = req.body.zoom_password;
                                }

                                //TODO: Reflect necessary changes on Zoom and GCal

                                event.save()
                                    .then(result =>{
                                        console.log(result);
                                        res.status(200).json({
                                            message:"Successfully saved new information",
                                            eventInfo:event
                                        });
                                    })
                                    .catch(err=>{
                                        res.status(500).json({
                                            message: "We encountered an error while editing the event with id: "+id,
                                            error: err
                                        });
                                    });


                            }

                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: "We encountered an error while editing the event with id:  "+id,
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

module.exports = router;
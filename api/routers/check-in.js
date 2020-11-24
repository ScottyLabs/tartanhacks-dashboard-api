const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Checkin = require('../models/checkinmodel');
const CheckinHistory = require('../models/checkinhistorymodel');


//Create check-in item endpoint - /checkin/new
router.post('/new', (req, res, next)=>{

    const name = req.body.name;
    const desc = req.body.desc;
    const date = req.body.date;
    const lat = req.body.lat;
    const long = req.body.long;
    const units = req.body.units;
    const limit = req.body.checkin_limit;
    const access = req.body.access_code;
    const status = req.body.active_status;


    console.log(name);
    Checkin.find({name: name})
        .then(results =>{
            if(results.length != 0){

                res.status(400).json(
                    {
                        message: "A checkin with this name already exists"
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
                    active_status: status
                });
                console.log(checkin);
                checkin.save()
                    .then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message: "Checkin item successfully created!",
                            checkinInfo:checkin // Not sure if this is necessary? Ask Anuda
                        });
                    })
                    .catch(err=>{
                        res.status(500).json({
                            message: "Unknown error 1 occurred while creating this checkin item.",
                            error: err
                        });
                    });
            }
        })
        .catch(err=>{
            res.status(500).json({
                message: "Unknown error 2 occurred while creating this checkin item.",
                error: err
            });
        });
});

// Get checkin items endpoint - /checkin
router.get('/', (req, res, next)=>{
    Checkin.find(req.body)
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
});

//Edit check items endpoint - /checkin/edit
router.post('/edit', (req, res, next)=>{

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


});

//Check People in for a checkin item - /checkin/user
router.post('/user', (req, res, next)=>{

    const checkin_item_id = req.body.checkin_item_id;
    const user_id = req.body.user_id;


    if(checkin_item_id === undefined || user_id === undefined){
        res.status(400).json({
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

                        checkinItem.units = checkinItem.units - 1;

                        checkinItem.save()
                            .then(result => {
                                const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();

                                const checkinHistoryItem = new CheckinHistory({
                                    _id: new mongoose.Types.ObjectId(),
                                    user_id: user_id,
                                    checkin_item_id: checkin_item_id,
                                    timestamp: currentTime
                                });

                                checkinHistoryItem.save()
                                    .then(result => {
                                        console.log(result);
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


});

// Get checkin history for a participant
// Also incomplete, same issue as above

module.exports = router;
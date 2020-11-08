const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Checkin = require('../models/checkinmodel');


//Create check-in item endpoint - /checkin/new
router.post('/new', (req, res, next)=>{

    const name = req.body.name;
    const desc = req.body.description;
    const date = req.body.date
    const lat = req.body.lat
    const long = req.body.lng
    const units = req.body.available_units
    const limit = req.body.checkin_limit
    const access = req.body.access_code
    const status = req.body.active_status

    Checkin.find({name: name})
        .then(results =>{
            if(result.length != 0){

                res.status(400).json(
                    {
                        message: "A checkin with this name already exists"
                    }
                );
            }else{
                const checkin = new Checkin({
                    _id: new mongood.Types.ObjectID(), 
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

//Check People in for a checkin item
// Incomplete, need to get a better handle on checkin history


// Get checkin history for a participant
// Also incomplete, same issue as above
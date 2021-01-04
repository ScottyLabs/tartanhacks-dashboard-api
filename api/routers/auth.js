const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const https = require('https');
const Participants = require('../models/participantmodel');

// Log In - /auth/login - POST
router.post('/login', (req, res, next)=>{

    const email = req.body.email;
    const password = req.body.password;

    Participants.find({email: email})
        .then(results =>{
            if(results.length !== 0){
                const data = JSON.stringify({
                    email: email,
                    password: password
                });
                const options = {
                    hostname: 'tartanhacks-testing.herokuapp.com',
                    port: 443,
                    path: '/auth/login',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                const req = https.request(options, response => {
                    console.log(`statusCode: ${response.statusCode}`);
                    if (response.statusCode === 200){
                        const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();
                        let p = results[0];
                        p.last_login_time = currentTime;
                        response.setEncoding('utf8');

                        response.on('data', function(chunk) {
                            p.is_admin = JSON.parse(chunk).user.admin;
                        });
                        p.save()
                            .then(result =>{
                                console.log(result);
                                res.status(200).json({
                                    participant: p
                                })
                            })
                            .catch(err=>{
                                res.status(500).json({
                                    message: "We encountered an error while logging you in.",
                                    error: err
                                });
                            });

                    }else{
                        res.status(401).json({
                            message: "Invalid login credentials."
                        })
                    }
                });
                req.write(data);
                req.end()

            }else{
                res.status(404).json({
                    message: "Participant does not exist."
                })
            }
        }).catch(err=> {

        res.status(500).json({
            message: "We encountered an error while logging you in.",
            error: err
        });
    });

});

// Forgot Password - /auth/forgot - POST - Reg System Endpoint?
router.post('/forgot', (req, res, next)=>{

    const email = req.body.email;

    // Calls reset endpoint on registration system
    Participants.find({email: email})
        .then(results =>{
            if(results.length !== 0){
                const data = JSON.stringify({
                    email: email,
                });
                const options = {
                    hostname: 'tartanhacks-testing.herokuapp.com',
                    port: 443,
                    path: '/auth/reset',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                const req = https.request(options, response => {
                    console.log(`statusCode: ${response.statusCode}`);
                    if (response.statusCode === 200){
                        res.status(200).json({
                            message: "Please check your email address("+email+") to reset your password."
                        })
                    }else{
                        res.status(401).json({
                            message: "We encountered an error while resetting your password."
                        })
                    }
                });
                req.write(data);
                req.end()

            }else{
                res.status(404).json({
                    message: "Participant does not exist."
                })
            }
        }).catch(err=> {

        res.status(500).json({
            message: "We encountered an error while resetting your password.",
            error: err
        });
    });



});

module.exports = router;
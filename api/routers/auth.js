const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const https = require('https');
const Participants = require('../models/participantmodel');

// Log In - /auth/login - POST
router.post('/login', (req, res, next)=>{

    const email = req.body.email;
    const password = req.body.password;

    // frontend sends login credentials, use reg system api to check if passed token
    Participants.find({email: email})
        .then(results =>{
            if(results.length != 0){
                const data = JSON.stringify({
                    email: email,
                    password: password
                  })
                const options = {
                    hostname: 'tartanhacks-testing.herokuapp.com',
                    port: 443,
                    path: '/auth/login',
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                const req = https.request(options, response => {
                    console.log(`statusCode: ${response.statusCode}`)
                    if (response.statusCode === 200){
                        const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();
                        let p = results[0];
                        p.last_login_time = currentTime;
                        participant.save()
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
    const password = req.body.password;

});

module.exports = router;
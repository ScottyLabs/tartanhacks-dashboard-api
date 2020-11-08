const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Participants = require('../models/participantmodel');

router.post('/login', (req, res, next)=>{

    const email = req.body.email;
    const password = req.body.password;
    const token = req.body.token;


});

router.post('/forgot', (req, res, next)=>{

    const email = req.body.email;
    const password = req.body.password;

});

module.exports = router;
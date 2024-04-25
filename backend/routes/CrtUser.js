const express = require('express');
const router = express.Router()

const User = require('../models/Users');
const Status = require('../models/DriverStatus');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.../.env') });

const jwtSecret = process.env.JWT_SECRET;

router.post('/createuser', [

    body('email').isEmail(),
    body('password').isLength({ min: 5 })

],
    async (req, res) => {

        console.log(jwtSecret);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        try {
            let checkIt = await User.findOne({ email: req.body.email });

            if(checkIt){
                return res.status(400).json({ errors: 'You are already a user.' });
            }

            await User.create({
                usertype: req.body.usertype,
                name: req.body.name,
                email: req.body.email,
                password: secPass,
                chatids: []
            })

            let userData = await User.findOne({ email: req.body.email });

            if (req.body.usertype === 'Driver') {
                await Status.create({
                    availability: 'Busy',
                    location: '0',
                    vtype: '0',
                    seats: '0',
                    driverId: userData._id
                })
            }

            const newData = {
                User: {
                    id: userData.id
                }
            }

            const newAuthToken = jwt.sign(newData, jwtSecret)

            res.json({ success: true, authToken: newAuthToken });
        }
        catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    })


router.post('/loginuser', async (req, res) => {

    try {

        let userData = await User.findOne({ usertype: req.body.usertype, email: req.body.email });

        if (!userData) {
            return res.status(400).json({ errors: 'Try logging with correct credentials' });
        }

        const passwordCmp = await bcrypt.compare(req.body.password, userData.password);

        if (!passwordCmp) {
            return res.status(400).json({ errors: 'Try logging with correct credentials' });
        }

        const data = {
            User: {
                id: userData.id
            }
        }

        const authToken = jwt.sign(data, jwtSecret)

        res.json({ success: true, authToken: authToken });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

router.post('/extractUserData', [], async (req, res) => {
    const token = req.body.authToken;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userData = await User.findById(decoded.User.id);
        return res.json({ success: true, userName : userData.name, userEmail : userData.email, userType : userData.usertype, userId: userData.id });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports = router; 
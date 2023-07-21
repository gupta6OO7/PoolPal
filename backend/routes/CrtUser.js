const express = require('express');

const router = express.Router()

const User = require('../models/Users');

const Status = require('../models/DriverStatus');

const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const jwtSecret = "YeForPres"

router.post('/createuser', [

    body('email').isEmail(),
    body('password').isLength({ min: 5 })

],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        try {
            let checkIt = await User.findOne({ usertype: req.body.usertype, email: req.body.email });

            if(checkIt){
                return res.status(400).json({ errors: 'You are already a user.' });
            }

            await User.create({
                usertype: req.body.usertype,
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            if (req.body.usertype === 'Driver') {
                await Status.create({
                    availability: 'Busy',
                    location: '0',
                    vtype: '0',
                    seats: '0',
                    username: req.body.name,
                    mailId: req.body.email
                })
            }

            let userData = await User.findOne({ usertype: req.body.usertype, email: req.body.email });

            const newData = {
                User: {
                    id: userData.id
                }
            }

            const newAuthToken = jwt.sign(newData, jwtSecret)

            res.json({ success: true, authToken: newAuthToken, name: userData.name, mailId: userData.email });
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

        res.json({ success: true, authToken: authToken, name: userData.name, mailId: userData.email });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false });
    }
})

module.exports = router; 
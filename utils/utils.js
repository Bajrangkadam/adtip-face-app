const { reject } = require("underscore");
let config = require("../config/appconfig.json");
const request = require('request');
const admin = require('./firebase-config');
module.exports = {
    sendOtp: (mobileNumber, otp) => new Promise((resolve, reject) => {
        let options = {
            'method': 'POST',
            'url': `https://api.kaleyra.io/v1/${config.kaleyra.ACCOUNT_SID}/messages`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'api-key': config.kaleyra.AUTH_TOKEN
            },
            form: {
                'to': mobileNumber,
                'type': 'OTP',
                'sender': 'KLRHXA',
                'body': 'ADtip Verification code : ' + otp
            }
        };
        //resolve({"body":"ADtip Verification code : 427350","sender":"KLRHXA","type":"OTP","source":"API","id":"d0b238ef-0dd5-4c82-8b9b-ec22b1f6040e","createdDateTime":"2022-11-23 15:10:53+00:00","totalCount":1,"data":[{"message_id":"d0b238ef-0dd5-4c82-8b9b-ec22b1f6040e:1","recipient":"917499623342"}],"error":{}})
        request(options, (error, response) => {
            if (error) reject(error);
            console.log(response.body);
            if (response && typeof response.body == 'string') {
                resolve(JSON.parse(response.body));
            } else {
                resolve(response.body);
            }
        });
    }),
    checkId: (req, res, next) => {
        if (!req.body.id) return res.status(400).send({ status: 400, message: "Id not found.", data: [req.body] });
        next();
    },
    sendNotification: (registrationToken, message) => new Promise((resolve, reject) => {
        //const  registrationToken = req.body.registrationToken
        //const message = req.body.message
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        admin.messaging().sendToDevice(registrationToken, message, options)
            .then(response => {
                resolve(response);
                //res.status(200).send("Notification sent successfully"+response)

            })
            .catch(error => {
                console.log(error);
                reject(error);
            });

    })
}
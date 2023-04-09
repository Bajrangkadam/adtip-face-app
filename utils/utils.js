const FCM = require('fcm-node');
const request = require('request');
let config = require("../config/appconfig.json");
const fcm = new FCM(config.fcmkey);
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
    sendFcmNotification: userData => new Promise((resolve, reject) => {
        // const options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24
        // };
        let message = {
            //to: 'erI8cmj4TrSaTwkFMgxv6N:APA91bG-c_fdSWN3CTmBZG1a9oZr2_o4aPHuczglHRWNLOgALQhZtqRRYLiVqOPIY90BHcky6BwcwJDo3sK5wc1l2t0XHhWUSajpoVVUdeok9ZeC7CxTgbykvSVapbhOHeLDnPKPtQGi',
            to: userData.registrationToken,
            notification: {
                title: userData.title,
                body: userData.message
            },        
            data: { //you can send only notification or only data(or include both)
                title: userData.title,
                body: JSON.stringify(userData)
            }        
        };
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!" + err);
                console.log("Respponse:! " + response);
                reject(err);
            } else {
                // showToast("Successfully sent with response");
                console.log("Successfully sent with response: ", response);
                resolve({
                    status: 200,
                    message: "User notification sent.",
                    data: response
                });
            }
        
        });
    })
}
const _ = require('underscore');
const utils = require('../utils/utils');
const enums = require('../utils/enums');
const dbQuery = require('../dbConfig/queryRunner');

let updateOtpUser = userData => new Promise((resolve, reject) => {
    let sql = `update users set otp='${userData.otp}',message_id='${userData.messageId}' where mobile_number='${userData.mobileNumber}'`;
    dbQuery.queryRunner(sql)
        .then(result => {
            let userMobile = userData.mobileNumber;
            delete userData.mobileNumber;
            let userType = userData.userType;
            delete userData.userType;
            userData.mobile_number = userMobile;
            userData.user_type = userType;
            //userData.id = result.insertId;
            userData.otp = '';
            userData.messageId = ''
            userData.isOtpVerified = 0;
            userData.isSaveUserDetails = 0;
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "OTP sent on registered mobile number.",
                    data: [userData]
                });
            } else {
                reject({
                    status: 400,
                    message: "OTP not sent.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let getUserById = id => new Promise((resolve, reject) => {
    let userData = '';
    let sql = `select * from users where id=${id};`;
    let sql1 = `select fr.id as frId,u.id as userId,u.profile_image as profileImage, u.name as userName,frm.name as relation,u.profession from users u
    LEFT OUTER JOIN users b ON u.id=b.id INNER JOIN family_relationship fr ON u.id=fr.user_id INNER JOIN family_relationship_master frm ON fr.relation_id=frm.id
    where fr.createdby=${id};
    `
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                userData = result;
                return dbQuery.queryRunner(sql1);
            } else {
                resolve({
                    status: 200,
                    message: "User not found.",
                    data: result
                });
            }
        })
        .then(result => {
            userData[0].familyMember = result;
            let updateResult = dbDataMapping(userData);
            resolve({
                status: 200,
                message: "Fetch user successfully.",
                data: updateResult
            });
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let updateUser = userData => new Promise((resolve, reject) => {
    // let sql = `update users set name='${userData.name ? userData.name : null}',gender='${userData.gender ? userData.gender : null}',dob='${userData.dob ? userData.dob : ''}',profession='${userData.profession ? userData.profession : null}',
    // maternal_status='${userData.maternalStatus ? userData.maternalStatus : null}',address='${userData.address ? userData.address : null}',longitude='${userData.longitude ? userData.longitude : null}',latitude='${userData.latitude ? userData.latitude : null}',pincode='${userData.pincode ? userData.pincode : null}',isSaveUserDetails=1 where id=${userData.id}`;
    let sql = `update users set address='${userData.address ? userData.address : null}',longitude='${userData.longitude ? userData.longitude : null}',latitude='${userData.latitude ? userData.latitude : null}',pincode='${userData.pincode ? userData.pincode : null}' where id=${userData.id}`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "update user successfully.",
                    data: result
                });
            } else {
                reject({
                    status: 400,
                    message: "User not updated.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let checkUserExists = userData => new Promise((resolve, reject) => {
    let sql = `select * from users where id=${userData.id}`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "OTP verified successfully.",
                    data: result
                });
            } else {
                reject({
                    status: 400,
                    message: "Invalid id.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let getUserByMobileNumber = mobileNumber => new Promise((resolve, reject) => {
    let sql = `select * from users where mobile_number='${mobileNumber}'`;
    return dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "User fetch successfully.",
                    data: result
                });
            } else {
                resolve({
                    status: 400,
                    message: "User not found.",
                    data: []
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let updateOtpStatus = userData => new Promise((resolve, reject) => {
    let sql = `update users set isOtpVerified=${userData.isOtpVerified},isSaveUserDetails=0 where id=${userData.id};`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "update user successfully.",
                    data: userData
                });
            } else {
                reject({
                    status: 400,
                    message: "User not updated.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let userSave = userData => new Promise((resolve, reject) => {
    let sql = `INSERT INTO users(mobile_number,otp,message_id,isOtpVerified)
           VALUES('${userData.mobileNumber}','${userData.otp}','${userData.messageId}',0);`;
    return dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                let userMobile = userData.mobileNumber;
                delete userData.mobileNumber;
                userData.mobile_number = userMobile;
                userData.id = result.insertId;
                userData.otp = '';
                userData.messageId = ''
                resolve({
                    status: 200,
                    message: "OTP sent on registered mobile number.",
                    data: [userData]
                });
            } else {
                reject({
                    status: 400,
                    message: "OTP not sent.",
                    data: []
                });
            }
        })
        .catch(err => {
            reject(err);
        });
});

let getSearchUsers = name => new Promise((resolve, reject) => {
    let sql = `select * from users where name like '%${name}%';`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Fetch user successfully.",
                    data: result
                });
            } else {
                reject({
                    status: 400,
                    message: "User not found.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let getProfessions = () => new Promise((resolve, reject) => {
    let sql = `select * from professions where is_active=1;`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Fetch professions successfully.",
                    data: result
                });
            } else {
                reject({
                    status: 400,
                    message: "Professions not found.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let getEducations = () => new Promise((resolve, reject) => {
    let sql = `select * from education where is_active=1;`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Fetch education successfully.",
                    data: result
                });
            } else {
                reject({
                    status: 400,
                    message: "Education not found.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let getFamilyRelationMaster = () => new Promise((resolve, reject) => {
    let sql = `select * from family_relationship_master where is_active=1;`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Fetch relationship successfully.",
                    data: result
                });
            } else {
                reject({
                    status: 400,
                    message: "Relationship not found.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});
//not use
let savechat = userData => new Promise((resolve, reject) => {
    let sql = `INSERT INTO user_chat (name,is_active,createdby,createddate)
         VALUE ('${userData.name}',1,${userData.userId}, now())`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                userData.id = result.insertId;
                resolve({
                    status: 200,
                    message: "User chat added successfully.",
                    data: [userData]
                });
            } else {
                reject({
                    status: 400,
                    message: "User chat not saved.",
                    data: result
                });
            }
        })
        .catch(err => {
            let message = '';
            if (err.message.includes('ER_DUP_ENTRY')) message = 'Product already available.';
            if (err.message.includes('ER_NO_REFERENCED_ROW_2')) message = 'Invalid userId.';
            reject({
                status: 500,
                message: message != '' ? message : err.message,
                data: []
            });
        });

});

let dbDataMapping = result => {
    if (result && result.length != 0) {
        result.forEach(element => {
            element.social_links = element.social_links ? JSON.parse(element.social_links) : [];
            element.achievements = element.achievements ? JSON.parse(element.achievements) : [];
            element.language = element.language ? JSON.parse(element.language) : [];
            element.education = element.education ? JSON.parse(element.education) : [];
            element.company = element.company ? JSON.parse(element.company) : [];
            element.photos = element.photos ? JSON.parse(JSON.stringify(element.photos)).split(',') : [];
        });
    }
    return result;
}
let getMessage = (id) => new Promise((resolve, reject) => {
    let sql = `select * from user_chat where id=${id} and is_active=1;`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Fetch data successfully.",
                    data: result
                });
            } else {
                resolve({
                    status: 200,
                    message: "Message not found.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});
let getUser = (id) => new Promise((resolve, reject) => {
    let sql = `select * from user_chat where id=${id} and is_active=1;`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Fetch data successfully.",
                    data: result
                });
            } else {
                resolve({
                    status: 200,
                    message: "Message not found.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});
let deletemessages = id => new Promise((resolve, reject) => {
    let sql = `update user_chat set is_active=0,updateddate=now() where id=${id}`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Delete message successfully.",
                    data: []
                });
            } else {
                reject({
                    status: 400,
                    message: "Message not deleted.",
                    data: result
                });
            }
        })
        .catch(err => {
            let message = '';
            if (err.message.includes('ER_DUP_ENTRY')) message = 'Duplicate company not allowed.';
            if (err.message.includes('ER_NO_REFERENCED_ROW_2')) message = 'Invalid id.';
            reject({
                status: 500,
                message: message != '' ? message : err.message,
                data: []
            });
        });
});

let updateTicks = userData => new Promise((resolve, reject) => {
    let sql = `update user_chat set is_seen=${userData.isSeen},updateddate=now() where id=${userData.id}`;
    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Status of seen updated successfully.",
                    data: []
                });
            } else {
                reject({
                    status: 400,
                    message: "Not yet seen.",
                    data: result
                });
            }
        })
        .catch(err => {
            let message = '';
            if (err.message.includes('ER_DUP_ENTRY')) message = 'Duplicate company not allowed.';
            if (err.message.includes('ER_NO_REFERENCED_ROW_2')) message = 'Invalid id.';
            reject({
                status: 500,
                message: message != '' ? message : err.message,
                data: []
            });
        });
});

let updateBlockUser = userData => new Promise((resolve, reject) => {
    let sql = ''
    if (userData.isBlock) {
        sql += `INSERT INTO user_chat_details (user_id,is_block,createdby,createddate) VALUES(${userData.userId},'${userData.isBlock}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_block='${userData.isBlock}', updateddate=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
    }
    if (userData.isMute) {
        sql += `INSERT INTO user_chat_details (user_id,is_mute,createdby,createddate) VALUES(${userData.userId},'${userData.isMute}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_mute='${userData.isMute}', updateddate=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
    }

    dbQuery.queryRunner(sql)
        .then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "User data update successfully.",
                    data: [userData]
                });
            } else {
                reject({
                    status: 400,
                    message: "User data not saved.",
                    data: result
                });
            }
        })
        .catch(err => {
            reject({
                status: 500,
                message: err,
                data: []
            });
        });
});

let sendNotification = userData => new Promise((resolve, reject) => {
    let notificationBody = '';
    let userDetailsSQL = `select (select profile_image from users where id=${userData.createdBy}) as profileImage,(select name from users where id=${userData.createdBy}) as username,(select device_token from users where id=${userData.userId}) as registrationToken`
    return dbQuery.queryRunner(userDetailsSQL)
        .then(result => {
            if (result && result.length != 0 && result[0].registrationToken != null) {
                notificationBody = { userId: userData.userId, profileImage: result[0].profileImage, notificationId: userData.enum, createdBy: userData.createdBy, title: enums.notification[userData.enum], message: `${result[0].username} ${enums.notification[userData.enum]}`, registrationToken: result[0].registrationToken };
                return utils.sendFcmNotification(notificationBody);
            } else {
                return reject({
                    status: 400,
                    message: "User request save but notification not send",
                    data: [result]
                });
            }
        }).then(result => {
            if (result && result.status === 200) {
                let notificationSql = `INSERT INTO notifications(user_id,title,notification_type,device_token,message,fcm_response,is_active,createdby,created_date) VALUES (${userData.userId},'${notificationBody.title}',${notificationBody.notificationId},'${notificationBody.registrationToken}','${notificationBody.message}','${JSON.stringify(result.data)}',1,${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30'));`;
                return dbQuery.queryRunner(notificationSql);
            } else {
                reject(result);
            }
        }).then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "User view request sent",
                    data: [result]
                });
            } else {
                reject(result);
            }
        }).catch(err => {
            let notificationSql = `INSERT INTO notifications(user_id,title,notification_type,device_token,message,fcm_response,is_active,createdby,created_date) 
            VALUES (${userData.userId},'${notificationBody.title}',${notificationBody.notificationId},'${notificationBody.registrationToken}','${notificationBody.message}','${JSON.stringify(err)}',0,${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30'));`;
            dbQuery.queryRunner(notificationSql);
            reject(err);
        })
});

let smsNotification = userData => new Promise((resolve, reject) => {
    let notificationBody = '';
    let userDetailsSQL = `select (select profile_image from users where id=${userData.createdBy}) as profileImage,(select name from users where id=${userData.createdBy}) as username,(select device_token from users where id=${userData.userId}) as registrationToken`
    return dbQuery.queryRunner(userDetailsSQL)
        .then(result => {
            if (result && result.length != 0 && result[0].registrationToken != null) {
                notificationBody = { userId: userData.userId, profileImage: result[0].profileImage, notificationId: userData.enum, createdBy: userData.createdBy, title: enums.notification[userData.enum], message: `${result[0].username} ${enums.notification[userData.enum]}`, registrationToken: result[0].registrationToken };
                return utils.sendFcmNotification(notificationBody);
            } else {
                return reject({
                    status: 400,
                    message: "Message not send",
                    data: [result]
                });
            }
        }).then(result => {
            if (result && result.status === 200) {
                let notificationSql = `INSERT INTO notifications(user_id,title,notification_type,device_token,message,fcm_response,is_active,createdby,created_date) VALUES (${userData.userId},'${notificationBody.title}',${notificationBody.notificationId},'${notificationBody.registrationToken}','${notificationBody.message}','${JSON.stringify(result.data)}',1,${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30'));`;
                return dbQuery.queryRunner(notificationSql);
            } else {
                reject(result);
            }
        }).then(result => {
            if (result && result.length != 0) {
                resolve({
                    status: 200,
                    message: "Message send",
                    data: [result]
                });
            } else {
                reject(result);
            }
        }).catch(err => {
            let notificationSql = `INSERT INTO notifications(user_id,title,notification_type,device_token,message,fcm_response,is_active,createdby,created_date) 
            VALUES (${userData.userId},'${notificationBody.title}',${notificationBody.notificationId},'${notificationBody.registrationToken}','${notificationBody.message}','${JSON.stringify(err)}',0,${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30'));`;
            dbQuery.queryRunner(notificationSql);
            reject(err);
        })
});

module.exports = {
    saveLoginOtp: userData => new Promise((resolve, reject) => {
        let status = 200;
        return getUserByMobileNumber(userData.mobileNumber)
            .then(result => {
                status = result.status ? result.status : 200;
                if (result.status == 400) {
                    let otp = Math.floor(Math.random() * 899999 + 100000);
                    userData.otp = otp;
                    return utils.sendOtp(userData.mobileNumber, otp);
                } else if (result.data.length > 0 && result.data[0].isOtpVerified == false) {
                    let otp = Math.floor(Math.random() * 899999 + 100000);
                    userData.otp = otp;
                    userData.id = result.data[0].id;
                    return utils.sendOtp(userData.mobileNumber, otp);
                } else {
                    result.message = 'OTP already verified.'
                    resolve(result);
                }
            })
            .then(result => {
                userData.messageId = result.data.length != 0 ? result.data[0].message_id : ""
                if (status != 400) {
                    return updateOtpUser(userData);
                } else {
                    return userSave(userData);
                }
            })
            .then(result => {
                if (result && result.status == 200) {
                    resolve(result);
                } else {
                    reject(result);
                }
            })
            .catch(err => {
                reject(err);
            });
    }),

    otpVerify: userData => new Promise((resolve, reject) => {
        let message = '';
        return checkUserExists(userData).then(result => {
            //if (result && result.status == 200 && result.data.length != 0 && result.data[0].otp === '123456') {//userData.otp
            if (result && result.status == 200 && result.data[0].isOtpVerified == true) {
                message = 'OTP already verified.';
                resolve({
                    status: 200,
                    message: message,
                    data: result.data
                });
            } else {
                if (result && result.status == 200 && userData.otp === '123456') {
                    message = 'OTP verify successful.';
                    userData.isOtpVerified = true;
                    return updateOtpStatus(userData);
                } else {
                    message = 'OTP verification failed.';
                    userData.isOtpVerified = false;
                    return updateOtpStatus(userData);
                }
            }

        }).then(result => {
            return getUserById(userData.id);
        })
            .then(result => {
                if (result && result.status == 200) {
                    resolve({
                        status: 200,
                        message: message,
                        data: result.data
                    });
                } else {
                    reject({
                        status: 400,
                        message: message,
                        data: result.data
                    });
                }
            })
            .catch(err => {
                reject(err);
            })
    }),

    saveUserDetails: userData => new Promise((resolve, reject) => {
        return checkUserExists(userData).then(result => {
            if (result && result.status == 200 && result.data.length != 0) {
                return updateUser(userData);
            } else {
                return reject(result);
            }
        }).then(result => {
            return getUserById(userData.id);
        }).then(result => {
            if (result && result.status == 200) {
                resolve({
                    status: 200,
                    message: 'User data saved successful',
                    data: result.data
                });
            } else {
                reject({
                    status: 400,
                    message: message,
                    data: result.data
                });
            }
        })
            .catch(err => {
                reject(err);
            })
    }),
    savemessages: userData => new Promise((resolve, reject) => {
        let sql = `INSERT INTO user_chat (message,sender,receiver,parent_id,is_seen,is_active,createdby,createddate)
             VALUE ('${userData.message}',${userData.userId},${userData.receiverId},${userData.parentId},0,1,${userData.userId}, now())`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    userData.enum = 6;
                    smsNotification(userData)
                    userData.id = result.insertId;
                    resolve({
                        status: 200,
                        message: "Send message successfully.",
                        data: [userData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "Message not send.",
                        data: result
                    });
                }
            })
            .catch(err => {
                let message = '';
                if (err.message.includes('ER_DUP_ENTRY')) message = 'Product already available.';
                if (err.message.includes('ER_NO_REFERENCED_ROW_2')) message = 'Invalid userId.';
                reject({
                    status: 500,
                    message: message != '' ? message : err.message,
                    data: []
                });
            });

    }),
    savechat: userData => new Promise((resolve, reject) => {
        savechat(userData)
            .then(result => {
                if (result && result.status == 200) {
                    resolve(result);
                } else {
                    reject(result);
                }

            }).catch(err => {
                reject(err);
            })
    }),
    deletemessages: id => new Promise((resolve, reject) => {
        return getMessage(id)
            .then(result => {
                if (result && result.status == 200) {
                    return deletemessages(id);
                } else {
                    reject(result);
                }
            })
            .then(result => {
                if (result && result.status == 200) {
                    resolve(result);
                } else {
                    reject(result);
                }
            })
            .catch(err => {
                reject(err);
            })
    }),

    getMessages: userId => new Promise((resolve, reject) => {
        // let sql = `select u.name as senderName, u.profile_image as senderNameProfileImage, u1.name as receiver,
        // u1.profile_image as receiverProfileImage, uc.id message_id,uc.message, uc.parent_id,uc.is_seen,uc.is_like,uc.createddate from user_chat uc
        // INNER JOIN users u ON uc.sender=u.id INNER JOIN users u1 ON uc.receiver=u1.id where uc.sender=${userId}`;
        let messageData='';
        let sql = `call latest_message_byuser(${userId})`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result[0].length != 0) {
                    messageData=result[0];
                    let userData=_.pluck(result[0],'receiver');
                    let userSql=`select u.id,u.profile_image,u.username,ucd.is_block,ucd.is_mute from users u
                    LEFT JOIN user_chat_details ucd ON ucd.user_id=u.id and ucd.createdby=${userId} where u.id in (${userData.toString()});`
                    return dbQuery.queryRunner(userSql);
                } else {
                    resolve({
                        status: 200,
                        message: "Message not found.",
                        data: result[0]
                    });
                }
            })
            .then(result =>{
                if (result && result[0].length != 0) {
                    messageData.forEach(message => {
                        result.forEach(user => {
                            if(message && message.receiver == user.id) {
                                message.profile_image=user.profile_image;
                                message.username=user.username;
                                message.is_block=user.is_block;
                                message.is_mute=user.is_mute;
                            }
                            
                        });                        
                    });
                resolve({
                    status: 200,
                    message: "Fetch data successfully.",
                    data: messageData
                });
            }else{
                resolve(result);
            }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getMessage: usersData => new Promise((resolve, reject) => {
        // let sql = `select u.name as senderName, u.profile_image as senderNameProfileImage, u1.name as receiver,
        // u1.profile_image as receiverProfileImage, uc.id message_id,uc.message, uc.parent_id,uc.is_seen,uc.is_like,uc.createddate from user_chat uc
        // INNER JOIN users u ON uc.sender=u.id INNER JOIN users u1 ON uc.receiver=u1.id where uc.sender=${userId}`;
        let sql = `call getmessagesbysenderandreceiver(${usersData.loginuserid},${usersData.chattinguserid})`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "Fetch data successfully.",
                        data: result[0]
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "Message not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getMuteAndBlockUsers: userId => new Promise((resolve, reject) => {
        let sql = `call getmuteandblockusers(${userId})`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "Fetch data successfully.",
                        data: result[0]
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "Message not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    saveticks: userData => new Promise((resolve, reject) => {
        return getMessage(userData.id)
            .then(result => {
                if (result && result.status == 200) {
                    return updateTicks(userData);
                } else {
                    reject(result);
                }
            })
            .then(result => {
                if (result && result.status == 200) {
                    resolve(result);
                } else {
                    reject(result);
                }
            })
            .catch(err => {
                reject(err);
            })
    }),

    updateBlockUser: userData => new Promise((resolve, reject) => {
        return updateBlockUser(userData)
            .then(result => {
                if (result && result.status == 200) {
                    resolve(result);
                } else {
                    reject(result);
                }
            })
            .catch(err => {
                reject(err);
            })
    }),
    getUser: id => new Promise((resolve, reject) => {
        if (!id) res.status(400).send({ status: 400, message: 'Invalid Id', data: [] });
        return getUserById(id).then(result => {
            if (result && result.status == 200) {
                resolve(result);
            } else {
                reject(result);
            }
        }).catch(err => {
            reject(err);
        })
    }),

    updateUser: userData => new Promise((resolve, reject) => {
        let sql = `update users set `
        if (userData.name) sql += ` name='${userData.name ? userData.name : ''}',`;
        if (userData.userName) sql += ` username='${userData.userName ? userData.userName : ''}',`;
        if (userData.email) sql += ` emailId='${userData.email ? userData.email : ''}',`;
        if (userData.address) sql += ` address='${userData.address ? userData.address : ''}',`;
        if (userData.profileImage) sql += ` profile_image='${userData.profileImage ? userData.profileImage : ''}',`;

        if (userData.earlyLifeFamily) sql += ` early_life_family='${userData.earlyLifeFamily ? userData.earlyLifeFamily : ''}',`;
        if (userData.career) sql += ` career='${userData.career ? userData.career : ''}',`;
        if (userData.goals) sql += ` goals='${userData.goals ? userData.goals : ''}',`;
        if (userData.philanthropy) sql += ` philanthropy='${userData.philanthropy ? userData.philanthropy : ''}',`;
        if (userData.personalLife) sql += ` personal_life='${userData.personalLife ? userData.personalLife : ''}',`;
        if (userData.profession) sql += ` profession=${userData.profession ? userData.profession : ''},`;
        if (userData.overview) sql += ` overview='${userData.overview ? userData.overview : ''}',`;
        if (userData.hobbies) sql += ` hobbies='${userData.hobbies ? userData.hobbies : ''}',`;
        if (userData.favourites) sql += ` favourites='${userData.favourites ? userData.favourites : ''}',`;

        if (userData.gender) sql += ` gender='${userData.gender ? userData.gender : ''}',`;
        if (userData.maritalStatus) sql += ` marital_status='${userData.maritalStatus ? userData.maritalStatus : ''}',`;
        if (userData.dob) sql += ` dob='${userData.dob ? userData.dob : ''}',`;
        if (userData.bio) sql += ` bio='${userData.bio ? userData.bio : ''}',`;
        if (userData.photos) sql += ` photos='${userData.photos ? userData.photos : ''}',`;

        if (userData.company) sql += ` company='${userData.company ? JSON.stringify(userData.company) : ''}',`;
        if (userData.language) sql += ` language='${userData.language ? JSON.stringify(userData.language) : ''}',`;
        if (userData.socialLinks) sql += ` social_links='${userData.socialLinks ? JSON.stringify(userData.socialLinks) : ''}',`;
        if (userData.achievements) sql += ` achievements='${userData.achievements ? JSON.stringify(userData.achievements) : ''}',`;

        if (userData.educationData) sql += ` education='${userData.educationData ? JSON.stringify(userData.educationData) : ''}',`;
        if (userData.isPrivateProfile) sql += ` is_private_profile='${userData.isPrivateProfile ? userData.isPrivateProfile : ''}',`;

        if (userData.isPrivateGender) sql += ` is_private_gender='${userData.isPrivateGender ? userData.isPrivateGender : ''}',`;
        if (userData.isPrivateBirthDate) sql += ` is_private_birthdate='${userData.isPrivateBirthDate ? userData.isPrivateBirthDate : ''}',`;
        if (userData.isPrivateMaritalstatus) sql += ` is_private_maritalstatus='${userData.isPrivateMaritalstatus ? userData.isPrivateMaritalstatus : ''}',`;

        sql += ` is_active=1, updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30') where id=${userData.id}`;

        if (userData.educationData && userData.educationData.length != 0) {
            let educationSql = `INSERT INTO user_educations (user_id,educationId,grade,location,course,year,is_active,created_by,created_date) VALUES`;
            userData.educationData.forEach(element => {
                educationSql += ` (${userData.id}, ${element.educationId},'${element.grade}','${element.location}','${element.course}','${element.year}',1,${userData.id},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')),`;
            });
            if (educationSql !== '') educationSql = educationSql.substring(0, educationSql.length - 1);
            dbQuery.queryRunner(educationSql);
        }
        if (userData.familyMember && userData.familyMember.length != 0) {
            let relationSql = `INSERT INTO family_relationship (user_id,relation_id,is_active,createdby) VALUES`;
            userData.familyMember.forEach(element => {
                relationSql += ` (${element.userId}, ${element.relationId},1,${element.createdBy}),`;
            });
            if (relationSql !== '') relationSql = relationSql.substring(0, relationSql.length - 1);
            dbQuery.queryRunner(relationSql);
        }

        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "update user successfully.",
                        data: [userData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User not updated.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getSearchUsers: name => new Promise((resolve, reject) => {
        return getSearchUsers(name).then(result => {
            if (result && result.status == 200) {
                resolve(result);
            } else {
                reject(result);
            }
        }).catch(err => {
            reject(err);
        })
    }),

    getProfessions: () => new Promise((resolve, reject) => {
        return getProfessions().then(result => {
            if (result && result.status == 200) {
                resolve(result);
            } else {
                reject(result);
            }
        }).catch(err => {
            reject(err);
        })
    }),

    getEducations: () => new Promise((resolve, reject) => {
        return getEducations().then(result => {
            if (result && result.status == 200) {
                resolve(result);
            } else {
                reject(result);
            }
        }).catch(err => {
            reject(err);
        })
    }),
    getLanguages: () => new Promise((resolve, reject) => {
        let sql = `select id,name from user_language where is_active=1`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "Fetch language successfully.",
                        data: result
                    });
                } else {
                    reject({
                        status: 400,
                        message: "language not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),
    saveLanguage: languageData => new Promise((resolve, reject) => {
        let sql = `INSERT INTO user_language(name,is_active) VALUES ('${languageData.language}',0);`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "Language save successfully.",
                        data: [languageData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "Language not save.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),
    saveProfession: professionData => new Promise((resolve, reject) => {
        let sql = `INSERT INTO professions(name,is_active) VALUES ('${professionData.profession}',0);`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "Profession save successfully.",
                        data: [professionData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "Profession not save.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),
    getFamilyRelationMaster: () => new Promise((resolve, reject) => {
        return getFamilyRelationMaster().then(result => {
            if (result && result.status == 200) {
                resolve(result);
            } else {
                reject(result);
            }
        }).catch(err => {
            reject(err);
        })
    }),
    userRequestSave: userData => new Promise((resolve, reject) => {
        let sql = `INSERT INTO user_requests(user_id,request_status,created_by,created_date) VALUES (${userData.userId},1,${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30'));`;
        dbQuery.queryRunner(sql)
            .then(result => {
                userData.enum = 1;
                return sendNotification(userData);
            })
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "User request save successfully.",
                        data: [userData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User request not save.",
                        data: [result]
                    });
                }
            })
            .catch(err => {
                let message = '', status = 400;
                if (err.message.includes('ER_DUP_ENTRY')) message = 'Request already sent.';
                status = err.status ? err.status : 400;
                reject({
                    status: status ? status : 500,
                    message: message != '' ? message : err.message,
                    data: []
                });
            });
    }),

    updateUserRequestStatus: userData => new Promise((resolve, reject) => {
        let checkUserRequestExist = `select id from user_requests where created_by= ${userData.userId} and user_id=${userData.createdBy};`;
        let sql = `UPDATE user_requests SET request_status=${userData.requestStatus}, updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30') where created_by= ${userData.userId} and user_id=${userData.createdBy};`;
        dbQuery.queryRunner(checkUserRequestExist)
            .then(result => {
                if (result && result.length != 0) {
                    dbQuery.queryRunner(sql);
                    return resolve({
                        status: 200,
                        message: "User request save successfully.",
                        data: [userData]
                    });
                } else {
                    return reject({
                        status: 400,
                        message: "User request not found.",
                        data: result
                    });
                }
            })
            .then(result => {
                if (condition) {
                    userData.enum = userData.requestStatus;
                    return sendNotification(userData);
                } else {
                    reject(result);
                }
            })
            .then(result => {
                if (result && result.status === 200) {
                    resolve(result);
                } else {
                    reject(result);
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getSendRequestByUserId: userId => new Promise((resolve, reject) => {
        let sql = `select u.*,ur.request_status as requestStatus,ur.created_date as requestedDate from user_requests ur INNER JOIN users u ON ur.user_id=u.id where ur.created_by=${userId} order by ur.created_date desc;`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch user request successfully.",
                        data: updateResult
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User request not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getRecievedRequestByUserId: userId => new Promise((resolve, reject) => {
        let sql = `select u.*, ur.request_status, ur.created_date as requestedDate from user_requests ur INNER JOIN users u ON ur.created_by=u.id where ur.user_id=${userId} order by ur.created_date desc`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch user request successfully.",
                        data: updateResult
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User request not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getUsersProfilesByCategaryId: categaryId => new Promise((resolve, reject) => {
        let sql = `select * from users where profession=${categaryId};`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch user successfully.",
                        data: updateResult
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getUserbyCategary: () => new Promise((resolve, reject) => {
        let sql = `select u.*,p.name as professionName from users u INNER JOIN professions p on p.id=u.profession where u.is_active=1;`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let finalData = [];
                    let updateResult = dbDataMapping(result);
                    let categaryData = _.pluck(updateResult, 'professionName');
                    categaryData = _.uniq(categaryData);
                    if (categaryData && categaryData.length != 0) {
                        categaryData.forEach(element => {
                            let usersData = _.filter(updateResult, user => user.professionName === element);
                            let categaryObj = {
                                id: usersData && usersData.length != 0 ? usersData[0].profession : null,
                                name: element,
                                users: usersData
                            }
                            finalData.push(categaryObj);
                        });
                    }
                    // var groupBy = function (xs, key) {
                    //     return xs.reduce(function (rv, x) {
                    //         (rv[x[key]] = rv[x[key]] || []).push(x);
                    //         return rv;
                    //     }, {});
                    // };
                    // let groubedByTeam = groupBy(updateResult, 'professionName')
                    resolve({
                        status: 200,
                        message: "Fetch user successfully.",
                        data: finalData
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getPublicUserProfile: () => new Promise((resolve, reject) => {
        let sql = `select * from users where is_private_profile=0;`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch user successfully.",
                        data: updateResult
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "User not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),
    getPrivateUserProfile: () => new Promise((resolve, reject) => {
        let sql = `select * from users where is_private_profile=1;`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch user successfully.",
                        data: updateResult
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    checkUserName: userName => new Promise((resolve, reject) => {
        let sql = `select * from users where username='${userName}';`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "Username already exists.",
                        data: result
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "Username not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    saveUserRawPhoto: userData => new Promise((resolve, reject) => {
        let sql = `update users set raw_photos='${userData.rawPhotos}' where id=${userData.id}`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "users photos saved.",
                        data: userData
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "users not save.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    updateUserLatLong: userData => new Promise((resolve, reject) => {
        let sql = `update users set longitude='${userData.longitude}', latitude='${userData.latitude}' where id=${userData.id}`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "users location saved.",
                        data: userData
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "users data not save.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getNearestUser: userData => new Promise((resolve, reject) => {
        let sql = `select * from users where latitude <= '${userData.latitude}' and longitude >= '${userData.longitude}';`;
        //let sql = `SELECT id, name, latitude,longitude,SQRT( POW(69.1 * (${userData.latitude} - 24.900363), 2) + POW(69.1 * (${userData.longitude} - 73.0254545) * COS(19.0391557 / 57.3), 2)) AS distance FROM users HAVING distance < 1000 ORDER BY distance`;
        //let sql=`call getnearestusers('${userData.latitude}','${userData.longitude}','${userData.distance}')`
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch users successfully.",
                        data: updateResult
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "users not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    deleteSendRequest: userData => new Promise((resolve, reject) => {
        let sql = `DELETE FROM user_requests where user_id=${userData.userId} and created_by=${userData.createdBy};`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "User request delete successfully.",
                        data: [userData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User request not deleted.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    userDetailsUpdate: userData => new Promise((resolve, reject) => {
        let sql = '';

        if (userData.isSaveProfile) {
            sql += `INSERT INTO user_details (user_id,is_save_profile,created_by,created_date) VALUES(${userData.userId},'${userData.isSaveProfile}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_save_profile='${userData.isSaveProfile}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
            if (userData.isSaveProfile === '1') dbQuery.queryRunner(`update users set toatl_saved_profile = toatl_saved_profile + 1 where id=${userData.userId};`);
            if (userData.isSaveProfile === '0') dbQuery.queryRunner(`update users set toatl_saved_profile = toatl_saved_profile - 1 where id=${userData.userId};`);
            userData.enum = 5;
            //sendNotification(userData);
        }
        if (userData.isLikeProfile) {
            sql += `INSERT INTO user_details (user_id,is_like_profile,created_by,created_date) VALUES(${userData.userId},'${userData.isLikeProfile}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_like_profile='${userData.isLikeProfile}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
            if (userData.isLikeProfile === '1') {
                dbQuery.queryRunner(`update users set total_likes = total_likes + 1 where id=${userData.userId};`);
                userData.enum = 4;
                //sendNotification(userData);

            }
            if (userData.isLikeProfile === '0') dbQuery.queryRunner(`update users set total_likes = total_likes - 1 where id=${userData.createdBy};`);

        }
        if (userData.isViewProfile) {
            sql += `INSERT INTO user_details (user_id,is_view_profile,created_by,created_date) VALUES(${userData.userId},'${userData.isViewProfile}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_view_profile='${userData.isViewProfile}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
            if (userData.isViewProfile === '1') {
                dbQuery.queryRunner(`update users set total_views = total_views + 1 where id=${userData.userId};`);
                userData.enum = 3;
                sendNotification(userData);
            }
            if (userData.isViewProfile === '0') dbQuery.queryRunner(`update users set total_views = total_views - 1 where id=${userData.userId};`);

        }
        if (userData.isRatingProfile) {
            sql += `INSERT INTO user_details (user_id,is_rating_profile,rating,rating_message,created_by,created_date)VALUES(${userData.userId},'${userData.isRatingProfile}',${userData.rating},'${userData.ratingMessage}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_rating_profile='${userData.isRatingProfile}',rating=${userData.rating},rating_message='${userData.ratingMessage}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
            if (userData.isRatingProfile === '1') dbQuery.queryRunner(`update users set total_rating = total_rating + 1 where id=${userData.userId};`);
            if (userData.isRatingProfile === '0') dbQuery.queryRunner(`update users set total_rating = total_rating - 1 where id=${userData.userId};`);
            userData.enum = userData.isViewProfile;
            // sendNotification(userData);
        }

        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "User data update successfully.",
                        data: [userData]
                    });
                } else {
                    reject({
                        status: 400,
                        message: "User data not saved.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getSavedProfiles: userId => new Promise((resolve, reject) => {
        let sql = `select u.* from user_details ud INNER JOIN users u on u.id=ud.user_id where ud.created_by=${userId} and is_save_profile=1;`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch users successfully.",
                        data: updateResult
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "users not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getAllusers: userId => new Promise((resolve, reject) => {
        let sql = `select u.* ,ur.request_status,is_save_profile from users u
        LEFT JOIN user_requests ur ON ur.user_id=u.id and ur.created_by=${userId}
        LEFT JOIN user_details ud ON ud.user_id=u.id and ud.is_save_profile=1 and ud.created_by=${userId}
        where u.is_active=1 and u.id != ${userId} order by u.created_date desc`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch users successfully.",
                        data: updateResult
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "users not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getUserDetails: (loginUserId, userId) => new Promise((resolve, reject) => {
        let sql = `select u.* ,ur.request_status,ud.is_save_profile,ud.is_like_profile,ud.is_view_profile,ud.is_rating_profile,ud.rating,ud.rating_message
        from users u
        LEFT JOIN user_requests ur ON ur.user_id=${userId} and ur.created_by=${loginUserId}
        LEFT JOIN user_details ud ON ud.user_id=${userId} and ud.created_by=${loginUserId}
        where u.is_active=1 and u.id = ${userId} order by u.created_date desc`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let updateResult = dbDataMapping(result);
                    resolve({
                        status: 200,
                        message: "Fetch users successfully.",
                        data: updateResult
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "users not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    saveUserDeviceToken: userData => new Promise((resolve, reject) => {
        let sql = `update users set device_token='${userData.deviceToken}' where id=${userData.id}`;
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    resolve({
                        status: 200,
                        message: "user device token saved.",
                        data: userData
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "user device token not save.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getSentNotification: userId => new Promise((resolve, reject) => {
        let sql = `select u.id, u.name, u.profile_image, n.title,n.message,n.notification_type,n.created_date,DATE_FORMAT(n.created_date,'%d/%m/%Y') AS formated_date from users u
        LEFT JOIN notifications n ON n.user_id=u.id  where u.is_active=1 and n.createdby=${userId} and n.is_active=1 order by u.created_date desc`;

        //LEFT JOIN user_details ud ON ud.user_id=u.id and ud.created_by=${userId}
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let finalData = [];
                    //let updateResult = dbDataMapping(result);
                    //result=_.groupBy(result, 'formated_date');
                    let categaryData = _.pluck(result, 'formated_date');
                    categaryData = _.uniq(categaryData);
                    if (categaryData && categaryData.length != 0) {
                        categaryData.forEach(element => {
                            let usersData = _.filter(result, user => user.formated_date === element);
                            let categaryObj = {
                                name: element,
                                notification: usersData
                            }
                            finalData.push(categaryObj);
                        });
                    }
                    resolve({
                        status: 200,
                        message: "Fetch users notifications successfully.",
                        data: finalData
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "Users notifications not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),

    getReceivedNotification: userId => new Promise((resolve, reject) => {
        let sql = `select u.id, u.name, u.profile_image, n.title,n.message,n.notification_type,n.created_date,n.created_date,DATE_FORMAT(n.created_date,'%d/%m/%Y') AS formated_date from users u
        LEFT JOIN notifications n ON n.createdby=u.id where u.is_active=1 and n.user_id=${userId} and n.is_active=1 order by u.created_date desc`;

        //LEFT JOIN user_details ud ON ud.user_id=u.id and ud.created_by=${userId}
        dbQuery.queryRunner(sql)
            .then(result => {
                if (result && result.length != 0) {
                    let finalData = [];
                    //let updateResult = dbDataMapping(result);
                    //result=_.groupBy(result, 'formated_date');
                    let categaryData = _.pluck(result, 'formated_date');
                    categaryData = _.uniq(categaryData);
                    if (categaryData && categaryData.length != 0) {
                        categaryData.forEach(element => {
                            let usersData = _.filter(result, user => user.formated_date === element);
                            let categaryObj = {
                                name: element,
                                notification: usersData
                            }
                            finalData.push(categaryObj);
                        });
                    }
                    resolve({
                        status: 200,
                        message: "Fetch users notifications successfully.",
                        data: finalData
                    });
                } else {
                    resolve({
                        status: 200,
                        message: "Users notifications not found.",
                        data: result
                    });
                }
            })
            .catch(err => {
                reject({
                    status: 500,
                    message: err,
                    data: []
                });
            });
    }),
}

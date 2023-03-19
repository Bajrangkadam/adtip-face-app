const utils = require('../utils/utils');
let dbQuery = require('../dbConfig/queryRunner');

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
    let sql = `select * from users where id=${id};`;
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
            })
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
        if (userData.email) sql += ` emailId='${userData.email ? userData.email : ''}',`;
        if (userData.address) sql += ` address='${userData.address ? userData.address : ''}',`;
        if (userData.profileImage) sql += ` profile_image='${userData.profileImage ? userData.profileImage : ''}',`;
            sql += ` updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30') where id=${userData.id}`;
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

}

const _ = require('underscore');
const utils = require('../utils/utils');
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

let dbDataMapping = result => {
    if (result && result.length != 0) {
        result.forEach(element => {
            element.social_links = element.social_links ? JSON.parse(element.social_links) : [];
            element.achievements = element.achievements ? JSON.parse(element.achievements) : [];
            element.language = element.language ? JSON.parse(element.language) : [];
            element.education=element.education ? JSON.parse(element.education) : [];
            element.company=element.company ? JSON.parse(element.company) : [];
            element.photos = element.photos ? JSON.parse(JSON.stringify(element.photos)).split(',') : [];
        });
    }
    return result;
}

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
        if (userData.userName) sql += ` username='${userData.userName ? userData.userName : ''}',`;
        if (userData.email) sql += ` emailId='${userData.email ? userData.email : ''}',`;
        if (userData.address) sql += ` address='${userData.address ? userData.address : ''}',`;
        if (userData.profileImage) sql += ` profile_image='${userData.profileImage ? userData.profileImage : ''}',`;

        if (userData.earlyLifeFamily) sql += ` early_life_family='${userData.earlyLifeFamily ? userData.earlyLifeFamily : ''}',`;
        if (userData.career) sql += ` career='${userData.career ? userData.career : ''}',`;
        if (userData.goals) sql += ` goals='${userData.goals ? userData.goals : ''}',`;
        if (userData.philanthropy) sql += ` philanthropy='${userData.philanthropy ? userData.philanthropy : ''}',`;
        if (userData.personalLife) sql += ` personal_life='${userData.personalLife ? userData.personalLife : ''}',`;

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

    updateUserRequestStatus: userData => new Promise((resolve, reject) => {
        let checkUserRequestExist=`select id from user_requests where created_by= ${userData.userId} and user_id=${userData.createdBy};`;
        let sql = `UPDATE user_requests SET request_status=${userData.requestStatus}, updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30') where created_by= ${userData.userId} and user_id=${userData.createdBy};`;
        dbQuery.queryRunner(checkUserRequestExist)
            .then(result => {
                if (result && result.length != 0) {
                    dbQuery.queryRunner(sql);
                    resolve({
                        status: 200,
                        message: "User request save successfully.",
                        data: [userData]
                    });
                } else {
                    resolve({
                        status: 200,
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
                    let finalData=[];
                    let updateResult = dbDataMapping(result);
                    let categaryData=_.pluck(updateResult, 'professionName');
                    categaryData=_.uniq(categaryData);
                    if(categaryData && categaryData.length != 0){
                        categaryData.forEach(element => {
                            let usersData=_.filter(updateResult,user => user.professionName === element);
                            let categaryObj={
                                id:usersData && usersData.length !=0 ? usersData[0].profession : null,
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

        if (userData.isSaveProfile) sql += `INSERT INTO user_details (user_id,is_save_profile,created_by,created_date) VALUES(${userData.userId},'${userData.isSaveProfile}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_save_profile='${userData.isSaveProfile}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
        if (userData.isLikeProfile) sql += `INSERT INTO user_details (user_id,is_like_profile,created_by,created_date) VALUES(${userData.userId},'${userData.isLikeProfile}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_like_profile='${userData.isLikeProfile}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;
        if (userData.isViewProfile) sql += `INSERT INTO user_details (user_id,is_view_profile,created_by,created_date) VALUES(${userData.userId},'${userData.isViewProfile}',${userData.createdBy},CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30')) ON DUPLICATE KEY UPDATE is_view_profile='${userData.isViewProfile}', updated_date=CONVERT_TZ(CURRENT_TIMESTAMP(),'+00:00','+05:30');`;

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

}

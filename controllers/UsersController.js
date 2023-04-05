let userService = require('../services/UsersService');
module.exports = {
    saveLoginOtp: (req, res, next) => {
        userService.saveLoginOtp(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    },
    otpVerify: (req, res, next) => {
        userService.otpVerify(req.body)
            .then(result => {
                result.message = result.message === "Fetch user successfully." ? "OTP verified successfully." : result.message;
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    saveUserDetails: (req, res, next) => {
        userService.saveUserDetails(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    updateUser: (req, res, next) => {
        if (!req.body.id) return res.status(400).send({ status: 400, message: "Invalid request.", data: [] });
        userService.updateUser(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getUser: (req, res, next) => {
        userService.getUser(req.params.id)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getSearchUsers: (req, res, next) => {
        if (!req.params.name)return res.status(400).send({ status: 400, message: 'Invalid search', data: [] });
        userService.getSearchUsers(req.params.name)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getEducations: (req, res, next) => {
        userService.getEducations()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getLanguages: (req, res, next) => {
        userService.getLanguages()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    saveLanguage: (req, res, next) => {
        if (!req.body) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.body });
        userService.saveLanguage(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    saveProfession: (req, res, next) => {
        if (!req.body) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.body });
        userService.saveProfession(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getProfessions: (req, res, next) => {
        userService.getProfessions()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getFamilyRelationMaster: (req, res, next) => {
        userService.getFamilyRelationMaster()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    userRequestSave: (req, res, next) => {
        userService.userRequestSave(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getSendRequestByUserId: (req, res, next) => {
        if (!req.params.userid) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.params });
        userService.getSendRequestByUserId(req.params.userid)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getRecievedRequestByUserId: (req, res, next) => {
        if (!req.params.userid) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.params });
        userService.getRecievedRequestByUserId(req.params.userid)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },   
    updateUserRequestStatus: (req, res, next) => {
        userService.updateUserRequestStatus(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    getUsersProfilesByCategaryId: (req, res, next) => {
        userService.getUsersProfilesByCategaryId(req.params.categaryid)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    getUserbyCategary: (req, res, next) => {
        userService.getUserbyCategary()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    updateUserLatLong: (req, res, next) => {
        userService.updateUserLatLong(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    
    getPublicUserProfile: (req, res, next) => {
        userService.getPublicUserProfile()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    getPrivateUserProfile: (req, res, next) => {
        userService.getPrivateUserProfile()
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    checkUserName: (req, res, next) => {
        if (!req.params.username) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.params });
        userService.checkUserName(req.params.username)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    saveUserRawPhoto: (req, res, next) => {
        if (!req.body.id) return res.status(400).send({ status: 400, message: "Invalid request.", data: [] });
        userService.saveUserRawPhoto(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    getNearestUser: (req, res, next) => {
        if (!req.body.latitude || !req.body.longitude) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.body });
        userService.getNearestUser(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },
    
    deleteSendRequest: (req, res, next) => {
        if (!req.body.userId || !req.body.createdBy) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.body });
        userService.deleteSendRequest(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    userDetailsUpdate: (req, res, next) => {
        if (!req.body.userId || !req.body.createdBy) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.body });
        userService.userDetailsUpdate(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    getSavedProfiles: (req, res, next) => {
        if (!req.params.userid) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.params });
        userService.getSavedProfiles(req.params.userid)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    getAllusers: (req, res, next) => {
        if (!req.params.userid) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.params });
        userService.getAllusers(req.params.userid)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    getUserDetails: (req, res, next) => {
        if (!req.params.loginid && !req.params.userid) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.params });
        userService.getUserDetails(req.params.loginid,req.params.userid)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

    saveUserDeviceToken: (req, res, next) => {
        if (!req.body.id) return res.status(400).send({ status: 400, message: "Invalid request.", data: req.body });
        userService.saveUserDeviceToken(req.body)
            .then(result => {
                res.status(result.status || 200).send(result);
            })
            .catch(err => {
                res.status(err.status || 500).send({
                    status: err.status || 500,
                    message: err.message ? err.message : "Internal server error.",
                    data: []
                });
            });
    },

}

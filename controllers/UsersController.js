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

}

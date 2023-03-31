const express = require('express');
const multer = require('multer')
const upload = multer({ dest: 'public/' });
const checkId = require('../utils/utils');

const router = express.Router();
const UsersController = require('../controllers/UsersController');
const MasterController = require('../controllers/MasterController');

router.get('/', (req, res) => res.send('Welcome to ADtip Wiki App !!'));
router.post('/otplogin', UsersController.saveLoginOtp);
router.post('/otpverify', UsersController.otpVerify);
router.post('/saveuserdetails', UsersController.saveUserDetails);
router.post('/updateuser', UsersController.updateUser);
router.get('/searchusers/:name', UsersController.getSearchUsers);
router.get('/geteducation', UsersController.getEducations);
router.get('/getprofessions', UsersController.getProfessions);
router.get('/getfamilyrelationmaster', UsersController.getFamilyRelationMaster);
router.get('/getuserbyid/:id', UsersController.getUser);
router.post('/userrequestsave', UsersController.userRequestSave);
router.post('/updateuserrequeststatus', UsersController.updateUserRequestStatus);
router.get('/getsendrequest/:userid', UsersController.getSendRequestByUserId);
router.get('/getrecievedrequest/:userid', UsersController.getRecievedRequestByUserId);
router.get('/getusersprofilesbycategary/:categaryid', UsersController.getUsersProfilesByCategaryId);
router.get('/getpublicuserprofile', UsersController.getPublicUserProfile);
router.get('/getprivateuserprofile', UsersController.getPrivateUserProfile);
router.get('/checkusername/:username', UsersController.checkUserName);
router.post('/saveuserrawphoto', UsersController.saveUserRawPhoto);
router.get('/getuserbycategary', UsersController.getUserbyCategary);
router.post('/updateuserlatlong', UsersController.updateUserLatLong);


router.get('/termscondition', MasterController.getTermscondition);
router.get('/flashscreen/:filename', MasterController.getFlashScreen);
router.get('/video/:filename', MasterController.getFlashScreen);
router.get('/getuser/:id', UsersController.getUser);

router.get('/file/:filename', MasterController.getFile);
router.get('/photo/:id', MasterController.getPhoto);
module.exports = router
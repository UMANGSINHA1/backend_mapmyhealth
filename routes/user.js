const express = require("express");
const {
  register,
  activateAccount,
  login,
  auth,
  findUser,
  sendResetPasswordCode,
  addImageToDB,
  newuserinfo,
  generateOTP,
  verifyOTP,
  destroyotp,
  getpatientinfo,
} = require("../controllers/user");
// const {newuserinfo} = require('../controllers/post');
const { authUser } = require("../middlwares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/activate", activateAccount);
router.post("/login", login);
router.post("/addImageToDB", addImageToDB);
router.post("/newuserinfo", newuserinfo);
router.post("/generateOTP", generateOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/destroyotp", destroyotp);
router.post("/getpatientinfo", getpatientinfo);
// router.post("/activate", activateAccount);
// router.post("/findUser", findUser);
// router.post("/sendResetPasswordCode", sendResetPasswordCode);
module.exports = router;

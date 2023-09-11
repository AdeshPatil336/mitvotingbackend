const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/usersControllers");
const upload = require("../multerConfig/storageConfig");





//routes
router.post("/user/register",upload.single("user_profile"),controllers.userpost);

router.post("/user/login",controllers.userlogin);

router.get("/user/profile/:_id",controllers.userprofile);




router.put("/user/edit/:id",upload.single("user_profile"),controllers.useredit);

router.delete("/user/delete/:id",controllers.userdelete);

router.put("/user/status/:id",controllers.userstatus);

router.get("/userexport",controllers.userExport);


// Routes for nominee management
router.post("/nominee/register", upload.single("user_profile"), controllers.nomineepost);
router.get("/nominee/profile/:id",controllers.nomineeprofile);
router.get("/nominee/getall",controllers.nomineeget);
router.put("/nominee/edit/:id", upload.single("user_profile"), controllers.nomineeedit);
router.delete("/nominee/delete/:id", controllers.nomineedelete);


//dean login
router.post("/dean/login",controllers.deanlogin);
router.get("/dean/profile/:id",controllers.deanprofile);


//Vote routing
router.post("/vote", controllers.voteExport);
router.get("/winners", controllers.fetchWinners);

//ForgetPassword
router.put("/forgetpassword",  controllers.editPassword);















module.exports = router
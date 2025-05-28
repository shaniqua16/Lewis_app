const router = require("express").Router();

const {createUser,userInfo,userLogIn}= require("../api/authControler");
const {middleware}= require("../api/middlewear");

router.post("/register", createUser);
router.post("/login", userLogIn);
router.get("/me", middleware, userInfo);

module.exports = router;
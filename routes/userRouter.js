const express = require("express");
const router = express.Router();

const {addCartItem,getAllCartItems ,setUser,updateUserDetails}=require("../controllers/userController");


router.route("/login").get(setUser);
router.route("/user-details").put(updateUserDetails);
router.route("/cart").post(addCartItem).get(getAllCartItems);

router.get("/", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});

module.exports = router;

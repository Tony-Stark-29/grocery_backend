const express = require("express");
const router = express.Router();

const {addCartItem,getAllCartItems,deleteCartItem ,setUser,updateUserDetails}=require("../controllers/userController");


router.route("/login").get(setUser);
router.route("/user-details").put(updateUserDetails);
router.route("/cart/:id?").post(addCartItem).get(getAllCartItems).delete(deleteCartItem);

router.get("/", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});

module.exports = router;

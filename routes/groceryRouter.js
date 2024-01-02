const express = require("express");
const {getAllCategory,addNewActegory}=require("../controllers/groceryCategoryController.");

const router = express.Router();

router.route("/category").get(getAllCategory).post(addNewActegory);

module.exports = router;

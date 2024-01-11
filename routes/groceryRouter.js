const express = require("express");
const {getAllCategory,addNewCategory}=require("../controllers/groceryCategoryController.");
const {addNewProduct,getAllProducts, deleteProduct}=require("../controllers/groceryProductsController");
const router = express.Router();

router.route("/category").get(getAllCategory).post(addNewCategory);
router.route("/products").post(addNewProduct).get(getAllProducts);
router.route("/product/:id").delete(deleteProduct);

module.exports = router;

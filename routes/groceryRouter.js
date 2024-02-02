const express = require("express");
const {
  getAllCategory,
  addNewCategory,
  updateCategoryItems,
} = require("../controllers/groceryCategoryController.");
const {
  addNewProduct,
  getAllProducts,
  getProductsByCategory,
  deleteProduct,
  updateProduct,
  getProduct,
 
} = require("../controllers/groceryProductsController");
const router = express.Router();

router.route("/category").get(getAllCategory).post(addNewCategory);
router.route("/category/:id").patch(updateCategoryItems);

router.route("/products").post(addNewProduct).get(getAllProducts);
router.route("/products/:category").get(getProductsByCategory);
router.route("/product/:id").delete(deleteProduct).patch(updateProduct);
router.route("/product/:param").get(getProduct);

module.exports = router;

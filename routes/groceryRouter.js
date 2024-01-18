const express = require("express");
const {
  getAllCategory,
  addNewCategory,
  updateCategoryItems,
} = require("../controllers/groceryCategoryController.");
const {
  addNewProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/groceryProductsController");
const router = express.Router();

router.route("/category").get(getAllCategory).post(addNewCategory);
router.route("/category/:id").patch(updateCategoryItems);

router.route("/products").post(addNewProduct).get(getAllProducts);
router.route("/product/:id").delete(deleteProduct).patch(updateProduct);

module.exports = router;

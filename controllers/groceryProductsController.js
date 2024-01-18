const Joi = require("joi");

const groceryProductModel = require("../models/groceryProducts");
const groceryCategoryModel = require("../models/groceryCategory");

const productJoiSchem = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  unit: Joi.string().required(),
  stock: Joi.number().required(),
  offer: Joi.number(),
  tags: Joi.array(),
  imageUrl: Joi.string().required().label("Product Image"),
});

const addNewProduct = async (req, res) => {
  try {
    //const { category } = req.body;
    //const categoryId = await groceryProductModel.getId(category);
    const data = req.body.item;

    const notValidData = productJoiSchem.validate(data);
    if (notValidData.error) {
      throw Error(notValidData.error);
    }
    const newProduct = await groceryProductModel.newProduct(data);
    res.status(200).json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = req.body.item;
    const { id } = req.params;
    const notValidData = productJoiSchem.validate(data);
    if (notValidData.error) {
      throw Error(notValidData.error);
    }
    const updatedProduct = await groceryProductModel.updateProduct(data, id);
    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await groceryProductModel.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({});
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await groceryProductModel.findByIdAndDelete(id);

    if (deletedItem) {
      res.status(200).json(deletedItem);
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  addNewProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
};

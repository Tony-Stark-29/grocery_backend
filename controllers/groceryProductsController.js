const Joi = require("joi");

const groceryProductModel = require("../models/groceryProducts");
const groceryCategoryModel = require("../models/groceryCategory");

const productJoiSchema = Joi.object({
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

    const notValidData = productJoiSchema.validate(data);
    if (notValidData.error) {
      throw Error(notValidData.error);
    }

    const newProduct = await groceryProductModel.newProduct(data);
    const getCategory = await groceryCategoryModel.findOne({
      category: newProduct.category,
    });
    await groceryCategoryModel.newItems(getCategory._id, [newProduct.name]);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = req.body.item;
    const { id } = req.params;
    const notValidData = productJoiSchema.validate(data);
    if (notValidData.error) {
      throw Error(notValidData.error);
    }
    const updatedProduct = await groceryProductModel.updateProduct(data, id);
    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  const {param} = req.params;
   
  let product = null;
  try {
    if (/^[0-9a-fA-F]{24}$/.test(param)) {
      console.log(param);
      product = await groceryProductModel.findById(param, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });
    } else {
      console.log(param);
      const regex = new RegExp(param, "i");
      product = await groceryProductModel.findOne(
        { name: { $regex: regex } },
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
    }

    if (product) {
      res.json({product});
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await groceryProductModel.find(
      {},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
  
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({});
  }
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const regex = new RegExp(category, "i");
  try {
    const products = await groceryProductModel.find(
      { category: { $regex: regex } },
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
    res.status(200).json({ productsCount: products.length, products });
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

const getProductsWithOffer=async(req,res)=>{

  try {
    const products = await groceryProductModel.find(
      {offer:{$gte:20}},
      { createdAt: 0, updatedAt: 0, __v: 0 }
    );
  
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({});
  }

}

module.exports = {
  addNewProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductsByCategory,
  getProduct,
  getProductsWithOffer
};

const groceryCategoryModel = require("../models/groceryCategory");

const addNewCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const newCategory = await groceryCategoryModel.newCategory(category);
    res.status(200).json({ category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await groceryCategoryModel.find({});

    if (categories) {
      res.status(200).json({ categories });
    }

    if (!categories) {
      res.status(400).json({ error: category.message });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllCategory, addNewCategory };

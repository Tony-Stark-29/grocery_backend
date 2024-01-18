const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groceryCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

groceryCategorySchema.statics.newCategory = async function (category) {
  if (!category) {
    throw Error("Category Required");
  }

  const exists = await this.findOne({ category });

  if (exists) {
    throw Error("Category Already exists");
  }

  const newCategory = await this.create({ category });

  return newCategory;
};

groceryCategorySchema.statics.newItems = async function (id, items) {
  console.log("from modal - ", items.length, " - ", items);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Category Id");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items must be a non-empty array");
  }

  const category = await this.findByIdAndUpdate(
    id,
    { $addToSet: { items } },
    { new: true }
  );

  console.log(category);
  return category;
};

module.exports = mongoose.model("grocery_category", groceryCategorySchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groceryProductsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String, //mongoose.Schema.Types.ObjectId, //store category id
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    offer: {
      type: Number,
    },
    tags: {
      type: [String],
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

groceryProductsSchema.statics.newProduct = async function (data) {


  const isProductExists=await this.findOne({name:data.name});

  if(isProductExists)
  {
    throw Error(`A Product with the similar name exists `)
  }
  const newProduct = await this.create(data);
 
  return newProduct;
};

groceryProductsSchema.statics.updateProduct = async function (data,id) {

  const isProductExists=await this.findById(id);
  if(!isProductExists)
  {
    throw Error(`Product does not exists`)
  }
  const newProduct = await this.findByIdAndUpdate(id,data,{new:true});
  return newProduct;
};

module.exports = mongoose.model("grocery_products", groceryProductsSchema);

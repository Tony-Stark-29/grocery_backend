const mongoose = require("mongoose");

const Schema = mongoose.Schema;
 
const addressSchema = Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

 
const cartItemSchema = Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "grocery_products",
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const likedItemSchema = Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "grocery_products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  billing_address: addressSchema,
  shipping_address: addressSchema,
  cartItems: {
    type: [cartItemSchema],
    validate: {
      validator: function (value) {
       console.log("value",value)
        return (
          value &&
          value.length > 0 &&
          value.every((item) => item._id && item.quantity)
        );
      },
      message: "Cart items are required with productId and quantity.",
    },
  },
  likedItems: [likedItemSchema],
});

userSchema.statics.setUser = async function (user) {
  const userExist = await this.findOne({ _id: user?.user_id });

  if (userExist) {
    return userExist;
  }
  const newUser = await this.insertOne(
    {
      _id: user?.user_id,
      phone_number: user?.phone_number,
    },
    {
      timestamps: true,
    }
  );

  return newUser;
};

module.exports = mongoose.model("users", userSchema);

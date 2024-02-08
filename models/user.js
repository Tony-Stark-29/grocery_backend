const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.trim().length > 0;
      },
      message: "Name is required.",
    },
  },
  phone_number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\+91\d{10}$/.test(value);
      },
      message:
        'Invalid phone number. Must start with "+91" and be followed by 10 digits.',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: "Invalid email address.",
    },
  },

  street: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.trim().length > 0;
      },
      message: "Street is required.",
    },
  },
  area: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.trim().length > 0;
      },
      message: "Area is required.",
    },
  },
  city: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.trim().length > 0;
      },
      message: "City is required.",
    },
  },
  state: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.trim().length > 0;
      },
      message: "State is required.",
    },
  },
  pin_code: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{6}$/.test(value); 
      },
      message: "Invalid PIN code. Must be a 6-digit numeric value.",
    },
  },
  country: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.trim().length > 0;
      },
      message: "Country is required.",
    },
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
    validate: {
      validator: function (value) {
        return  mongoose.Types.ObjectId.isValid(value);
      },
      message: "Invalid Id",
    },
  },
});

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  display_name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone_number: {
    type: String,
    required: true,
  },
  billing_address: { type: addressSchema },
  shipping_address: { type: addressSchema },
  cartItems: {
    type: [cartItemSchema],
    validate: {
      validator: function (value) {
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
  const userExist = await this.findOne(
    { _id: user?.user_id },
    { cartItems: 0, likedItems: 0, __v: 0, timestamps: 0 }
  );

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

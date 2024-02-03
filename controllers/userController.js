const mongoose = require("mongoose");
const groceryProducts = require("../models/groceryProducts");
const user = require("../models/user");
const userModal = require("../models/user");

const setUser = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];

  try {
    const user = await userModal.setUser(req?.user);

    if (user) {
      res.status(200).json({ user });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const isValidProduct = async (item) => {
  console.log(item);
  const isProductExist = await groceryProducts.findById(item?._id);

  if (!isProductExist || isProductExist?.stock === 0) return false;

  return true;
};

const addCartItem = async (req, res) => {
  const itemToAdd = req.body?.item;
  const user_id = req?.user?.user_id;

  try {
    const user = await userModal.findOne({ _id: user_id });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await isValidProduct(itemToAdd);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Product Not Available to add to your cart" });
    }
    const existingCartItem = user.cartItems.find(
      (cartItem) => cartItem._id.toString() === itemToAdd._id.toString()
    );

    if (existingCartItem) {
      existingCartItem.quantity += itemToAdd.quantity || 1;
    } else {
      user.cartItems.push(itemToAdd);
    }

    const updatedUser = await user.save();

    res.status(200).json({ item: updatedUser.cartItems });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCartItems = async (req, res) => {
  const user_id = req?.user?.user_id;
  try {
    const userData = await userModal.findById(user_id);

    if (!userData) {
      res.status(400).json({ error: userData?.error });
    }

    const cartItemWithDetails = await getCartItemsWithDetails(user_id);

    res.status(200).json({ cartItems: cartItemWithDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCartItemsWithDetails = async (userId) => {
  try {
    console.log(userId);

    const cartItemsWithDetails = await user.aggregate([
      { $match: { _id: userId } },
      {
        $unwind: "$cartItems",
      },
      {
        $lookup: {
          from: "grocery_products",
          localField: "cartItems._id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: "$cartItems._id",
          quantity: "$cartItems.quantity",
          name: "$productDetails.name",
          imageUrl: "$productDetails.imageUrl",
          price: "$productDetails.price",
        },
      },
    ]);

    return cartItemsWithDetails;
  } catch (error) {
    console.error("Error getting cart items with details:", error);
    throw error;
  }
};

const updateUserDetails = async (req, res) => {
  const userDetailsToUpdate = req.body;
  const user_id = req?.user?.user_id;

  try {
    const updatedDetails = await userModal.findOneAndUpdate({ _id: user_id },userDetailsToUpdate,{new:true});

    if (!updatedDetails) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ user:updatedDetails});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { setUser, addCartItem, getAllCartItems, updateUserDetails };

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

const updateUserDetails = async (req, res) => {
  const userDetailsToUpdate = req.body;
  const user_id = req?.user?.user_id;

  try {
    const updatedDetails = await userModal.findOneAndUpdate({ _id: user_id },userDetailsToUpdate,{new:true,runValidators: true });

    if (!updatedDetails) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ user:updatedDetails});
  } catch (error) {

    console.log(error.message);
     if (error.name === 'ValidationError') {
      const formattedErrors = Object.values(error.errors).map(({ path }) =>  path);
      return res.status(400).json({ error: "required fields :"+formattedErrors.join(', ') });
    }
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

    if(!updatedUser)
    {
      res.status(400).json({message:"Item Not added to Cart"})
    }
    res.status(200).json({message:"Item added to Cart"});
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

const deleteCartItem=async(req,res)=>{

  const user_id = req.user?.user_id;
  const cartItemId=req.params.id;
  try {
    const userData = await userModal.findById(user_id);

    if (!userData) {
      res.status(400).json({ error: userData?.error });
    }

    const updateCartItems = await user.findOneAndUpdate({_id:user_id},{$pull: { cartItems: { _id: new mongoose.Types.ObjectId(cartItemId) } }});

    if(!updateCartItems)
    {
      res.status(400).json({message:"Error Item Deleted" });
    }
    res.status(200).json({message:"Item Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  // $pull: { cartItems: { _id: new ObjectId(cartItemId) } }

}



module.exports = { setUser, addCartItem,deleteCartItem, getAllCartItems, updateUserDetails };

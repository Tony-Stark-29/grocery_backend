const groceryProductModel = require("../models/groceryProducts");
const groceryCategoryModel = require("../models/groceryCategory");

const addNewProduct = async (req, res) => {
  try {
    //const { category } = req.body;
    //const categoryId = await groceryProductModel.getId(category);
    const data=req.body.item;
    const newProduct = await groceryProductModel.newProduct(data);
    res.status(200).json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getAllProducts=async(req,res)=>{

  try
  {
    
  const products=await groceryProductModel.find();
  res.status(200).json({products})
  }catch(error)
  {
    res.status(400).json({})
  }
}


const deleteProduct=async(req,res)=>{

  const {id}=req.params;
  console.log(id)

  try{

    const deletedItem=await groceryProductModel.findByIdAndDelete(id);
    
    if(deletedItem)
    {
      res.status(200).json(deletedItem)
    
    }
    else
    {
      res.status(404).json({ success: false, message: 'Item not found' });
    }

  }catch(error)
  {
    res.status(404).json({message:error.message});
  }


}

module.exports = { addNewProduct ,getAllProducts,deleteProduct};

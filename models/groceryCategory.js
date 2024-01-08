const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groceryCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique:true
    },
    items: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);


groceryCategorySchema.statics.newCategory=async function(category)
{
    if(!category)
    {
        throw Error("Category Required");
    }

    const exists=await this.findOne({category});

    if(exists)
    {
        throw Error("Category Already exists");
    }

    const newCategory=await this.create({category});

    return newCategory;

}


groceryCategorySchema.statics.newItems=async function(_id,items)
{

    if(!category)
    {
        throw Error("Category required");
    }
    if(!items)
    {
        throw Error("items required");
    }

}


 


module.exports=mongoose.model("grocery_category",groceryCategorySchema);
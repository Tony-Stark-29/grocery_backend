const express=require('express');

const router=express.Router();

router.route("/login").get((req,res)=>{

    res.status(200).json({msg:"Login user"})

});
router.route("/signup").get((req,res)=>{

    res.status(200).json({msg:"Signup user"})

});

router.get("/",(req,res)=>{
    res.status(404).json({msg:"Page Not Found"})
})

module.exports= router;

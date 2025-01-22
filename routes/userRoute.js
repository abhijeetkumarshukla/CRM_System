const express = require('express');
const UserModel = require('../models/userModel');

const userRouter = express.Router();

userRouter.post('/register',async(req,res)=>{
    const {name,email,phone,company}=req.body;
    try {
         const user= new UserModel({
            name,
            email,
            phone,
            company
         });
         await user.save()
         res.status(201).json(`you are registered as user${user}`)
    } catch (error) {
        res.status(400).json(error)
    }
})

userRouter.get('/',async(req,res)=>{
    try {
        const users = await UserModel.find();
        res.status(201).json({users})
    } catch (error) {
        res.status(400).json(error)
    }
})


userRouter.delete("/delete/:id", async (req, res) => {
    const userid = req.params.id;
    const payload = req.body;
    try {
      const deleteUser = await UserModel.findByIdAndDelete(
        { _id: userid },
        payload
      );
      return res.status(201).json("user deleted.");
    } catch (error) {
      res.status(400).json(error);
    }
  });


  userRouter.post('/login',async(req,res)=>{
    const {name,email} = req.body;
    try {
        const user = await UserModel.findOne({email})
        
        return res.status(201).json(`login Done ${user}`)
       
    } catch (error) {
        res.status(400).json(error)
    }
  })


module.exports = userRouter;
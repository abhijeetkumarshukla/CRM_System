const express = require('express');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userRouter = express.Router();

userRouter.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
              
                const user= new UserModel({
                    name,
                    email,
                    password: hashedPassword,
                    
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
    const {password,email} = req.body;
    try {
        const user = await UserModel.findOne({email})
        
        if (!user) {
            return res.send("user not found.");
          }
          const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json("Invalid credentials.");
        }

        const token = jwt.sign({"email": user.email, "name": user.name, "userID":user.id },process.env.JWT_SECRET)

        res.status(200).json({message:`Login Succesfull : ${user.name}`, "token": token} )
       
    } catch (error) {
        res.status(400).json(error)
    }
  })


module.exports = userRouter;
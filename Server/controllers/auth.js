import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//Register User

export const register = async(req,res) =>{
    try{

        const {firstName,lastName,email,password,picturePath,friends,location,occupation} = req.body;
        var salt = await bcrypt.genSalt();
        const hash = 10;
        var passwordHash = await bcrypt.hash(password,hash);
        const newUser = new User({
            firstName,lastName,email,password: passwordHash,picturePath,friends,location,occupation
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(error){

        res.status(500).json({error: error.message});
    }
}

//login an user

export const login = async(req,res) =>{

    try{

        const {email,password} = req.body
        const user = await User.findOne({email: email})
        if(!user){
            res.status(400).json({error: "user does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            res.status(400).json({msg: "Incorrect Password!"})
        }

        const token = jwt.sign({id: user._id},process.env.SECRET);
        const currentUser = await User.findOne({email: email}).select("-password")
        res.status(200).json({token,currentUser})

    }catch(error){
        res.status(500).json({error: error.message});
    }
}
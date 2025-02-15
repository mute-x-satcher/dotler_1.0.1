const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const genrateToken = require('../config/genrateToken');
const registerUser = asyncHandler(async (req,res)=>{

        const {name,email,password,gurdian_info} = req.body;

        if(!name || !email || !password || !gurdian_info){
            res.status(400);
            throw new Error('Please fill all fileds');
        }

        const userExists = await User.findOne({email});

        if(userExists){
            res.status(400);
            throw new Error('User already exists');
        }

       const user = await User.create({
        name,
        email,
        gurdian_info,
        password,
       });

       if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            gurdian_info: user.gurdian_info,
            email: user.email,
            password: user.password,
            token:genrateToken(user._id),
        })
    }
    else{
        res.status(400);
        throw new Error('Faild to create User');
    }
});

const authUser = asyncHandler(async(req,res)=>{
        const {email,password} = req.body;
        console.log(email,password);
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                gurdian_info: user.gurdian_info,
                email: user.email,
                password: user.password,
                token:genrateToken(user._id),
            })
        }
        else{
            res.status(400);
            throw new Error('Invalid Email or Password');
        }
}) 

const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ?{
        $or:[
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    }:{};

    const users = await User.find(keyword).find({_id:{$ne: req.user._id}}   );
    res.send(users);
    

})  


module.exports = {registerUser,authUser,allUsers};

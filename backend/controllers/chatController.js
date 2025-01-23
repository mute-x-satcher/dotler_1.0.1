const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('userId not found with request');
    return res.status(400).json({ message: "UserId not provided in request" });
  }

//   const userObjectId = mongoose.Types.ObjectId(userId);//Chat GPT code

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]); // Return after sending the response.
    }

    // Create a new chat if none exists
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);

    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    return res.status(200).send(FullChat); // Return after sending the response.
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to access or create chat", error: error.message });
  }
});

const fetchChat = asyncHandler(async(req,res)=>{
  try{
     Chat.find({users:{$elemMatch:{$eq: req.user._id } } }).then(result=>{res.send(result)}); 
  } catch(error){
    res.status(400);
    throw new Error(error.message);
  } 
})

module.exports = { accessChat , fetchChat};

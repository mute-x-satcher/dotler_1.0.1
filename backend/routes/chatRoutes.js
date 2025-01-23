const express = require('express');
const {accessChat,fetchChat} = require('../controllers/chatController');
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

router.route('/').post(protect,accessChat);
router.route('/').get(protect,fetchChat);
// router.route('/group').post(protect,createGroupChat);
// router.route('/rename').put(protect,renameGroupChat);
// router.route('/removegroup').put(protect,removeFromGroup);
// router.route('/addgroup').put(protect,addToGroup);



module.exports = router;
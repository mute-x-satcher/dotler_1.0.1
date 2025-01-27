const express = require('express');
const dotenv = require('dotenv')
const { connectDB } = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/usersRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {notFound,errorHandler} = require('./middleware/errorMiddleware');


const app = express();
app.use(express.json());

dotenv.config();
connectDB();

app.get('/',(req,res)=>{
    res.send('API is running Successfuly');
})


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes); 


app.use(notFound);
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{console.log(`Server has started on PORT:${PORT}`.yellow.bold)});
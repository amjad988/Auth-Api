const express=require("express")
const app=express()
const authRoute=require('./routes/auth.route')
const mongoose=require('mongoose')

const PORT=4000

mongoose.connect('mongodb://localhost:27017/authDB')
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });


//middlewares
app.use(express.json())
//route middleware
app.use('/api/user',authRoute)


app.listen(PORT,()=>console.log("Server Running"))
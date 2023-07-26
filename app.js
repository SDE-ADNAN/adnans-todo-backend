// lib imports
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require("dotenv");
const cors = require('cors');
const mongoose = require('mongoose');

// project imports
const logger = require("./logger/index")
const adminRoutes = require('./routes/admin');




const app = express();

dotenv.config({
    path:"./ENV/config.env"
})

app.use(cors());

const upload = multer(); // multer instance

app.use(upload.any()); // middleware to handle form-data
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json())
// app.use(express.json())

app.use('/admin', adminRoutes);

app.use('/',(req,res,next)=>{
    res.send("<h1>Welcome to todo backend </h1>")
})

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.7jzqj8i.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Max',
    //       email: 'max@test.com',
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save();
    //   }
    // });
    app.listen(process.env.PORT);
    logger.warn("////////////// MONGODB CONNECTED //////////////")
    logger.error(process.env.MONGO_USERNAME)
  })
  .catch(err => {
    console.log(err);
  });

var host  = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])

logger.info("your localhost is : http://localhost:"+ process.env.PORT);
logger.info("for access on other devices (on same network) : http://"+ host +":"+process.env.PORT+"/");
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require("dotenv");
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const logger = require("./logger/index")


const app = express();

dotenv.config({
    path:"./ENV/config.env"
})

app.use(cors());

const upload = multer(); // multer instance

app.use(upload.any()); // middleware to handle form-data
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use('/admin', adminRoutes);

app.use('/',(req,res,next)=>{
    res.send("<h1>Welcome to todo backend </h1>")
})

app.listen(process.env.PORT)

var host  = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])

logger.info("your localhost is : http://localhost:"+ process.env.PORT);
logger.info("for access on other devices (on same network) : http://"+ host +":"+process.env.PORT+"/");
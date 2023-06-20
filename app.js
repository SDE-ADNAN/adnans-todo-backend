const path = require('path');
const path2 = require("./utils/path");
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const adminRoutes = require('./routes/admin');
const cors = require('cors');
const multer = require('multer');
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

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on Port ${process.env.PORT}`)
})

var host  = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])

console.log("your localhost is : "+ host);
console.log("for access on other devices (on same network) : "+ host +":"+process.env.PORT+"/");




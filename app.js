const path = require('path');
const path2 = require("./utils/path")
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv")
const adminRoutes = require('./routes/admin');
const app = express();

dotenv.config({
    path:"./ENV/config.env"
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on Port ${process.env.PORT}`)
    console.error(path2)
})

var host  = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])

console.log("your localhost is : "+ host);
console.log("for access on other devices (on same network) : "+ host +":"+process.env.PORT+"/");




const path = require('path');

const path2 = require("./utils/path")

const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require("dotenv")
const adminRoutes = require('./routes/admin');

dotenv.config({
    path:"./ENV/config.env"
})

const app = express();

// app.use((req,res,next)=>{
//     next();
// })

// app.get("/",(req,res)=>{
//     console.log(req.headers)
//     res.status(200).send({
//         name: "ADNAN KHAN",
//         post: "Software engineer",
//     })
// })
// app.get("/getJson",(req,res)=>{
//     console.log(req.headers)
//     res.sendFile( __dirname + "/index.html" )
// })
app.use('/admin', adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on Port ${process.env.PORT}`)
    console.error(path2)
})

var host  = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])

console.log("your localhost is : "+ host);
console.log("for access on other devices (on same network) : "+ host +":"+process.env.PORT+"/");




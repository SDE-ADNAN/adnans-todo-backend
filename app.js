const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 3030;

const cors = require('cors');

// ...

app.use(cors());


app.use((req,res,next)=>{
    next();
})

app.get("/",(req,res)=>{
    console.log(req.headers)
    res.sendFile( __dirname + "/index.html" )
})
app.get("/getJson",(req,res)=>{
    console.log(req.headers)
    res.status(200).send({
        name: "ADNAN KHAN",
        post: "Software engineer",
    })
})


app.listen(port);
console.log(`running at port : ${port}`)

var host  = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])

console.log("your localhost is : "+ host);
console.log("for access on other devices (on same network) : "+ host +":"+port+"/");
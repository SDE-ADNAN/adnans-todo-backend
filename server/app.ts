// lib imports
import express from 'express';
// import bodyParser from 'body-parser');
import multer from 'multer';
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import os from 'os';
import path from 'path';

const networkInterfaces = os.networkInterfaces();
const hostAddresses: string[] = [];

// project imports
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';

const app = express();

dotenv.config({
  path: "./ENV/config.env"
})

app.use(cors({
  origin: '*', // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials:true
}));

app.use(session({
  secret: 'your-secret-key', // Change this to your own secret key
  resave: false,
  saveUninitialized: true
}));

const upload = multer(); // multer instance

app.use(upload.any()); // middleware to handle form-data
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json())
// app.use(express.json())

app.use('/jarvis/auth', authRoutes);
app.use('/jarvis/admin', adminRoutes);

// app.use('/', (req, res, next) => {
//   res.send("<h1>Welcome to todo backend </h1>")
// })

// for serving clientside react pages ( which are built using "npm run build" or "vite build")
app.use(express.static("public"));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

mongoose
  .connect(
    process.env.MONGO_CONNECT_URL || ''
  )
  .then(result => {
    app.listen(process.env.PORT, "0.0.0.0" as any);
    console.log("////////////// MONGODB CONNECTED //////////////");
  })
  .catch(err => {
    console.log(err);
  });

Object.values(networkInterfaces).forEach((interfaces) => {
  if(interfaces)
  interfaces.forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      hostAddresses.push(iface.address);
    }
  });
});


console.log("your localhost is : http://localhost:" + process.env.PORT+'/jarvis');
console.log("for access on other devices (on same network) : http://" + hostAddresses[0] + ":" + process.env.PORT + "/jarvis");
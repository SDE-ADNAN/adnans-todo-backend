// lib imports
const express = require('express');
// const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require("dotenv");
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

// project imports
const logger = require("./logger/index")
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

dotenv.config({
  path: "./ENV/config.env"
})

app.use(cors());
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

app.use('/', (req, res, next) => {
  res.send("<h1>Welcome to todo backend </h1>")
})

mongoose
  .connect(
    process.env.MONGO_CONNECT_URL
  )
  .then(result => {
    app.listen(process.env.PORT, '0.0.0.0');
    logger.warn("////////////// MONGODB CONNECTED //////////////")
  })
  .catch(err => {
    console.log(err);
  });

var host = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])

logger.info("your localhost is : http://localhost:" + process.env.PORT);
logger.info("for access on other devices (on same network) : http://" + host + ":" + process.env.PORT + "/");
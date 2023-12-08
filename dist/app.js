"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib imports
const express_1 = __importDefault(require("express"));
// import bodyParser from 'body-parser');
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const os_1 = __importDefault(require("os"));
const networkInterfaces = os_1.default.networkInterfaces();
const hostAddresses = [];
// project imports
const admin_1 = __importDefault(require("./routes/admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
dotenv_1.default.config({
    path: "./ENV/config.env"
});
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
const upload = (0, multer_1.default)(); // multer instance
app.use(upload.any()); // middleware to handle form-data
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json())
// app.use(express.json())
app.use('/jarvis/auth', auth_1.default);
app.use('/jarvis/admin', admin_1.default);
app.use('/', (req, res, next) => {
    res.send("<h1>Welcome to todo backend </h1>");
});
mongoose_1.default
    .connect(process.env.MONGO_CONNECT_URL || '')
    .then(result => {
    app.listen(process.env.PORT, "0.0.0.0");
    console.log("////////////// MONGODB CONNECTED //////////////");
})
    .catch(err => {
    console.log(err);
});
// var host = Object.values(require('os').networkInterfaces()).reduce((r:string, list) => r.concat(list.reduce((rr:string, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])
Object.values(networkInterfaces).forEach((interfaces) => {
    if (interfaces)
        interfaces.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                hostAddresses.push(iface.address);
            }
        });
});
console.log("your localhost is : http://localhost:" + process.env.PORT + '/jarvis');
console.log("for access on other devices (on same network) : http://" + hostAddresses[0] + ":" + process.env.PORT + "/jarvis");

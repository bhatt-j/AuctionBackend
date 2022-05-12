const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require("dotenv/config")
var port = process.env.PORT || 4000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.urlencoded({ extended: true }));

const dbURI = process.env.DB_URL
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
    console.log('connected to DB')
})
.catch((err) => {
    console.log(err)
})
app.set('port', port);

app.listen(port, () => {
   console.log("server running at port 4000")
});

// app.use(function (req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "X-Requested-With,content-type, Accept"
//     );
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
//   });


app.use(express.json());
app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));


app.use('/uploads',express.static(path.join(__dirname)));

const fileRouter = require('./routes/fileUpload');
app.use('/fileApi',fileRouter);

const feedbackRouter = require('./routes/feedbackRoute');
app.use('/feedback',feedbackRouter);

const adminRouter = require('./routes/adminRoute');
app.use('/admin',adminRouter);

const walletRouter = require('./routes/walletRoute');
app.use('/wallet',walletRouter);


const transactionRouter = require('./routes/transactionRoute');
app.use('/transaction',transactionRouter);

const auctionRouter = require('./routes/auctionRoute');
app.use('/auction',auctionRouter);

const userRouter = require('./routes/userRoute');
app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send("home page here");
})







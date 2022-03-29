const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.urlencoded({ extended: true }));

const dbURI = 'mongodb+srv://auction12:auction12@cluster0.bw0ms.mongodb.net/online-auction?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
    console.log('connected to DB')
    app.listen(4000, () => console.log("server running at port 4000"));
})
.catch((err) => {
    console.log(err)
})

app.use(express.json());
app.use(bodyParser.json());

app.use('/uploads',express.static(path.join(__dirname)));

const fileRouter = require('./routes/fileUpload');
app.use('/fileApi',fileRouter);

const adminRouter = require('./routes/adminRoute');
app.use('/admin',adminRouter);

const walletRouter = require('./routes/walletRoute');
app.use('/wallet',walletRouter);


const transactionRouter = require('./routes/transactionRoute');
app.use('/transaction',transactionRouter);

const categoryRouter = require('./routes/categoryRoute');
app.use('/category',categoryRouter);

const chatRouter = require('./routes/chatRoute');
app.use('/chat',chatRouter);

const auctionRouter = require('./routes/auctionRoute');
app.use('/auction',auctionRouter);

const userRouter = require('./routes/userRoute');
app.use('/user', userRouter);

const productRouter = require('./routes/productRoute');
app.use('/product', productRouter);

app.get('/', (req, res) => {
    res.render('index');
})






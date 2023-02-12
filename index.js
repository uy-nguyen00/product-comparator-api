const express = require('express');
const cors = require('cors');

// Router
const userRouter = require('./app/routers/UserRouter');
const productRouter = require('./app/routers/ProductRouter');

// Authentication
const passport = require('passport');

const app = express();

// Middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cors());

// Routes
app.use('/user', userRouter);
app.use('/product', productRouter);


app.listen(3000, () => {
    console.log('App listening on port 3000!')
})
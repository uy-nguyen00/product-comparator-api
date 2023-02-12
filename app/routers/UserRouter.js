const userRouter = require('express').Router();
const userController = require("../controllers/UserController");

// SIGNUP
userRouter.get('/signup', (req, res) => {
    res.send('signup page');
});

userRouter.post('/signup', userController.create);

// LOGIN
userRouter.get('/login', (req, res) => {
    res.send('login page');
});

userRouter.post('/login', userController.logIn);

// todo
// LOGOUT
userRouter.post('/logout', userController.authenticate(), (req, res, next) => {
    const response = userController.logOut(req);
    res.status(response.status).json({
        [response.type]: response.message
    });
});

module.exports = userRouter;
const axiosInstance = require('../../config/restdb/restdb');
const {handleError} = require("../handlers/errorHandler");
const {handleResponse} = require("../handlers/responseHandler");

const passport = require('passport');
const jwt = require("jsonwebtoken");
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const secret = 'thisismysecret';
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

const collection = 'app-users';

passport.use(
    new JwtStrategy(jwtOptions, async (payload, next) => {
        const user = await getByEmail(payload.email);
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    })
);

async function create(req, res) {
    try {
        let response;
        const email = req.body.email;
        const password = req.body.password;

        const user = await getByEmail(email);
        if (user) {
            response = {
                status: 400,
                type: 'error',
                message: 'User already exists!'
            }
        } else {
            const requestResponse = await axiosInstance.post(collection, {
                email: email,
                password: password
            });
            response = {
                status: requestResponse.status,
                type: 'data',
                message: requestResponse.data
            }
        }
        handleResponse(response, req, res);

    } catch (error) {
        handleError(error, req, res);
    }
}

async function logIn(req, res) {
    try {
        let response;
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            response = {
                status: 401,
                type: 'error',
                message: 'Email or password was not provided.'
            }
            handleResponse(response, req, res);
            return;
        }

        const user = await getByEmail(email);
        if (!user || user.password !== password) {
            response = {
                status: 401,
                type: 'error',
                message: 'Email or password does not match.'
            }
            handleResponse(response, req, res);
            return;
        }

        response = {
            status: 200,
            type: 'jwt',
            message: jwt.sign({email: user.email}, secret)
        }
        handleResponse(response, req, res);

    } catch (error) {
        handleError(error, req, res);
    }
}

// todo fix or delete
function logOut(req) {
    const header = req.headers['authorization'];
    console.log(req.user);
    const message = jwt.sign(header, ' ');
    return {
        type: 'success',
        status: 200,
        message: message
    };
}

function authenticate() {
    return passport.authenticate('jwt', {session: false, failureRedirect: '/user/login'});
}

async function getByEmail(email) {
    try {
        const response = await axiosInstance.get(collection + `?q={"email":"${email}"}`);
        if (response) {
            return response.data[0];
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create: create,
    logIn: logIn,
    logOut: logOut,
    authenticate: authenticate,
}
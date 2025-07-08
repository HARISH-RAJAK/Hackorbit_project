const express = require('express');
const path = require('path');
const ejs = require('ejs');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.use(expressSession({
    secret: 'Code_thrust_is_the_best_team',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userRouter.serializeUser());
passport.deserializeUser(userRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

app.use('/', indexRouter);  



app.listen(3000, () => {
    console.log('server is running on port 3000');
});

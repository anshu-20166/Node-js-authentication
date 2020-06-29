const express = require('express');
const cookieParser = require('cookie-parser');//for cookies and session
const app = express();
const port = 8001;
const expressLayouts = require('express-ejs-layouts');//for layouts
const db = require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const flash = require('connect-flash');//for display messages
//passport js
const passportLocal=require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
app.use(express.urlencoded());//chnged
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);
app.use(flash());
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

`   `


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
//mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(100*60*100)//in milli seconds
    },
    store:new MongoStore({
    
            mongooseConnection:db,
            autoRemove:'disabled'
    },
    function(err)
    {
        console.log(err || 'connect-mongodb setup ok');
    }
    )
    
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes'));
app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});

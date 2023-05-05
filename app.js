const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
// app.enable('trust proxy');

const db = process.env.mongoURI;
mongoose.connect(db, {useNewUrlparser: true})
    .then(()=> console.log('MongoDB Connected'))
    .catch(err=> console.log(err));


/**
 * helmet package raising below error
 * Refused to load the script 'https://unpkg.com/vue@3/dist/vue.global.js' because it violates the following Content Security Policy directive: 
 * "script-src 'self'". Note that 'script-src-elem' was not explicitly set, so 'script-src' is used as a fallback
 */
// app.use(helmet());
app.use(morgan('combined'));
// Bodyparser aceepts only JSON request body
app.use(express.json());
// Serve static files like html, css etc.
app.use(express.static('./public'));

const notFoundPath = path.join(__dirname, './public/404.html');

// Routes
app.use('/',  require('./routes/index'));

app.use((req, res, next)=> {
    res.status(404).sendFile(notFoundPath);
})

// Error Middleware for HTTP
app.use((error, req, res, next)=> {
    if(error.status){
        res.status(error.status)
    }else{
        res.status(500)
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '' : error.stack
    })
})

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`Server running at http://localhost:${port}`);
})


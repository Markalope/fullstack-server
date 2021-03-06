const express = require('express');
const morgan = require('morgan');
const { resolve } = require('path');
const app = express();
const errorHandler = require('./util/error-handler');

// add our mongoose plugins
require('./models/register-plugins');
const redirectHttp = require('./util/redirect-http');
const checkConnection = require('./util/check-connection');

// COMMON MIDDLEWARE
if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp());
}

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// ROUTES
const auth = require('./routes/auth');


// const ensureAuth = createEnsureAuth();

if(process.env.NODE_ENV !== 'production') {
    app.use(checkConnection());
}

// app.use for each route format => app.use('/api/auth', auth);

app.use('/api/auth', auth);


// CATCH ALL for SPA
app.use((req, res) => {
    res.sendFile('index.html', { 
        root: resolve(__dirname + '/../public/') 
    });
});

// ERROR HANDLER
app.use(errorHandler());

module.exports = app;
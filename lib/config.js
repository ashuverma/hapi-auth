'use strict';

var internals = {};

internals.constants = {
    DAYS: 24 * 60 * 60 * 1000,
    HOURS: 60 * 60 * 1000 
};

try {
    var Credentials = require('./credentials.json');    
} catch (err) {
    throw Error('Please create a credentials.json file similiar to the sample file.');
}

module.exports = {
    credentials: Credentials, 
    allowOAuth: true,
    allowLocal: true,
    availableProviders: [
        'facebook',
        'twitter'
    ],
    allowedProviders: [
        'facebook',
        'twitter'
    ],
    serverLabels: [],
    session: {
        expiresIn: 3 * internals.constants.DAYS,
        sessionSegment: 'sessions',
        cookieName: 'sid'
    }
};

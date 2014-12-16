'use strict';

var Uid = require('uid-safe');
var internals = {};

module.exports = internals;

//Session handler
internals.session = function (request, reply) {
    if (!request.auth.isAuthenticated) {
        return reply(request.auth.error.message);
    }

    var account = request.auth.credentials;
    
    //You may want to do a lookup for the user to update your DB.
    
    var sessionCache = this.cache;

    Uid(24, function (err, sessionId) {
        if (err) {
            request.log(['error'], err.message);
        }

        sessionCache.set(sessionId, { account: account }, 0, function (err) {
            if (err) {
                reply(err);
            }

            request.auth.session.set({
                sid: sessionId
            });

            reply.redirect('/home');
        });
    });
};

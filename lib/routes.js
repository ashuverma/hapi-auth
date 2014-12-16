'use strict';

module.exports = function (settings) {
    var handler = require('./handlers');

    var routes = [
        //Facebook Authentication
        {
            method: 'GET',
            path: '/auth/facebook',
            config: {
                auth: {
                    strategy: 'facebook',
                    mode: 'try'
                },
                handler: handler.session
            }
        },

        //Twitter authentication 
        {
            method: ['GET', 'POST'],
            path: '/auth/twitter',
            config: {
                auth: {
                    strategy: 'twitter',
                    mode: 'try'
                },
                handler: handler.session
            }
        },

        //Logout
        {
            method: 'GET',
            path: '/auth/logout',
            config: {
                auth: 'session',
                handler: function (request, reply) {
                    request.auth.session.clear();
                    reply.redirect('/');
                }
            }
        }
    ];

    return routes;
};
'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
    host: '127.0.0.1',
    port: 3000,
    labels: ['account']
});

var authPlugin = require('../');

server.register({
    register: authPlugin,
    options: {
        session: {
            expiresIn: 7 * 24 * 60 * 60
        },
        serverLabels: ['account'],
        allowedProviders: ['facebook', 'twitter']
    }
}, function (err) {
    if (err) {
        throw err;
    }

    server.route({
        path: '/',
        method: 'GET',
        handler: function (request, reply) {
            reply('<center><a href="/auth/facebook">Login With Facebook</a><br><br>'
                + '<a href="/auth/twitter">Login With Twitter</a></center>');
        }
    });

    server.route({
        path: '/home',
        method: 'GET',
        config: {
            auth: 'session'
        },
        handler: function (request, reply) {
            reply('Welcome ' + request.auth.credentials.profile.displayName + '   <a href="/auth/logout">Logout</a>');
        }
    });

    server.start(function () {
        console.log('Server started on ', server.info.uri);
    });
})

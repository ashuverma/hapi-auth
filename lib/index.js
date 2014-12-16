'use strict';

var Hoek = require('hoek');

//setup session cache
function _cacheSetup(plugin, settings) {
    var cacheSetting = {
        segment: settings.session.sessionSegment,
        expiresIn: settings.session.expiresIn
    };

    if (settings.session.sessionCacheName) {
        cacheSetting.cache = settings.session.sessionCacheName;
    }

    var cache = plugin.cache(cacheSetting);

    plugin.app.cache = cache;
    plugin.bind({
        cache: plugin.app.cache
    });

    return cache;
}

module.exports.register = function (server, options, next) {
    var Config  = require('./config');

    //override default configs
    var settings = Hoek.applyToDefaults(Config, options);
    
    var plugin = server.select(settings.serverLabels);

    var cache = _cacheSetup(plugin, settings);
    
    var pluginsToLoad = [require('hapi-auth-cookie')];

    if (settings.allowOAuth) {
        pluginsToLoad.push(require('bell'));
    }

    plugin.register(pluginsToLoad, function (err) {
        if (err) {
            throw err;
        }

        if (settings.allowOAuth) {
            settings.allowedProviders.forEach(function (provider) {
                if (settings.availableProviders.indexOf(provider) !== -1) {
                    plugin.auth.strategy(provider, 'bell', settings.credentials[provider]);
                }
            });
        }

        plugin.auth.strategy('session', 'cookie', {
            password: 'secretagain',
            cookie: 'sid',
            isSecure: false,
            validateFunc: function (session, cb) {
                cache.get(session.sid, function (err, cached) {
                    return (err) ? 
                        cb(err, false) : ((cached) ? 
                            cb(null, true, cached.account) : cb(null, false));
                });
            }
        });
        
        var routes = require('./routes')(settings);
        plugin.route(routes);
        next();
    });
};

module.exports.register.attributes = {
    pkg: require('../package.json')
};

var request = require('request');

var bignumJSON = require('json-bignum');

var async = require('async');

var Q = require('q');


var FBExtension = function (fb_app_id, fb_app_secret) {
    require('events').EventEmitter.call(this);
    this.app_id = fb_app_id;
    this.fb_app_secret = fb_app_secret;
    this.graph_api_host = 'https://graph.facebook.com/'
    this.graph_api_version = '2.3';
    this.graph_api_url = this.graph_api_host.concat('v'.concat(this.graph_api_version)).concat('/');
};

require('util').inherits(FBExtension, require('events').EventEmitter);


FBExtension.prototype.permissionsGiven = function (uid, accessToken, cb) {
    var deferred = Q.defer();
    var method = 'permissions';
    var url = this.graph_api_url.concat(uid).concat('/'.concat(method)).concat('?access_token='.concat(accessToken));
    request(url, function (e, res, body) {
        if (!e) {
            if (res.statusCode == 200) {
                var bodyJSON = bignumJSON.parse(body);
                deferred.resolve(bodyJSON.data);
            } else {
                deferred.reject({
                    error: {
                        statusCode: res.statusCode
                    }
                });
            }
        } else {
            deferred.reject({
                error: e
            });
        }


    });

    deferred.promise.nodeify(cb);
    return deferred.promise;
};

FBExtension.prototype.friendsUsingApp = function (uid, accessToken, cb) {
    var deferred = Q.defer();
    var method = 'friends';
    var url = this.graph_api_url.concat(uid).concat('/'.concat(method)).concat('?access_token='.concat(accessToken));
    console.log(url);
    request(url, function (e, res, body) {
        if (e) {
            deferred.reject({
                error: e
            });
        } else {
            if (res.statusCode == 200) {
                var bodyJSON = bignumJSON.parse(body);

                if (!bodyJSON.error) {
                    deferred.resolve(bodyJSON.data);
                } else {
                    deferred.reject({
                        error: bodyJSON.error
                    });
                }

            } else {
                deferred.reject({
                    error: {
                        statusCode: res.statusCode
                    }
                });
            }
        }
    });

    deferred.promise.nodeify(cb);
    return deferred.promise;
};

module.exports = FBExtension;
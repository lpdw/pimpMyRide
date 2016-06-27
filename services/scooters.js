'use strict';
var Promise = require('bluebird');
var Scooters = Promise.promisifyAll(require('../database/scooters'));

exports.findOneByQuery = function(query) {
    console.log(query);
    return Scooters.findOneAsync(query);
};

exports.findAll = function() {
    return Scooters.findAsync();
};

exports.findWhereIdIn = function(array) {
    return Scooters.find({
        '_id': { $in: array}
    });
};

exports.findLastScooters = function() {
    //return Scooters.findAsync();
    return Scooters.find().sort({createdAt: -1}).limit(3);
};

exports.createScooter = function(scooter) {
    return Scooters.createAsync(scooter);
};

exports.updateScooterById = function(scooterId, scooterToUpdate) {
    return Scooters.findOneAndUpdateAsync({_id: scooterId}, scooterToUpdate, {new: true});
};

exports.delete = function(query) {
    console.log('here');
    return Scooters.removeAsync(query);
};
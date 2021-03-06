var _ = require('lodash');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var UserService = require('../services/users');
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
    UserService.findAll()
        .then(function (users) {
            res.status(200).send(users);
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

router.get('/me', function(req, res) {
    res.status(200).send({user: req.user});
});

router.get('/:id', function(req, res) {
    UserService.findOneByQuery({_id: req.params.id})
        .then(function (user) {
            if (!user) {
                res.status(404).send({err: 'No user found with id '.req.params.id});
                return;
            } else
            {
                res.status(200).send({user: user});
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

var bodyVerificator = function(req, res, next) {
    var attributes = _.keys(req.body);
    var mandatoryAttributes = ['username', 'password', 'email', 'displayName'];
    var missingAttributes = _.difference(mandatoryAttributes, attributes);
    if (missingAttributes.length) {
        res.status(400).send({err: missingAttributes.toString()});
    }
    else {
        if (req.body.username && req.body.password && req.body.displayName && req.body.email) {
            next();
        }
        else {
            var error = mandatoryAttributes.toString() + ' are mandatory';
            res.status(400).send({err: error});
        }
    }
};

router.post('/', bodyVerificator, function(req, res) {
    UserService.findOneByQuery({username: req.body.username})
        .then(function(user) {
            if (user) {
                res.status(409).send({err: 'Existing user'});
                return;
            } else {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                req.body.password = hash;
                UserService.createUser(req.body)
                    .then(function(user) {
                        user.setToken().then( function(user) {
                                return res.status(200).send(user);
                            }
                        )
                    })
                ;
            }
        })
    ;
});

router.put('/', function(req, res) {
    UserService.updateUserById(req.user._id, req.body)
        .then(function (user) {
            if (!user) {
                res.status(404).send({err: 'No scooter found with id' + req.params.id});
            } else {
                res.status(200).send(user);
            }
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    ;
});

module.exports = router;

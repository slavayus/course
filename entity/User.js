'use strict';
const User = require('../database/DefineUser');


User.prototype.delete = function (req, res) {
    User.findById(Number(req.params.id))
        .then(task => {
            if (task !== null) {
                task.destroy();
                res.send('User deleted')
            } else {
                res.send('User not found')
            }
        })
};

User.prototype.checkUser = function (req, res) {
    let login = req.params.login;
    let password = req.params.password;

    User.findAll({
        where: {
            login: login,
            password: password,
        }
    }).then(value => {
        if (value.length === 0) {
            res.send("User not found")
        }
        res.send(value)
    });
};

User.prototype.create = function (req, res) {
    User.create({
        name: req.params.name,
        surname: req.params.surname,
        login: req.params.login,
        password: req.params.password
    }).then(value => res.send('Added')).catch(reason => res.send(reason.message));
};


module.exports = User;
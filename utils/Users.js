'use strict';
const User = require('../entity/DefineUsers');


/**
 * Удаляет из базы данных пользователя по Id.
 *
 * @param id - ID клиента.
 * @version 2.0
 */

User.prototype.delete = (id) => {
    return User.destroy({
        where: {
            id: id
        }
    });
};

/**
 * Проверяет существует ли пользователь в базе или нет.
 * Необходим для авторизации пользоваетя.
 *
 * @param data - JSON-object. Должен содержать логин пользователя и хэш-код пароля пользователя.
 * @version 3.0
 */
User.prototype.checkUser = (data) => {
    return User.findOne({
        where: {
            email: data,
        }
    })
};

User.prototype.isThisAdmin = (data) => {
    return User.findById(Number(data), {
        attributes: ['isAdmin']
    })
};

/**
 * Создает и записывает нового пользователя в базу данных.
 * Необходим для регистрации новых пользователей.
 *
 * @param data - JSON-object. Доджен содержать основную информацию о новом пользователе (name, surname, login, password).
 * @version 3.0
 */
User.prototype.create = function (data) {
    return User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        count: 10,
        salt: data.salt
    });
};

User.prototype.setOrderCode = function (code, userId, productPrice) {
    return User.update(
        {orderCode: code,orderPrice: productPrice},
        {where: {id: userId}});
};

User.prototype.getUser = function (userId) {
    return User.findById(userId);
};

User.prototype.getUserCount = function (userId) {
    return User.findById(userId, {
        attributes: ['count'],
    });
};

User.prototype.userCountAdd = function (userId, sum) {
    return User.update(
        {count: sum},
        {where: {id: userId}}
    );
};


module.exports = User;
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
        salt: data.salt
    });
};


module.exports = User;
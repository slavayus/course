const express = require('express');
const validator = require('validator');
const user = new (require('../utils/Users'));
const crypto = require('crypto');
const sha1 = require('sha1');
const router = new express.Router();

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Проверьте ваш email адрес.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Пароль должен содержать больше 8 символов.';
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Проверьте ваше имя.';
    }

    if (!isFormValid) {
        message = 'Проверьте форму на ошибки.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Проверьте ваш email адрес.';
    }

    if (!isFormValid) {
        message = 'Проверьте форму на ошибки.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

router.post('/login', (req, res) => {
    const validationResult = validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    } else {
        const email = req.body.email;
        user.checkUser(email).then(value => {
            if (value === null) {
                return res.json({
                    success: false,
                    message: 'Пользователь не найден.',
                    errors: validationResult.errors
                });
            } else {
                if (value.password === req.body.password) {
                    user.userCountAdd(value.id, value.count + 10);
                    req.session.user = value.id;
                    req.session.basket = value.basket;
                    return res.json({success: true, data: req.session.user});
                } else {
                    return res.json({
                        success: false,
                        message: '',
                        errors: {password: 'Проверьте ваш пароль.'}
                    })
                }
            }
        }).catch(error => {
            console.log(error);
        })
    }
});


router.post('/signup', (req, res) => {
    const validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    } else {
        const username = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        user.checkUser(email).then(value => {
            if (value === null) {
                const salt = crypto.randomBytes(48)
                    .toString('hex')
                    .slice(0, 48);
                let protectedPassword = sha1(sha1(password) + salt);
                user.create({
                    name: username,
                    email: email,
                    password: protectedPassword,
                    salt: salt,
                    isAdmin: false
                }).then(value => {
                    req.session.user = value.id;
                    req.session.basket = value.basket;
                    return res.json({success: true, data: req.session.user});
                });
            } else {
                validationResult.errors.email = 'Этот email уже существует';
                return res.json({
                    success: false,
                    message: 'Проверьте форму на ошибки.',
                    errors: validationResult.errors
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }
});

router.post('/login/salt', (req, res) => {
    const validationResult = validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    } else {
        const email = req.body.email;
        user.checkUser(email).then(value => {
            if (value === null) {
                return res.json({
                    success: false,
                    message: 'Пользователь не найден.',
                    errors: validationResult.errors
                });
            } else {
                return res.json({data: value.salt});
            }
        }).catch(error => {
            console.log(error);
        })
    }
});


module.exports = router;
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
        errors.email = 'Please provide a correct email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
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
        errors.email = 'Please provide your email address.';
    }

    if (!isFormValid) {
        message = 'Check the form for errors.';
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
                    message: 'User not found.',
                    errors: validationResult.errors
                });
            } else {
                let protectedPassword = sha1(sha1(value.password) + value.salt);
                if (protectedPassword === req.body.password) {
                    req.session.user = value.id;
                    return res.json({success: true, data: req.session.user});
                } else {
                    return res.json({
                        success: false,
                        message: '',
                        errors: {password:'Please provide your password.'}
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
                user.create({
                    name: username,
                    email: email,
                    password: password,
                    salt: salt
                }).then(value => {
                    req.session.user = value.id;
                    return res.json({success: true, data: req.session.user});
                });
            } else {
                validationResult.errors.email = 'This email already exist';
                return res.json({
                    success: false,
                    message: 'Check the form for errors.',
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
                    message: 'User not found.',
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
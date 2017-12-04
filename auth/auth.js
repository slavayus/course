const express = require('express');
const validator = require('validator');
const user = new (require('../utils/User'));


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

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
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
                user.create({
                    name: username,
                    email: email,
                    password: password
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

router.post('/login', (req, res) => {
    const validationResult = validateLoginForm(req.body);
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
                return res.json({
                    success: false,
                    message: 'User not found.',
                    errors: validationResult.errors
                });

            } else {
                req.session.user = value.id;
                return res.json({success: true, data: req.session.user});
            }
        }).catch(error => {
            console.log(error);
        })
    }
});


module.exports = router;
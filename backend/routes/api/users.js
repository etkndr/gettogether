const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
      const { firstName, lastName, email, password, username } = req.body;

      if (!firstName) {
        const err = new Error("First name is required")
        err.status = 400
        return next(err)
      }

      if (!lastName) {
        const err = new Error("Last name is required")
        err.status = 400
        return next(err)
      }

      const user = await User.signup({ firstName, lastName, email, username, password });
  
      await setTokenCookie(res, user);

      const newUser = await User.findByPk(user.id)
  
      return res.json({
        user: newUser,
      });
    }
  );

  router.get("/", async (req,res) => {
    const all = await User.findAll()

    return res.status(200).json(all)
  })

module.exports = router;
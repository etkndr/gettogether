const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

router.post(
    '/',
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const user = await User.signup({ email, username, password, firstName, lastName });
      await setTokenCookie(res, user);
      
      return res.json({
        user: user
      });
    }
  );

module.exports = router;
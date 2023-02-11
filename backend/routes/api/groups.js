const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group } = require('../../db/models');
const router = express.Router();

// get all groups
router.get("/", async (req, res) => {
    const groups = await Group.findAll()

    return res.status(200).json(groups)
})

// get group by id
router.get("/:id", async (req, res, next) => {
    const id = req.params.id
    const group = await Group.findByPk(id)
    if (!group) {
        const err = new Error('Group not found');
        err.status = 401;
        return next(err)
    }

    return res.status(200).json(group)
})

module.exports = router
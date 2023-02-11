const express = require('express')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// get all groups
router.get("/", async (req, res) => {
    const groups = await Group.findAll()

    return res.status(200).json(groups)
})

router.get("/current", restoreUser, async (req, res, next) => {
    const { user } = await req
    console.log(user)
    const userGroups = await Group.findAll(
        {where: {
            organizerId: user.id
        }}
    )

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }

    if (!userGroups.length) {
        const err = new Error("No groups found for current user")
        err.status = 400
        return next(err)
    }

    return res.status(200).json(userGroups)
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
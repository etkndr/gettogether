const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

// get all groups
router.get("/", async (req, res) => {
    const groups = await Group.findAll({
        attributes: { 
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]] 
        },
        include: [{
            model: Membership, attributes: []
        }],
        group: ["Group.id"]
    })

    return res.status(200).json(groups)
})

// get groups of current user
router.get("/current", restoreUser, async (req, res, next) => {
    const { user } = await req
    const userGroups = await Group.findAll(
        {where: {
            organizerId: user.id
        },
        attributes: { 
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]] 
        },
        include: [{
            model: Membership, attributes: []
        }],
        group: ["Group.id"]}
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
    const organizerId = await Group.findByPk(id).organizerId
    const imgId = await GroupImage.findAll({
        where: {
            groupId: id
        }
    })
    const group = await Group.scope([{ method: ["organizer", organizerId] }, {method: ["grpImg", imgId]}]).findByPk(id, {
        attributes: { 
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]] 
        },
        include: [{
            model: Membership, attributes: []
        }],
        group: ["Group.id"]
    })

    if (!group) {
        const err = new Error('Group not found');
        err.status = 404;
        return next(err)
    }

    return res.status(200).json(group)
})


module.exports = router
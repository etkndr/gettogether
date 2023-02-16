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
    const { user } = req
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

//create new group
router.post("/", async (req,res,next) => {
    const {user} = req

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }

    const {name, about, type, private, city, state} = req.body

    if (!name || !about || !type || !private || !city || !state) {
        const err = new Error("Requires name, about, type, privacy, city, state")
        err.status = 400
        return next(err)
    }

    const newGroup = await Group.create(
        {
            organizerId: user.id,
            name,
            about,
            type,
            private,
            city,
            state
        }
    )

    return res.status(200).json(newGroup)
})

//add image to group
router.post("/:id/images", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const {url, preview} = req.body
    const group = await Group.findByPk(id)

    if (!group) {
        const err = new Error(`No group with id ${id}`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }

    if (user.id !== group.organizerId) {
        const err = new Error("Only group organizer can add images")
        err.status = 400
        return next(err)
    }

    const grpImg = await GroupImage.create({
        groupId: id,
        url,
        preview
    })

    return res.status(200).json(grpImg)
})

module.exports = router
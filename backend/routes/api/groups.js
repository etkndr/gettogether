const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Venue, Event, Attendance, EventImage } = require('../../db/models');
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
    const {name, about, type, private, city, state} = req.body

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }


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

//edit group by id
router.put("/:id", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const group = await Group.findByPk(id)
    const {name, about, type, private, city, state} = req.body
    
    if (!group) {
        const err = new Error(`Group does not exist with id ${id}`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }


    if (user.id !== group.organizerId) {
        const err = new Error("Only group organizer can edit a group")
        err.status = 400
        return next(err)
    }

    if (!name || !about || !type || !private || !city || !state) {
        const err = new Error("Requires name, about, type, privacy, city, state")
        err.status = 400
        return next(err)
    }


    group.set({
        organizerId: user.id,
        name,
        about,
        type,
        private,
        city,
        state
    })

    return res.status(200).json(group)
})

//delete group
router.delete("/:id", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const group = await Group.findByPk(id)

    if (!group) {
        const err = new Error(`Group does not exist with id ${id}`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }


    if (user.id !== group.organizerId) {
        const err = new Error("Only group organizer can delete a group")
        err.status = 400
        return next(err)
    }

    await Group.destroy({
        where: {
            id: id
        }
    })

    return res.status(200).json({message: `Group ${id} deleted`})
})

//get venues for group
router.get("/:id/venues", async (req,res,next) => {
    const id = req.params.id
    const group = await Group.findByPk(id)
    const venue = await Venue.findAll({
        where: {
            groupId: id
        }
    })

    if (!group) {
        const err = new Error(`Group does not exist with id ${id}`)
        err.status = 404
        return next(err)
    }

    return res.status(200).json(venue)
})

//create new venue for group
router.post("/:id/venues", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const {address, city, state, lat, lng} = req.body
    const group = await Group.findByPk(id)
    const cohost = await Membership.findAll({
        where: {
            groupId: id,
            userId: user.id,
            status: "co-host"
        }
    })

    if (!group) {
        const err = new Error(`Group does not exist with id ${id}`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }

    if (!cohost || user.id !== group.organizerId) {
        const err = new Error("Only group organizer or co-host can add a venue")
        err.status = 400
        return next(err)
    }

    if (!address || !city || !state || !lat || !lng) {
        const err = new Error("Requires address, city, state, latitude, and longitude")
        err.status = 400
        return next(err)
    }

    const venue = await Venue.create({
        groupId: id,
        address,
        city,
        state,
        lat,
        lng
    })

    return res.status(200).json(venue)
})

//get group's events
router.get("/:id/events", async (req,res,next) => {
    const id = req.params.id
    const group = await Group.findByPk(id)
    const events = await Event.findAll({
        where: {
            groupId: id
        },
        attributes: { 
            include: [
                [sequelize.fn("COUNT", sequelize.col("Attendances.id")), "numAttending"],
            ] 
        },
        include: [
            {
                model: Attendance, attributes: []
            },
            {
                model: Group, attributes: ["id", "name", "city", "state"]
            },
            {
                model: Venue, attributes: ["id", "city", "state"]
            },
            {
                model: EventImage, attributes: ["preview"]
            }
    ],
        group: ["Event.id"]
    })

    if (!group) {
        const err = new Error(`Group does not exist with id ${id}`)
        err.status = 404
        return next(err)
    }

    return res.status(200).json(events)
})

//create new event by group id
router.post("/:id/events", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const {venueId, name, type, capacity, startDate, endDate, description, price} = req.body
    const group = await Group.findByPk(id)
    const cohost = await Membership.findAll({
        where: {
            groupId: id,
            userId: user.id,
            status: "co-host"
        }
    })
    const venue = await Venue.findByPk(venueId)
    
    if (venueId && !venue) {
        const err = new Error(`Venue does not exist with id ${venueId}`)
        err.status = 404
        return next(err)
    }

    if (!group) {
        const err = new Error(`Group does not exist with id ${id}`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Not logged in")
        err.status = 400
        return next(err)
    }

    if (!cohost || user.id !== group.organizerId) {
        const err = new Error("Only group organizer or co-host can add a venue")
        err.status = 400
        return next(err)
    }

    if (!name || !type || !capacity || !startDate || !endDate || !description || !price) {
        const err = new Error("Requires name, type, capacity, start, end, description, and price")
        err.status = 400
        return next(err)
    }

    const event = await Event.create({
        groupId: id,
        venueId,
        name, 
        type, 
        capacity, 
        startDate, 
        endDate, 
        description, 
        price
    })

    return res.status(200).json(event)
})


module.exports = router
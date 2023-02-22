const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { or } = require('sequelize');
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
        const err = new Error("Authentication required")
        err.status = 401
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
        const err = new Error(`Group couldn't be found`);
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
        const err = new Error("Authentication required")
        err.status = 401
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
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    if (user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    const newImg = await GroupImage.create({
        groupId: id,
        url,
        preview
    })

    const grpImg = await GroupImage.findOne({
        where: {
            id: newImg.id
        }
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
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }


    if (user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
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
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }


    if (user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    await Group.destroy({
        where: {
            id: id
        }
    })

    return res.status(200).json({message: `Successfully deleted`})
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
        const err = new Error(`Group couldn't be found`)
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
            memberId: user.id,
            status: "co-host"
        }
    })

    if (!group) {
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    if (!cohost && user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    if (!address || !city || !state || !lat || !lng) {
        const err = new Error("Requires address, city, state, latitude, and longitude")
        err.status = 400
        return next(err)
    }

    const newVenue = await Venue.create({
        groupId: id,
        address,
        city,
        state,
        lat,
        lng
    })

    const venue = await Venue.findByPk(newVenue.id)

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
        const err = new Error(`Group couldn't be found`)
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
            memberId: user.id,
            status: "co-host"
        }
    })
    const venue = await Venue.findByPk(venueId)
    
    if (venueId && !venue) {
        const err = new Error(`Venue does not exist`)
        err.status = 404
        return next(err)
    }

    if (!group) {
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    if (!cohost && user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
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

//get all members of group
router.get("/:id/members", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const group = await Group.findByPk(id)
    
    if (!group) {
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    //if user is not organizer
    if (user.id !== group.organizerId) {
        const members = await Membership.findAll({
            where: {
                groupId: id,
                [Op.or]: [
                    { status: "member" },
                    { status: "co-host" }
                  ]
            },
            attributes: ["status"],
            include: [
                {
                    model: User, attributes: ["id", "firstName", "lastName"]
                },
            ]
        })

        if (!members.length) {
            return res.status(200).json({message: "No members in this group"})
        }

        return res.status(200).json(members)
    }

    //if user is organizer
    const members = await Membership.findAll({
        where: {
            groupId: id
        },
        attributes: ["status"],
        include: [
            {
                model: User, attributes: ["id", "firstName", "lastName"]
            },
        ]
    })

    if (!members.length) {
        return res.status(200).json({message: "No members in this group"})
    }

    return res.status(200).json(members)
})

//request group membership
router.post("/:id/membership", async (req,res,next) => {
    const id = req.params.id
    const {user} = req
    const group = await Group.findByPk(id)

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    if (!group) {
        const err = new Error(`No group with id ${id}`)
        err.status = 404
        return next(err)
    }

    const request = await Membership.create({
        groupId: group.id,
        memberId: user.id,
        status: "pending"
    })

    return res.status(200).json({message: "Success!", request})
})

//change membership
router.put("/:id/membership", async (req,res,next) => {
    const id = req.params.id
    const {user} = req
    const {memberId, status} = req.body

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    const cohost = await Membership.findAll({
        where: {
            groupId: id,
            memberId: user.id,
            status: "co-host"
        }
    })
    const group = await Group.findByPk(id)

    if (!group) {
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!cohost && user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    
    if (user.id !== group.organizerId && status === "co-host") {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    if (status === "pending") {
        const err = new Error("Cannot set status to pending")
        err.status = 400
        return next(err)
    }

    const member = await Membership.findOne({
        where: {
            groupId: group.id,
            memberId
        }
    })

    if (!member) {
        const err = new Error(`No member with id ${memberId}`)
        err.status = 404
        return next(err)
    }

    await member.set({
        groupId: group.id,
        memberId,
        status
    }) 

    return res.status(200).json(member)
})

//delete membership
router.delete("/:id/membership", async (req,res,next) => {
    const id = req.params.id
    const {user} = req

    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    const {memberId} = req.body
    const member = await Membership.findOne({
        where: {
            groupId: id,
            memberId
        }
    })

    if (!member) {
        const err = new Error(`No member with id ${memberId}`)
        err.status = 404
        return next(err)
    }

    const group = await Group.findByPk(id)

    if (!group) {
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (user.id !== group.organizerId && user.id !== memberId) {
        const err = new Error(`Forbidden`)
        err.status = 403
        return next(err)
    }

    await member.destroy()

    return res.status(200).json({message: "Success!"})
})

module.exports = router
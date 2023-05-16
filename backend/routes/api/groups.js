const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

router.use(restoreUser)

// get all groups
router.get("/", async (req, res) => {
    const groups = await Group.findAll({
        subQuery: false,
        attributes: { 
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
        [sequelize.col("GroupImages.url"), "previewImage"]] 
        },
        include: [{
            model: Membership, attributes: [], duplicating: false
        },
    {
        model: GroupImage, attributes: [], duplicating: false
    }],
        group: ["Group.id", "Memberships.id", "GroupImages.id"]
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
            include: [[sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"],
            [sequelize.col("GroupImages.url"), "previewImage"]] 
        },
        include: [{
            model: Membership, attributes: []
        },
        {
            model: GroupImage, attributes: [], duplicating: false
        }],
        group: ["Group.id", ""]}
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
            model: Membership, attributes: [],
        },
        {
            model: User, as: "Organizer", attributes: ["id", "firstName", "lastName"]
        },
        {
            model: GroupImage, attributes: ["id", "url", "preview"]
        },
        {
            model: Venue, attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
        }
    ],
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


    if (!name || !about || !type || !city || !state) {
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

    const grpImg = await GroupImage.findByPk(newImg.id)

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

    if (!name || !about || !type || !city || !state) {
        const err = new Error("Requires name, about, type, privacy, city, state")
        err.status = 400
        return next(err)
    }


    group.update({
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
        subQuery:false,
        attributes: { 
            include: [
                [sequelize.fn("COUNT", sequelize.col("numAttending.id")), "numAttending"],
                [sequelize.col("EventImages.url"), "previewImage"]
            ]
        },
        include: [
            {
                model: Attendance, as: "numAttending", attributes: [], duplicating: false
            },
            {
                model: Group, attributes: ["id", "name", "city", "state"], duplicating: false
            },
            {
                model: Venue, attributes: ["id", "city", "state"], duplicating: false
            },
            {
                model: EventImage, attributes: [], duplicating: false
            }
    ],
        group: ["Event.id", "Group.id", "numAttending.id", "Venue.id", "EventImages.id"],
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

    if (!name || !type || !capacity || !startDate || !endDate || !description || price < 0) {
        const err = new Error("Requires name, type, capacity, start, end, description, and price")
        err.status = 400
        return next(err)
    }

    const newEvent = await Event.create({
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

    const event = await Event.findByPk(newEvent.id)

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

    
        const cohost = await Membership.findAll({
            where: {
                groupId: group.id,
                memberId: user.id,
                status: "co-host"
            }
        })
    

    //if user is not organizer
    if (!user || user.id !== group.organizerId && !cohost) {
        const members = await User.findAll({
            attributes: ["id", "firstName", "lastName"],
            include: [{
                model: Membership, 
                where: {
                    groupId: group.id,
                    [Op.or]: [
                        { status: "member" },
                        { status: "co-host" }
                    ]
                },
                attributes: ["status"]
            }]
        })

        if (!members.length) {
            return res.status(200).json({message: "No members in this group"})
        }

        return res.status(200).json(members)
    }

    //if user is organizer
    const members = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: [{
            model: Membership, 
            where: {
                groupId: group.id
            },
            attributes: ["status"]
        }]
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
        const err = new Error(`Group couldn't be found`)
        err.status = 404
        return next(err)
    }

    const pending = await Membership.findOne({
        where: {
            groupId: group.id,
            memberId: user.id,
            status: "pending"
        }
    })

    if (pending) {
        const err = new Error("Membership has already been requested")
        err.status = 400
        return next(err)
    }

    const member = await Membership.findOne({
        where: {
            groupId: group.id,
            memberId: user.id
        }
    })

    if (member) {
        const err = new Error("User is already a member of the group")
        err.status = 400
        return next(err)
    }

    const newRequest = await Membership.create({
        groupId: group.id,
        memberId: user.id,
        status: "pending"
    })

    const request = await Membership.scope("submission").findByPk(newRequest.id)

    return res.status(200).json(request)
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

    const checkId = await User.findByPk(memberId)

    if (!checkId) {
        const err = new Error("User couldn't be found")
        err.status = 404
        return next(err)
    }

    const cohost = await Membership.findAll({
        // where: {
        //     groupId: id,
        //     memberId: user.id,
        //     status: "co-host"
        // }
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
        const err = new Error("Cannot change a membership status to pending")
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
        const err = new Error(`Membership between the user and the group does not exits`)
        err.status = 404
        return next(err)
    }

    member.update({
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
    
    const checkId = await User.findByPk(memberId)
    if (!checkId) {
        const err = new Error("User couldn't be found")
        err.status = 404
        return next(err)
    }

    const member = await Membership.findOne({
        where: {
            groupId: id,
            memberId
        }
    })
    
    if (!member) {
        const err = new Error(`Membership does not exist for this User`)
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

    return res.status(200).json({message: "Successfully deleted membership from group"})
})

module.exports = router
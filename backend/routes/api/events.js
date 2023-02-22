const express = require('express')
const sequelize = require("sequelize")
const {Op} = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

//get all events
router.get("/", async (req,res,next) => {
    let {page, size, name, type, startDate} = req.query

    if (!page || page < 1 || page > 10) {
        page = 1
    }

    if (!size || size < 1 || size > 20) {
        size = 20
    }

    const events = await Event.findAll({
        // where: {
        //     name,
        //     type,
        //     startDate
        // },
        // offset: size * (page - 1),
        // limit: size,
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
        group: ["Event.id"],
    })

    res.status(200).json(events)
})

//get event by id
router.get("/:id", async (req,res,next) => {
    const id = req.params.id
    const event = await Event.findByPk(id, {
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
                model: Group, attributes: ["id", "name", "private", "city", "state"]
            },
            {
                model: Venue, attributes: ["id", "address", "city", "state", "lat", "lng"]
            },
            {
                model: EventImage, attributes: ["id", "url", "preview"]
            }
    ],
        group: ["Event.id"]
    })

    if (!event) {
        const err = new Error(`Event couldn't be found`)
        err.status = 404
        return next(err)
    }

    return res.status(200).json(event)
})

//add image to event
router.post("/:id/images", async (req,res,next) => {
    const id = req.params.id
    const event = await Event.findByPk(id)
    const {user} = req
    const attend = await Attendance.findAll({
        where: {
            eventId: event.id,
            userId: user.id
        }
    })
    const {url, preview} = req.body

    if (!user) {
        const err = new Error(`Authentication required`)
        err.status = 401
        return next(err)
    }

    if (!event) {
        const err = new Error(`Event couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!attend) {
        const err = new Error(`You must be an attendee to add an image`)
        err.status = 400
        return next(err)
    }

    const newImg = await EventImage.create({
        eventId: event.id,
        url,
        preview
    })

    const img = await EventImage.findByPk(newImg.id)

    return res.status(200).json(img)
})

//edit an event by id
router.put("/:id", async (req,res,next) => {
    const id = req.params.id
    const event = await Event.findByPk(id)

    if (!event) {
        const err = new Error(`No event with id ${id}`)
        err.status = 404
        return next(err)
    }

    const {user} = req
    const {venueId, name, type, capacity, startDate, endDate, description, price} = req.body
    const group = await Group.findByPk(event.groupId)
    const cohost = await Membership.findAll({
        where: {
            groupId: event.groupId,
            userId: user.id,
            status: "co-host"
        }
    })
    const {url, preview} = req.body
    const venue = await Venue.findByPk(venueId)

    
    if (!user) {
        const err = new Error(`Authentication required`)
        err.status = 401
        return next(err)
    }
    
    
    if (user.id !== group.organizerId && !cohost) {
        const err = new Error(`Forbidden`)
        err.status = 403
        return next(err)
    }
    
    if (!venue) {
        const err = new Error(`No venue exists with id ${venueId}`)
        err.status = 404
        return next(err)
    }

    if (!name || !type || !capacity || !startDate || !endDate || !description || !price) {
        const err = new Error("Requires name, type, capacity, start, end, description, and price")
        err.status = 400
        return next(err)
    }

    await event.set({
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

//delete event
router.delete("/:id", async (req,res,next) => {
    const id = req.params.id
    const event = await Event.findByPk(id)

    if (!event) {
        const err = new Error(`No event with id ${id}`)
        err.status = 404
        return next(err)
    }

    const { user } = req
    const group = await Group.findByPk(event.groupId)
    const cohost = await Membership.findAll({
        where: {
            groupId: event.groupId,
            userId: user.id,
            status: "co-host"
        }
    })

    if (!user) {
        const err = new Error(`Authentication required`)
        err.status = 401
        return next(err)
    }


    if (user.id !== group.organizerId && !cohost) {
        const err = new Error(`Forbidden`)
        err.status = 403
        return next(err)
    }

    await event.destroy(id)
    return res.status(200).json({message: `Successfully deleted event ${id}`})
})

//get attendees
router.get("/:id/attendees", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const event = await Event.findByPk(id)
    if (!event) {
        const err = new Error(`No event with id ${id}`)
        err.status = 404
        return next(err)
    }
    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    const cohost = await Membership.findAll({
        where: {
            groupId: group.id,
            memberId: user.id,
            status: "co-host"
        }
    })

    //not organizer/co-host
    if (user.id !== group.organizerId && !cohost) {
        const attend = await Attendance.findAll({
            where: {
                eventId: event.id,
                [Op.or]: [
                    { status: "member" },
                    { status: "waitlist" }
                ]
            },
            attributes: ["status"],
            include: [
                {
                    model: User, attributes: ["id", "firstName", "lastName"]
                }
            ]
        })

        return res.status(200).json(attend)
    }

    //organizer/co-host
    const attend = await Attendance.findAll({
        where: {
            eventId: event.id,
        },
        attributes: ["status"],
        include: [
            {
                model: User, attributes: ["id", "firstName", "lastName"]
            }
        ]
    })


    return res.status(200).json(attend)
})

//request attendance
router.post("/:id/attendance", async (req,res,next) => {
    const id = req.params.id
    const {user} = req
    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }
    
    const event = await Event.findByPk(id)
    if (!event) {
        const err = new Error("No event with id")
        err.status = 404
        return next(err)
    }

    const prev = await Attendance.findAll({
        where: {
            userId: user.id
        }
    })
    if (prev.length) {
        const err = new Error("Already requested")
        err.status = 400
        return next(err)
    }

    const attend = await Attendance.create({
        eventId: event.id,
        userId: user.id,
        status: "pending"
    })

    return res.status(200).json({message: "Success!", attend})
})

//change attendance status
router.put("/:id/attendance", async (req,res,next) => {
    const id = req.params.id
    const {userId, status} = req.body
    if (status === "pending") {
        const err = new Error("Cannot change to pending")
        err.status = 400
        return next(err)
    }

    const {user} = req
    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    const event = await Event.findByPk(id)
    if (!event) {
        const err = new Error("No event with id")
        err.status = 404
        return next(err)
    }

    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })

    const cohost = await Membership.findAll({
        where: {
            groupId: group.id,
            memberId: user.id,
            status: "co-host"
        }
    })

    if (!cohost && user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    const attend = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId,
            status: "pending"
        }
    })
    if (!attend) {
        const err = new Error("No attendee pending")
        err.status = 404
        return next(err)
    }

    attend.set({
        eventId: event.id,
        userId,
        status
    })

    return res.status(200).json(attend)
})

//delete attendance
router.delete("/:id/attendance", async (req,res,next) => {
    const id = req.params.id
    const {memberId} = req.body
    const {user} = req
    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }

    const event = await Event.findByPk(id)
    if (!event) {
        const err = new Error("No event with id")
        err.status = 404
        return next(err)
    }

    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    if (!group) {
        const err = new Error("No group with id")
        err.status = 404
        return next(err)
    }

    const attend = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: memberId
        }
    })
    if (!attend) {
        const err = new Error("No request found")
        err.status = 404
        return next(err)
    }

    if (user.id !== group.organizerId && user.id !== memberId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    await attend.destroy()

    return res.status(200).json({message: "Success!"})
})

module.exports = router
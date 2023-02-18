const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

//get all events
router.get("/", async (req,res,next) => {
    const events = await Event.findAll({
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
        const err = new Error(`No event with id ${id}`)
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
            eventId: id,
            userId: user.id
        }
    })
    const {url, preview} = req.body

    if (!user) {
        const err = new Error(`Must be logged in`)
        err.status = 400
        return next(err)
    }

    if (!event) {
        const err = new Error(`No event with id ${id}`)
        err.status = 404
        return next(err)
    }

    if (!attend) {
        const err = new Error(`You must be an attendee to add an image`)
        err.status = 400
        return next(err)
    }

    const img = await EventImage.create({
        eventId: id,
        url,
        preview
    })

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
        const err = new Error(`Must be logged in`)
        err.status = 400
        return next(err)
    }
    
    
    if (user.id !== group.organizerId && !cohost) {
        const err = new Error(`Must be group organizer or co-host`)
        err.status = 400
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
        const err = new Error(`Must be logged in`)
        err.status = 400
        return next(err)
    }


    if (user.id !== group.organizerId && !cohost) {
        const err = new Error(`Must be group organizer or co-host`)
        err.status = 400
        return next(err)
    }

    await event.destroy(id)
    return res.status(200).json({message: `Successfully deleted event ${id}`})
})

//get attendees
router.get("/:id/attendees", async (req,res,next) => {
    const id = req.params.id
    const event = await Event.findByPk(id, {
        include: [
            {
                model: Attendance, attributes: ["id", firstN]
            }
        ]
    })

    if (!event) {
        const err = new Error(`No event with id ${id}`)
        err.status = 404
        return next(err)
    }

    // const attend = await Attendance.findAll({
    //     where: {
    //         eventId: event.id
    //     },
    //     include: [
    //         {
    //             model: Membership, attributes: ["status"]
    //         }
    //     ]
    // })

    // if (!attend.length) {
    //     return res.status(200).json({message: "No attendees for this event"})
    // }

    return res.status(200).json(event)
})

module.exports = router
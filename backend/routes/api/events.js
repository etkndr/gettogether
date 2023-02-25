const express = require('express')
const sequelize = require("sequelize")
const {Op} = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

//get all events
router.get("/", async (req,res,next) => {
    const where = {}
    let limit
    let offset
    let {page, size, name, type, startDate} = req.query

    if (name) {
        if (parseInt(name)) {
            const err = new Error("Name must be a string")
            err.status = 400
            return next(err)
        }

        where.name = name
    }

    if (type) {
        if (type !== "Online" && type !== "In person") {
            const err = new Error("Type must be 'Online' or 'In person'")
            err.status = 400
            return next(err)
        }

        where.type = type
    }

    
    if (startDate) {
        const date = Date.parse(startDate)
        if (isNaN(date)) {
            const err = new Error("Start date must be a valid datetime")
            err.status = 400
            return next(err)
        }
        where.startDate = startDate
    }

    if (size && size < 1) {
        const err = new Error("Size must be greater than or equal to 1")
        err.status = 400
        return next(err)
    }

    if (page && page < 1) {
        const err = new Error("Page must be greater than or equal to 1")
        err.status = 400
        return next(err)
    }

    if (size && (size >= 1 || size <= 20)) {
        limit = size
    } else {
        limit = 20
    }

    if (page && (page >= 1 || page <= 10)) {
        offset = limit * (page - 1)
    } else {
        offset = 0
    }


    const events = await Event.findAll({
        where,
        subQuery:false,
        attributes: { 
            include: [
                [sequelize.fn("COUNT", sequelize.col("numAttending.id")), "numAttending"],
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
                model: EventImage, as: "previewImage", attributes: ["url"], duplicating: false
            }
    ],
        group: ["Event.id", "Group.id", "numAttending.id", "Venue.id", "previewImage.id"],
        limit,
        offset
    })
  
    return res.status(200).json(events);

})

//get event by id
router.get("/:id", async (req,res,next) => {
    const id = req.params.id
    const event = await Event.findByPk(id, {
        attributes: {
            include: [
              [
                sequelize.fn('COUNT', sequelize.col('Attendances.id')),
                'numAttending',
              ],
            ],
          },
          include: [
            {
              model: Attendance,
              attributes: [],
              duplicating: false,
            },
            {
              model: Group,
              attributes: ['id', 'name', 'city', 'state'],
              duplicating: false,
            },
            {
              model: Venue,
              attributes: ['id', 'city', 'state'],
              duplicating: false,
            },
            {
              model: EventImage,
              attributes: ['id', 'preview'],
            },
          ],
          group: ['Event.id', 'EventImages.id', 'Group.id', 'Venue.id'],
    })

    if (!event) {
        const err = new Error(`Event couldn't be found`)
        err.status = 404
        return next(err)
    }

    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })

    if (!group) {
        const err = new Error("Group couldn't be found")
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
        const err = new Error(`Event couldn't be found`)
        err.status = 404
        return next(err)
    }

    const {user} = req
    const {venueId, name, type, capacity, startDate, endDate, description, price} = req.body
    const group = await Group.findByPk(event.groupId)
    const cohost = await Membership.findAll({
        where: {
            groupId: event.groupId,
            memberId: user.id,
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
        const err = new Error(`Venue couldn't be found`)
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
        const err = new Error(`Event couldn't be found`)
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
    return res.status(200).json({message: `Successfully deleted`})
})

//get attendees
router.get("/:id/attendees", async (req,res,next) => {
    const {user} = req
    const id = req.params.id

    const event = await Event.findByPk(id)
    if (!event) {
        const err = new Error(`Event couldn't be found`)
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
                    model: User, as: "Attendee", attributes: ["id", "firstName", "lastName"]
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
                model: User, as: "Attendee", attributes: ["id", "firstName", "lastName"]
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
        const err = new Error("Event couldn't be found")
        err.status = 404
        return next(err)
    }

    const pend = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: user.id,
            status: "pending"
        }
    })
    if (pend) {
        const err = new Error("Attendance has already been requested")
        err.status = 400
        return next(err)
    }

    const accepted = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: user.id
        }
    })
    if (accepted) {
        const err = new Error("User is already an attendee of the event")
        err.status = 400
        return next(err)
    }

    const newAttend = await Attendance.create({
        eventId: event.id,
        userId: user.id,
        status: "pending"
    })

    const attend = await Attendance.scope("submission").findByPk(newAttend.id)

    return res.status(200).json(attend)
})

//change attendance status
router.put("/:id/attendance", async (req,res,next) => {
    const id = req.params.id
    const {userId, status} = req.body
    if (status === "pending") {
        const err = new Error("Cannot change an attendance status to pending")
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
        const err = new Error("Event couldn't be found")
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
        const err = new Error("Attendance between the user and the event does not exist")
        err.status = 404
        return next(err)
    }

    attend.update({
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
        const err = new Error("Event couldn't be found")
        err.status = 404
        return next(err)
    }

    const group = await Group.findOne({
        where: {
            id: event.groupId
        }
    })
    if (!group) {
        const err = new Error("Group couldn't be found")
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
        const err = new Error("Attendance does not exist for this User")
        err.status = 404
        return next(err)
    }

    if (user.id !== group.organizerId && user.id !== memberId) {
        const err = new Error("Only the User or organizer may delete an Attendance")
        err.status = 403
        return next(err)
    }

    await attend.destroy()

    return res.status(200).json({message: "Successfully deleted attendance from event"})
})

module.exports = router
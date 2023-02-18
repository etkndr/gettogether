const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const router = express.Router();

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
            }
    ],
        group: ["Event.id"]
    })

    res.status(200).json(events)
})

module.exports = router
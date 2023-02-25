const express = require('express')
const sequelize = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, User, Membership, GroupImage, Venue } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

//edit venue by id
router.put("/:id", async (req,res,next) => {
    const {user} = req
    const id = req.params.id
    const venue = await Venue.findByPk(id)
    const {address, city, state, lat, lng} = req.body
    const group = await Group.findAll({
        where: {
            id: venue.groupId
        }
    })
    const cohost = await Membership.findAll({
        where: {
            groupId: venue.groupId,
            userId: user.id,
            status: "co-host"
        }
    })

    if (!venue) {
        const err = new Error(`Venue couldn't be found`)
        err.status = 404
        return next(err)
    }

    if (!user) {
        const err = new Error(`Authentication required`)
        err.status = 401
        return next(err)
    }

    if (!cohost || user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    if (!address || !city || !state || !lat || !lng) {
        const err = new Error(`Must include address, city, state, latitude, longitude`)
        err.status = 400
        return next(err)
    }

    venue.update({
        address,
        city,
        state,
        lat, 
        lng
    })

    return res.status(200).json(venue)
})

module.exports = router
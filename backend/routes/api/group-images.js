const express = require('express')
const sequelize = require("sequelize")
const {Op} = require("sequelize")
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, User, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const router = express.Router();

router.use(restoreUser)

router.delete("/:id", async (req,res,next) => {
    const id = req.params.id
    const {user} = req
    if (!user) {
        const err = new Error("Authentication required")
        err.status = 401
        return next(err)
    }
    
    const img = await GroupImage.findByPk(id)
    if (!img) {
        const err = new Error("Group image couldn't be found")
        err.status = 404
        return next(err)
    }

    const group = await Group.findOne({
        where: {
            id: img.groupId
        }
    })
    if (!group) {
        const err = new Error("Group couldn't be found")
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
    if (!cohost && user.id !== group.organizerId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }


    await img.destroy()

    return res.status(200).json({message: "Successfully deleted"})
})

module.exports = router
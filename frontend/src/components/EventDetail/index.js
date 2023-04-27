import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import { getOneEvent } from "../../store/events"

export default function EventDetail () {
    const dispatch = useDispatch()
    const {id} = useParams()
    const event = useSelector(state => state.events.currEvent)
    const [group, setGroup] = useState()
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        const currGroup = async (groupId) => {
            await fetch(`/api/groups/${groupId}`)
            .then(res => res.json())
            .then(data => setGroup(data))
        }
        dispatch(getOneEvent(id))

        if (event?.groupId) {
        (currGroup(event?.groupId))
        }

        setLoaded(true)
    }, [dispatch, id, event?.groupId])

    if (loaded && event && group) {
        console.log(event)
    return (
        <div>
            <div>
                <NavLink to="/events">Events</NavLink> {`>`} {event?.name}
            </div>
            <div>
                <p>
                    {event?.name}
                </p>
                <p>
                Hosted by:
            {" " + group?.Organizer?.firstName + " "}
            {group?.Organizer?.lastName}
                </p>
                <div>
                    {event?.EventImages[0]}
                </div>
                <div>
                    Event info: {event?.description}
                </div>
                <p>
                    Group info: {group?.about}
                </p>
            </div>
        </div>
    )
}
}
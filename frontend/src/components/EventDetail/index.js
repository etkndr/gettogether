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
        .then(currGroup(event?.groupId))
        .then(setLoaded(true))
    }, [dispatch, id, event?.groupId])

    if (loaded && event && group) {
    return (
        <div>
            <div>
                <NavLink to="/events">Events</NavLink> {`>`} {event.name}
            </div>
            <div>
                <p>
                    {event.name}
                </p>
                <p>
                    {group?.Organizer?.firstName}
                </p>
            </div>
        </div>
    )
}
}
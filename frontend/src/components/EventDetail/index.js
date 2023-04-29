import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import { getOneEvent } from "../../store/events"
import {convertTime} from "../../App"

export default function EventDetail () {
    const dispatch = useDispatch()
    const {id} = useParams()
    const sessionUser = useSelector(state => state.session.user)
    const event = useSelector(state => state.events.currEvent)
    const [group, setGroup] = useState()
    const [loaded, setLoaded] = useState(false)

    let hostButtons
    if (sessionUser && sessionUser.id === group?.Organizer?.id) {
        hostButtons = (
            <div>
            <button>Update</button>
            <button>Delete</button>
            </div>
        )
    }
    
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
                    <h2>Event info</h2>
                    <div>
                        <i class="fa-regular fa-clock"></i>
                        <div>
                        <p>START {convertTime(event.startDate)}</p>
                        <p>END {convertTime(event.endDate)}</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-regular fa-dollar-sign"></i>
                        <div>
                            {event.price || "FREE"}
                        </div>
                    </div>
                    <div>
                        <i class="fa-regular fa-location-dot"></i>
                        <div>
                            {event.type}
                        </div>
                    </div>
                    <div>
                        <h3>
                            Description
                        </h3>
                        <div>
                            {event.description}
                        </div>
                    </div>
                </div>
                <div>
                    Group info: {group?.about}
                </div>
            </div>
                {hostButtons}
        </div>
    )
}
}
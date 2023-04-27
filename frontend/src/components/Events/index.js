import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import "./Events.css"

export default function Events() {
    const dispatch = useDispatch()
    const events = useSelector(state => state.events.allEvents)
    const groups = useSelector(state => state.groups)
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        dispatch(eventActions.getEvents())
        .then(groupActions.getGroups())
        .then(() => setLoaded(true))
      }, [dispatch]);

    useEffect(() => {
        //get curr group here??
    }, [loaded])
      console.log(events)

    if (loaded && events) {
    return (
        <>
        <div className="select">
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
        </div>
        <div className="caption">
            <h3>Events in getTogether</h3>
        </div>
            {events?.map((event, idx) => {
                return (
                    <NavLink to={`/event/${event.id}`} className="event-detail-link">
                    <li key={idx} className="event">
                        <li key={`${idx}-img`}><img src={event.previewImage} alt="group img" /></li>
                        <li key={`${idx}-name`}>{event.name}</li>
                        <li key={`${idx}-city`}>{event.city}, {event.state}</li>
                        <li key={`${idx}-about`}>{event.about}</li>
                        <li key={`${idx}-events`}>
                        {event.private && <div>Private</div>}
                        {!event.private && <div>Public</div>}
                        </li>
                        <hr></hr>
                    </li>
                    </NavLink>
                )
            })}
        </>
    )
}
}
import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import "./Events.css"
import { convertTime } from "../../App"

export default function Events() {
    const dispatch = useDispatch()
    const events = useSelector(state => state.events.allEvents)
    const groups = useSelector(state => state.groups)
    const [currGroup, setCurrGroup] = useState()
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        dispatch(eventActions.getEvents())
        .then(() => setLoaded(true))
      }, [dispatch]);

    useEffect(() => {
        dispatch(groupActions.getGroups())
    }, [loaded])
    
    if (loaded && events) {
        let sorted = events.sort((e1, e2) => (e1.startDate > e2.startDate) ? 1 : (e1.startDate < e2.startDate) ? -1 : 0)

        let past = []
        
        sorted = sorted.reduce((prev, curr) => {
            let date = new Date(curr.startDate)
            if (date < Date.now()) past.push(curr)
            else prev.push(curr)
            return prev
        }, [])

    return (
        <>
        <div className="select">
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
        </div>
        <div className="caption">
            <h3>Events in getTogether</h3>
        </div>
        {sorted?.map((event) => {
                return (
                    <div className="event">
                        <NavLink to={`/event/${event.id}`}>
                        <img src={event.previewImage} alt="preview"></img>
                    <li key={event?.id}>
                        <p>{convertTime(event.startDate)}</p>
                        <p>{event?.name}</p>
                        <p>{event.Group.city}, {event.Group.state}</p>
                        <p>{event.description}</p>
                    </li>
                    </NavLink>
                    <hr></hr>
                    </div>
                )
            })}

            {past.length > 0 && <h3>Past events</h3>}
            {past?.map((event) => {
                    return (
                        <div className="event">
                         <NavLink to={`/event/${event.id}`}>
                            <img src={event.previewImage} alt="preview"></img>
                            <p>{event.description}</p>
                        <li key={event?.id}>
                            <p>{convertTime(event.startDate)}</p>
                            <p>{event?.name}</p>
                            <p>{event.Group.city}, {event.Group.state}</p>
                        </li>
                        </NavLink>
                        <hr></hr>
                        </div>
                ) 
            })}
        </>
    )
}
}
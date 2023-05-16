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
        <div className="content">
        <div className="caption">
            <h2>Events in getTogether</h2>
        </div>
        <div className="select">
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
        </div>
        <hr></hr>
        {sorted?.map((event, idx) => {
                return (
                    <NavLink to={`/event/${event?.id}`} className="group-detail-link">
                    <div key={idx} className="event">
                        <div key={`${idx}-img`} className="grp-img">
                            <img src={event?.previewImage} alt="preview"></img>
                        </div>
                        <div key={event?.id} className="grp-info">
                            <li key={`${idx}-date`} className="grp-location">{convertTime(event?.startDate)}</li>
                            <li key={`${idx}-name`} className="grp-name">{event?.name}</li>
                            <li key={`${idx}-location`} className="grp-about">{event?.Group?.city}, {event?.Group?.state}</li>
                            <div key={`${idx}-about`} className="grp-about">{event?.description}</div>
                        </div>
                    </div>
                    <hr></hr>
                    </NavLink>
                )
            })}

            {past.length > 0 && <h3>Past events</h3>}
            {past?.map((event) => {
                    return (
                        <div className="event">
                         <NavLink to={`/event/${event?.id}`}>
                            <img src={event?.previewImage} alt="preview"></img>
                            <p>{event?.description}</p>
                        <li key={event?.id}>
                            <p>{convertTime(event?.startDate)}</p>
                            <p>{event?.name}</p>
                            <p>{event?.Group?.city}, {event?.Group?.state}</p>
                        </li>
                        </NavLink>
                        <hr></hr>
                        </div>
                ) 
            })}
        </div>
    )
}
}
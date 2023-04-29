import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import { getGroupEvents } from "../../store/events"
import "./detail.css"
import { convertTime } from "../../App"

export default function GroupDetail() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [loaded, setLoaded] = useState(false)
    const [group, setGroup] = useState()
    const {id} = useParams()
    const allEvents = useSelector(state => state.events.groupEvents)

    const currGroup = async () => {
        await fetch(`/api/groups/${id}`)
        .then(res => res.json())
        .then(data => setGroup(data))
    }
    
    function popup() {
        alert("Feature coming soon")
    }

    function createEvent() {

    }

    function updateGroup() {
        
    }
    
    function dltGroup() {
        
    }
    
    useEffect(() => {
        currGroup()
        .then(dispatch(getGroupEvents(id)))
        .then(setLoaded(true))
    }, [dispatch, id])

    if (loaded && allEvents) {
       let sorted = allEvents.sort((e1, e2) => (e1.startDate > e2.startDate) ? 1 : (e1.startDate < e2.startDate) ? -1 : 0)

        let past = []
        
        sorted = sorted.reduce((prev, curr) => {
            let date = new Date(curr.startDate)
            if (date < Date.now()) past.push(curr)
            else prev.push(curr)
            return prev
        }, [])

    return (
        <div>
            <div><NavLink to="/groups">Groups</NavLink> {">"} {group?.name}</div>
            <div><img src={group?.GroupImages[0]?.url}></img></div>
            <div>{group?.name}</div>
            <div>{group?.city + ", "}
            {group?.state}
            </div>
            <div>
            Organized by:
            {" " + group?.Organizer?.firstName + " "}
            {group?.Organizer?.lastName}
            </div>

            {sessionUser && sessionUser.id !== group?.Organizer?.id &&
            <button onClick={popup}>Join this group</button>
            }

            {sessionUser && sessionUser.id === group?.Organizer?.id && 
            <button onClick={createEvent}>Create event</button>}

            {sessionUser && sessionUser.id === group?.Organizer?.id &&
            <button onClick={updateGroup}>Update</button>}

            {sessionUser && sessionUser.id === group?.Organizer?.id &&
            <button onClick={dltGroup}>Delete</button>}

            <h3>What we're about</h3>
            {group?.about}

            <h3>Events {`(${sorted.length})`}</h3>
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
                    </div>
                )
            })}
            {past.length > 0 && <h3>Past events {`(${past.length})`}</h3>}
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
                        </div>
                ) 
            })}
        </div>
    )
    }
}
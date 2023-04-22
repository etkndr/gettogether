import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import { getGroupEvents, clear } from "../../store/events"

export default function GroupDetail() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [loaded, setLoaded] = useState(false)
    const [group, setGroup] = useState()
    const [events, setEvents] = useState()
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
    }, [dispatch])
    
    useEffect(() => {
        setEvents(allEvents)

        return () => {
            dispatch(clear())
            setEvents([])
        }
    }, [loaded === true])

    console.log(events)

    if (loaded && events?.length) {
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

            {sessionUser && sessionUser.id !== group.Organizer.id &&
            <button onClick={popup}>Join this group</button>
            }

            {sessionUser && sessionUser.id === group.Organizer.id && 
            <button onClick={createEvent}>Create event</button>}

            {sessionUser && sessionUser.id === group.Organizer.id &&
            <button onClick={updateGroup}>Update</button>}

            {sessionUser && sessionUser.id === group.Organizer.id &&
            <button onClick={dltGroup}>Delete</button>}

            <h2>What we're about</h2>
            {group?.about}

            <h2>Group events</h2>
            {events?.map((event) => {
                return (
                    <li key={event?.id}>{event?.name}</li>
                )
            })}
        </div>
    )
    }
}
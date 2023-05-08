import { useEffect, useState } from "react"
import { NavLink, useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import { getGroupEvents } from "../../store/events"
import { convertTime } from "../../App"
import "./GroupDetail.css"

export default function GroupDetail() {
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    const sessionUser = useSelector(state => state.session.user)
    const allEvents = useSelector(state => state.events.groupEvents)
    const [loaded, setLoaded] = useState(false)
    const [group, setGroup] = useState()
    const [dltClass, setDltClass] = useState("dlt-modal-hidden")

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
        history.push(`/group/edit/${id}`)
    }
    
    function showDeleteModal(e) {
        e.preventDefault()
        setDltClass("dlt-modal")
      }
      
    function hideModal(e) {
        e.preventDefault()
        setDltClass("dlt-modal-hidden")
      }

    function dltGroup() {
        dispatch(groupActions.dltGroup(id))
        history.push("/groups")
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
            <button onClick={showDeleteModal}>Delete</button>}

            <div className={dltClass}>
                <div className="dlt-modal-content">
                <button className='close-modal' onClick={hideModal}>X</button>
                <h3>Confirm delete</h3>
                <p>Are you sure you want to remove group {group?.name}?</p>
                <button onClick={dltGroup}>Yes, delete group</button>
                <button onClick={hideModal}>No, keep going</button>
                </div>
            </div>

            <h3>What we're about</h3>
            {group?.about}

            <h3>Events {`(${sorted.length})`}</h3>
            {sorted?.map((event) => {
                return (
                    <div className="event">
                        <NavLink to={`/event/${event?.id}`}>
                        <img src={event?.previewImage} alt="preview"></img>
                    <li key={event?.id}>
                        <p>{convertTime(event?.startDate)}</p>
                        <p>{event?.name}</p>
                        <p>{event?.Group.city}, {event?.Group.state}</p>
                        <p>{event?.description}</p>
                    </li>
                    </NavLink>
                    </div>
                )
            })}
            {past.length > 0 && <h3>Past events {`(${past.length})`}</h3>}
            {past?.map((event) => {
                    return (
                        <div className="event">
                         <NavLink to={`/event/${event?.id}`}>
                            <img src={event?.previewImage} alt="preview"></img>
                            <p>{event?.description}</p>
                        <li key={event?.id}>
                            <p>{convertTime(event?.startDate)}</p>
                            <p>{event?.name}</p>
                            <p>{event?.Group.city}, {event?.Group.state}</p>
                        </li>
                        </NavLink>
                        </div>
                ) 
            })}
        </div>
    )
    }
}
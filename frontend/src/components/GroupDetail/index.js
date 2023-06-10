import { useEffect, useState } from "react"
import { NavLink, useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import { getGroupEvents } from "../../store/events"
import { convertTime } from "../../App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    const locationIcon = "fa-light fa-location-dot"

    const currGroup = async () => {
        await fetch(`/api/groups/${id}`)
        .then(res => res.json())
        .then(data => setGroup(data))
    }
    
    function popup() {
        alert("Feature coming soon")
    }

    function createEvent() {
        history.push(`/new-event/${id}`)
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
        <div className="content">
            <div className="breadcrumb"><NavLink to="/groups">Groups</NavLink> {">"} {group?.name}</div>
            <div className="dtl-header">
                <div className="dtl-img"><img src={group?.GroupImages[0]?.url}></img></div>
                <div className="dtl-info">
                    <div className="dtl-name"><h2>{group?.name}</h2></div>
                    <div className="dtl-location">
                        <FontAwesomeIcon icon="fa-solid fa-location-dot" className="icon"/>{group?.city + ", "}
                        {group?.state}
                    </div>
                    <div className="dtl-event-num">
                        {sorted?.length} events · {group?.private && "Private group"} {!group?.private && "Public group"}
                    </div>
                    <div>
                        Organized by:
                        {" " + group?.Organizer?.firstName + " "}
                        {group?.Organizer?.lastName}
                    </div>

                <div className="dtl-buttons">
                    {sessionUser && sessionUser.id !== group?.Organizer?.id &&
                    <button onClick={popup} className="dtl-btn">Join this group</button>
                    }

                    {sessionUser && sessionUser.id === group?.Organizer?.id && 
                    <button onClick={createEvent} className="dtl-btn">Create event</button>}

                    {sessionUser && sessionUser.id === group?.Organizer?.id &&
                    <button onClick={updateGroup} className="dtl-btn">Update</button>}

                    {sessionUser && sessionUser.id === group?.Organizer?.id &&
                    <button onClick={showDeleteModal} className="dtl-btn">Delete</button>}
                </div>
            </div>
            </div>

            <div className={dltClass}>
                <div className="dlt-modal-content">
                <button className='close-modal' onClick={hideModal}>X</button>
                <h3>Confirm delete</h3>
                <p>Are you sure you want to remove group {group?.name}?</p>
                <button onClick={dltGroup}>Yes, delete group</button>
                <button onClick={hideModal}>No, keep going</button>
                </div>
            </div>

            <h3 className="dtl-caption">Organizer</h3>
                {group?.Organizer?.firstName} {group?.Organizer?.lastName}

            <h3 className="dtl-caption">What we're about</h3>
            <div className="dtl-about">
                {group?.about}
            </div>

            <h3 className="dtl-caption">Upcoming events {`(${sorted.length})`}</h3>
            {sorted?.map((event, idx) => {
                return (
                    <NavLink to={`/event/${event?.id}`} className="group-detail-link">
                    <div key={idx} className="event">
                        <div key={`${idx}-img`} className="grp-img">
                            <img src={event?.previewImage} alt="preview" key={`${idx}-pic`}></img>
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
            {past.length > 0 && <h3>Past events {`(${past.length})`}</h3>}
            {past?.map((event, idx) => {
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
        </div>
    )
    }
}
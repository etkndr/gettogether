import { useEffect, useState } from "react"
import { NavLink, useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"
import { convertTime } from "../../App"
import "./EventDetail.css"

export default function EventDetail () {
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    const sessionUser = useSelector(state => state.session.user)
    const event = useSelector(state => state.events.currEvent)
    const [group, setGroup] = useState()
    const [loaded, setLoaded] = useState(false)
    const [dltClass, setDltClass] = useState("dlt-modal-hidden")

    function popup() {
        alert("Feature coming soon")
    }

    function showDeleteModal(e) {
        e.preventDefault()
        setDltClass("dlt-modal")
      }
      
    function hideModal(e) {
        e.preventDefault()
        setDltClass("dlt-modal-hidden")
      }

    function dltEvent() {
        dispatch(eventActions.dltEvent(event?.id))
        history.push(`/group/${group.id}`)
    }

    let hostButtons
    if (sessionUser && sessionUser.id === group?.Organizer?.id) {
        hostButtons = (
            <div className="event-btns">
            <button className="dtl-btn" onClick={popup}>Update</button>
            <button className="dtl-btn" onClick={showDeleteModal}>Delete</button>
            </div>
        )
    }
    
    useEffect(() => {
        const currGroup = async (groupId) => {
            await fetch(`/api/groups/${groupId}`)
            .then(res => res.json())
            .then(data => setGroup(data))
        }
        dispatch(eventActions.getOneEvent(id))

        if (event?.groupId) {
        (currGroup(event?.groupId))
        }

        setLoaded(true)
    }, [dispatch, id, event?.groupId])

    if (loaded && event && group) {
    return (
        <div className="content">
            <div className={dltClass}>
                <div className="dlt-modal-content">
                <button className='close-modal' onClick={hideModal}>X</button>
                <h3>Confirm delete</h3>
                <p>Are you sure you want to remove event {event?.name}?</p>
                <button onClick={dltEvent}>Yes, delete event</button>
                <button onClick={hideModal}>No, keep going</button>
                </div>
            </div>

            <div className="breadcrumb">
                <NavLink to="/events">Events</NavLink> {`>`} {event?.name}
            </div>
                    <div className="dtl-name"><h2>{event?.name}</h2></div>
                Hosted by:
            {" " + group?.Organizer?.firstName + " "}
            {group?.Organizer?.lastName}
            <div className="dtl-header">
                <div className="dtl-img">
                    <img src={event?.EventImages[0]?.url} alt="event-image"></img>
                </div>
                <div className="dtl-info">
                    {/* ------ group info grid ------ */}
                    <div className="grp-grid">
                        <NavLink to={`/group/${group?.id}`}>
                        <div className="grp-grid-img">
                            <img src={group?.GroupImages[0]?.url}></img>
                        </div>
                        <div className="grp-grid-info">
                            <div className="grp-grid-name">{group?.name}</div>
                            <div className="grp-private">{group?.private && "Private group"}
                            {!group?.private && "Public group"}</div>
                        </div> 
                        </NavLink>
                    </div>                    

                    {/* ---icon grid --------- */}
                    <div className="icon-grid">
                    <div className="clock">
                        <i class="fa-regular fa-clock"></i>
                    </div>
                        <div className="clock-text">
                        <p><span className="start-end">START</span> {convertTime(event?.startDate)}</p>
                        <p><span className="start-end">END</span> {convertTime(event?.endDate)}</p>
                        </div>
                    <div className="dollar">
                        <i class="fa-regular fa-dollar-sign"></i>
                        </div>
                        <div className="dollar-text">
                            {event?.price || "FREE"}
                    </div>
                    <div className="marker">
                        <i class="fa-regular fa-location-dot"></i>
                        </div>
                        <div className="marker-text">
                            {event?.type}
                        </div>
                    </div>
                </div>
            </div>
                        <h3>
                            Description
                        </h3>
                        <div>
                            {event?.description}
                        </div>
                <div>
                    Group info: {group?.about}
                </div>
                {hostButtons}
        </div>
    )
}
}
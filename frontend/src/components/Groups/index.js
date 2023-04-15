import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Redirect } from "react-router-dom"
import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"
import "./Groups.css"

export default function Groups() {
    // const [groups, setGroups] = useState([])
    // const [events, setEvents] = useState([])
    // const [loading, setLoading] = useState(true)

    // function fetchGroups() {
    //     fetch("/api/groups")
    //     .then(res => {
    //         return res.json()
    //     })
    //     .then(data => {
    //         setGroups(data)
    //     })
    // }

    // function fetchEvents() {
    //     fetch("/api/events")
    //     .then(res => {
    //         return res.json()
    //     })
    //     .then(data => {
    //         setEvents(data)
    //     })
    // }

    // useEffect(() => {
    //     fetchGroups()
    //     fetchEvents()
    //     setLoading(false)

    // }, [])
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(groupActions.getGroups())
        dispatch(eventActions.getEvents())
      }, [dispatch]);
    
      
      const groupState = useSelector(state => state.groups)
      const groups = []
      Object.keys(groupState).forEach((id) => {
          groups.push(groupState[id])
        })
        
        const eventState = useSelector(state => state.events)
        const events = []
        Object.keys(eventState).forEach((id) => {
            events.push(eventState[id])
        })
        
        const numEvents = {}
        groups?.forEach((group) => {
            events?.forEach((event) => {
                if (event.groupId === group.id) {
                    if (numEvents[group.id]) {
                        numEvents[group.id]++
                    } else {
                        numEvents[group.id] = 1
                    }
                }
            })
        })

    return (
        <>
        <div className="select">
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
        </div>
        <div className="caption">
            Groups in getTogether
        </div>
            {groups?.map((group, idx) => {
                return (
                    <NavLink to={`/group/${group.id}`} className="group-detail-link">
                    <li key={idx} className="group">
                        <li key={`${idx}-img`}><img src={group.previewImage} alt="group img" /></li>
                        <li key={`${idx}-name`}>{group.name}</li>
                        <li key={`${idx}-city`}>{group.city}, {group.state}</li>
                        <li key={`${idx}-about`}>{group.about}</li>
                        {numEvents[group.id] || 0} events ·
                        <li key={`${idx}-events`}>
                        {group.private && <div>Private</div>}
                        {!group.private && <div>Public</div>}
                        </li>
                        <hr></hr>
                    </li>
                    </NavLink>
                )
            })}
        </>
    )
}
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Redirect } from "react-router-dom"
import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"
import "./Groups.css"

export default function Groups() {
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.allGroups)
    const events = useSelector(state => state.events.allEvents)
    
    useEffect(() => {
        dispatch(groupActions.getGroups())
        dispatch(eventActions.getEvents())
      }, [dispatch]);
        
        
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
            <h3>Groups in getTogether</h3>
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